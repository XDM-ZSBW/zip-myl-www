// ZIP-MYL-WWW Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ZIP-MYL-WWW loaded successfully!');
    
    // Add some interactive features
    addDeploymentInfo();
    addSmoothScrolling();
    addFeatureAnimations();
});

function addDeploymentInfo() {
    const footer = document.querySelector('footer p');
    const deploymentTime = new Date().toLocaleString();
    footer.innerHTML += `<br><small>Last deployed: ${deploymentTime}</small>`;
}

function addSmoothScrolling() {
    // Add smooth scrolling for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function addFeatureAnimations() {
    // Add intersection observer for feature animations
    const features = document.querySelectorAll('.feature');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    features.forEach(feature => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateY(20px)';
        feature.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(feature);
    });
}

// Add a simple loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Add some utility functions
window.ZIPMYLWWW = {
    getDeploymentInfo: function() {
        return {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
    },
    
    logDeployment: function() {
        console.log('📦 Deployment Info:', this.getDeploymentInfo());
    }
};

// Log deployment info on load
ZIPMYLWWW.logDeployment();
