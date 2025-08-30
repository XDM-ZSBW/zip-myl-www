/**
 * Setup Wizard JavaScript
 * Handles the multi-step setup process for SSL certificates and extension configuration
 */

let currentStep = 1;
let setupData = {
    userInitials: '',
    deviceName: '',
    deviceId: null,
    uuidSubdomain: null
};

// Initialize wizard
document.addEventListener('DOMContentLoaded', function() {
    // Get device ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    setupData.deviceId = urlParams.get('deviceId');
    
    if (setupData.deviceId) {
        // Generate UUID subdomain
        setupData.uuidSubdomain = setupData.deviceId + '.myl.zip';
        
        // Update display elements
        document.getElementById('extension-device-id').textContent = setupData.deviceId;
        document.getElementById('display-device-id').textContent = setupData.deviceId;
        document.getElementById('display-ssl-domain').textContent = setupData.uuidSubdomain;
        document.getElementById('ssl-domain').textContent = setupData.uuidSubdomain;
        document.getElementById('summary-domain').textContent = setupData.uuidSubdomain;
    }
    
    updateProgress();
});

// Navigation functions
function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < 4) {
            currentStep++;
            showStep(currentStep);
            updateProgress();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgress();
    }
}

function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.wizard-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    document.getElementById(`step-${stepNumber}`).classList.add('active');
}

function updateProgress() {
    // Update progress indicators
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber === currentStep) {
            step.classList.add('active');
        } else if (stepNumber < currentStep) {
            step.classList.add('completed');
        }
    });
}

function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            return validateUserInfo();
        case 2:
            return true; // SSL setup validation handled in provisionSSL()
        case 3:
            return true; // API key generation validation handled in generateApiKey()
        default:
            return true;
    }
}

function validateUserInfo() {
    const userInitials = document.getElementById('userInitials').value.trim();
    const deviceName = document.getElementById('deviceName').value.trim();
    
    if (!userInitials) {
        showError('Please enter your initials or email');
        return false;
    }
    
    if (!deviceName) {
        showError('Please enter a device name');
        return false;
    }
    
    if (!setupData.deviceId) {
        showError('Device ID not found. Please use the Chrome extension to access this page.');
        return false;
    }
    
    // Store data
    setupData.userInitials = userInitials;
    setupData.deviceName = deviceName;
    
    return true;
}

// SSL Provisioning
async function provisionSSL() {
    const statusEl = document.getElementById('ssl-status');
    const spinnerEl = document.getElementById('ssl-spinner');
    const statusTextEl = statusEl.querySelector('.status-text');
    
    // Show loading state
    statusEl.className = 'status-indicator pending';
    statusTextEl.textContent = 'Provisioning SSL certificate...';
    spinnerEl.style.display = 'inline-block';
    
    try {
        const response = await fetch('https://api.myl.zip/api/v1/ssl/provision', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                deviceId: setupData.deviceId,
                uuidSubdomain: setupData.uuidSubdomain,
                userInitials: setupData.userInitials,
                deviceName: setupData.deviceName
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                statusEl.className = 'status-indicator success';
                statusTextEl.textContent = 'SSL certificate provisioned successfully!';
                setTimeout(() => nextStep(), 2000);
            } else {
                throw new Error(data.message || 'SSL provisioning failed');
            }
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('SSL provisioning error:', error);
        statusEl.className = 'status-indicator error';
        statusTextEl.textContent = `Error: ${error.message}`;
    } finally {
        spinnerEl.style.display = 'none';
    }
}

// API Key Generation
async function generateApiKey() {
    const statusEl = document.getElementById('api-key-status');
    const spinnerEl = document.getElementById('api-key-spinner');
    const statusTextEl = statusEl.querySelector('.status-text');
    
    // Show loading state
    statusEl.className = 'status-indicator pending';
    statusTextEl.textContent = 'Generating API key...';
    spinnerEl.style.display = 'inline-block';
    
    try {
        const response = await fetch('https://api.myl.zip/api/v1/device/generate-key', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                deviceId: setupData.deviceId,
                deviceName: setupData.deviceName,
                userInitials: setupData.userInitials
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.apiKey) {
                statusEl.className = 'status-indicator success';
                statusTextEl.textContent = 'API key generated successfully!';
                
                // Store API key for display
                setupData.apiKey = data.apiKey;
                
                setTimeout(() => nextStep(), 2000);
            } else {
                throw new Error(data.message || 'API key generation failed');
            }
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('API key generation error:', error);
        statusEl.className = 'status-indicator error';
        statusTextEl.textContent = `Error: ${error.message}`;
    } finally {
        spinnerEl.style.display = 'none';
    }
}

// Copy API Key
function copyApiKey() {
    const apiKeyInput = document.getElementById('generated-api-key');
    if (setupData.apiKey) {
        apiKeyInput.value = setupData.apiKey;
        apiKeyInput.select();
        document.execCommand('copy');
        
        // Show feedback
        const copyBtn = document.querySelector('.api-key-container .btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.background = '#4CAF50';
        copyBtn.style.color = 'white';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
            copyBtn.style.color = '';
        }, 2000);
    }
}

// Download Configuration
function downloadConfig() {
    const config = {
        deviceId: setupData.deviceId,
        apiKey: setupData.apiKey,
        uuidSubdomain: setupData.uuidSubdomain,
        deviceName: setupData.deviceName,
        userInitials: setupData.userInitials,
        setupDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mylzip-config-${setupData.deviceId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Restart Wizard
function restartWizard() {
    if (confirm('Are you sure you want to start over? All progress will be lost.')) {
        currentStep = 1;
        setupData = {
            userInitials: '',
            deviceName: '',
            deviceId: setupData.deviceId, // Keep device ID
            uuidSubdomain: setupData.uuidSubdomain // Keep UUID subdomain
        };
        
        // Clear form fields
        document.getElementById('userInitials').value = '';
        document.getElementById('deviceName').value = '';
        
        showStep(1);
        updateProgress();
    }
}

// Utility functions
function showError(message) {
    // Create a simple error notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function showSuccess(message) {
    // Create a simple success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Extension communication
function setupExtensionCommunication() {
    // Listen for extension events
    document.addEventListener('mylzip-device-ready', (event) => {
        console.log('Extension device ready:', event.detail);
        if (event.detail.deviceId && !setupData.deviceId) {
            setupData.deviceId = event.detail.deviceId;
            document.getElementById('extension-device-id').textContent = setupData.deviceId;
        }
    });
    
    // Send device info to extension if available
    if (typeof chrome !== 'undefined' && chrome.runtime) {
        window.postMessage({
            type: 'mylzip-portal-request',
            action: 'get-device-info'
        }, '*');
    }
}

// Initialize extension communication
setupExtensionCommunication();
