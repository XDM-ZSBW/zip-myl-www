// Setup Wizard JavaScript
// Handles UI interactions and API calls to the backend

class SetupWizard {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 4;
    this.userData = {};
    this.apiBaseUrl = 'https://api.myl.zip';
    
    this.initializeWizard();
  }

  initializeWizard() {
    this.updateProgressBar();
    this.attachEventListeners();
  }

  attachEventListeners() {
    // Form validation on input
    const inputs = document.querySelectorAll('.setup-form input');
    inputs.forEach(input => {
      input.addEventListener('input', () => this.validateForm());
    });

    // Enter key to proceed
    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && this.currentStep === 1) {
        this.nextStep();
      }
    });
  }

  validateForm() {
    const form = document.querySelector('.setup-form');
    const inputs = form.querySelectorAll('input[required]');
    const continueBtn = document.querySelector('#step-1 .btn-primary');
    
    let isValid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
      }
    });
    
    continueBtn.disabled = !isValid;
  }

  nextStep() {
    if (this.currentStep === 1) {
      if (!this.validateStep1()) return;
      this.collectUserData();
    }
    
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.showStep(this.currentStep);
      this.updateProgressBar();
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.showStep(this.currentStep);
      this.updateProgressBar();
    }
  }

  showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.wizard-step').forEach(step => {
      step.classList.remove('active');
    });
    
    // Show current step
    const currentStepElement = document.getElementById(`step-${stepNumber}`);
    if (currentStepElement) {
      currentStepElement.classList.add('active');
    }
  }

  updateProgressBar() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
      const stepNumber = index + 1;
      step.classList.remove('active', 'completed');
      
      if (stepNumber === this.currentStep) {
        step.classList.add('active');
      } else if (stepNumber < this.currentStep) {
        step.classList.add('completed');
      }
    });
  }

  validateStep1() {
    const userInitials = document.getElementById('userInitials').value.trim();
    const deviceName = document.getElementById('deviceName').value.trim();
    const domain = document.getElementById('domain').value.trim();
    
    if (!userInitials || !deviceName || !domain) {
      this.showError('Please fill in all required fields');
      return false;
    }
    
    // Basic domain validation
    if (!this.isValidDomain(domain)) {
      this.showError('Please enter a valid domain (e.g., example.com)');
      return false;
    }
    
    return true;
  }

  isValidDomain(domain) {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  }

  collectUserData() {
    this.userData = {
      userInitials: document.getElementById('userInitials').value.trim(),
      deviceName: document.getElementById('deviceName').value.trim(),
      domain: document.getElementById('domain').value.trim()
    };
    
    // Update step 2 with collected data
    document.getElementById('ssl-domain').textContent = this.userData.domain;
  }

  async provisionSSL() {
    const statusElement = document.getElementById('ssl-status');
    const spinner = document.getElementById('ssl-spinner');
    const button = document.querySelector('#step-2 .btn-primary');
    
    try {
      // Update UI
      statusElement.className = 'status-indicator';
      statusElement.querySelector('.status-text').textContent = 'Provisioning SSL certificate...';
      spinner.style.display = 'block';
      button.disabled = true;
      
      // Call backend API
      const response = await this.callBackendAPI('/api/v1/ssl/provision', {
        method: 'POST',
        body: JSON.stringify({
          domain: this.userData.domain,
          userInitials: this.userData.userInitials,
          deviceName: this.userData.deviceName
        })
      });
      
      if (response.success) {
        this.userData.deviceId = response.deviceId;
        this.userData.sslCertificate = response.certificate;
        
        statusElement.className = 'status-indicator status-success';
        statusElement.querySelector('.status-text').textContent = 'SSL certificate provisioned successfully!';
        
        // Enable next step
        setTimeout(() => {
          this.nextStep();
        }, 1500);
      } else {
        throw new Error(response.error || 'Failed to provision SSL certificate');
      }
    } catch (error) {
      console.error('SSL provision error:', error);
      statusElement.className = 'status-indicator status-error';
      statusElement.querySelector('.status-text').textContent = `Error: ${error.message}`;
    } finally {
      spinner.style.display = 'none';
      button.disabled = false;
    }
  }

  async generateApiKey() {
    const statusElement = document.getElementById('api-key-status');
    const spinner = document.getElementById('api-key-spinner');
    const button = document.querySelector('#step-3 .btn-primary');
    
    try {
      // Update UI
      statusElement.className = 'status-indicator';
      statusElement.querySelector('.status-text').textContent = 'Generating API key...';
      spinner.style.display = 'block';
      button.disabled = true;
      
      // Update device ID display
      document.getElementById('extension-device-id').textContent = this.userData.deviceId;
      
      // Call backend API
      const response = await this.callBackendAPI('/api/v1/ssl/generate-extension-key', {
        method: 'POST',
        body: JSON.stringify({
          deviceId: this.userData.deviceId,
          userInitials: this.userData.userInitials,
          deviceName: this.userData.deviceName
        })
      });
      
      if (response.success) {
        this.userData.apiKey = response.apiKey;
        
        statusElement.className = 'status-indicator status-success';
        statusElement.querySelector('.status-text').textContent = 'API key generated successfully!';
        
        // Enable next step
        setTimeout(() => {
          this.nextStep();
          this.displayCompletion();
        }, 1500);
      } else {
        throw new Error(response.error || 'Failed to generate API key');
      }
    } catch (error) {
      console.error('API key generation error:', error);
      statusElement.className = 'status-indicator status-error';
      statusElement.querySelector('.status-text').textContent = `Error: ${error.message}`;
    } finally {
      spinner.style.display = 'none';
      button.disabled = false;
    }
  }

  displayCompletion() {
    // Update completion summary
    document.getElementById('summary-domain').textContent = this.userData.domain;
    document.getElementById('generated-api-key').value = this.userData.apiKey;
  }

  async callBackendAPI(endpoint, options = {}) {
    const url = `${this.apiBaseUrl}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options
    };
    
    try {
      const response = await fetch(url, defaultOptions);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  async copyApiKey() {
    const apiKeyInput = document.getElementById('generated-api-key');
    
    try {
      await navigator.clipboard.writeText(apiKeyInput.value);
      this.showSuccess('API key copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy API key:', error);
      this.showError('Failed to copy API key');
    }
  }

  async downloadConfig() {
    const config = {
      userInitials: this.userData.userInitials,
      deviceName: this.userData.deviceName,
      domain: this.userData.domain,
      deviceId: this.userData.deviceId,
      apiKey: this.userData.apiKey,
      sslCertificate: this.userData.sslCertificate,
      setupDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `zip-myl-config-${this.userData.userInitials}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.showSuccess('Configuration downloaded!');
  }

  restartWizard() {
    // Reset form
    document.getElementById('userInitials').value = '';
    document.getElementById('deviceName').value = '';
    document.getElementById('domain').value = '';
    
    // Reset user data
    this.userData = {};
    
    // Go back to step 1
    this.currentStep = 1;
    this.showStep(1);
    this.updateProgressBar();
    
    // Reset validation
    this.validateForm();
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      z-index: 1000;
      animation: slideIn 0.3s ease;
      ${type === 'success' ? 'background: #27ae60;' : ''}
      ${type === 'error' ? 'background: #e74c3c;' : ''}
      ${type === 'info' ? 'background: #3498db;' : ''}
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Initialize wizard when page loads
document.addEventListener('DOMContentLoaded', () => {
  window.setupWizard = new SetupWizard();
});

// Global functions for onclick handlers
function nextStep() {
  window.setupWizard.nextStep();
}

function prevStep() {
  window.setupWizard.prevStep();
}

function provisionSSL() {
  window.setupWizard.provisionSSL();
}

function generateApiKey() {
  window.setupWizard.generateApiKey();
}

function copyApiKey() {
  window.setupWizard.copyApiKey();
}

function downloadConfig() {
  window.setupWizard.downloadConfig();
}

function restartWizard() {
  window.setupWizard.restartWizard();
}
