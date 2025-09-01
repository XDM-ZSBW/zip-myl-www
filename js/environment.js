/**
 * Environment Configuration for Myl.Zip Web Frontend
 * Automatically detects development vs production environment
 */

class WebEnvironmentConfig {
  constructor() {
    this.environment = this.detectEnvironment();
    this.config = this.getEnvironmentConfig();
    this.logEnvironmentInfo();
  }

  detectEnvironment() {
    // Check hostname and port to determine environment
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    // Development indicators
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development';
    }
    
    // Staging indicators
    if (hostname.includes('stage') || hostname.includes('staging') || hostname.includes('dev')) {
      return 'staging';
    }
    
    // Production indicators
    if (hostname === 'myl.zip' || hostname.endsWith('.myl.zip')) {
      return 'production';
    }
    
    // Default to development for unknown environments
    return 'development';
  }

  getEnvironmentConfig() {
    const configs = {
      development: {
        environment: 'development',
        api: {
          primary: 'http://localhost:3333',
          fallback: 'http://localhost:3333',
          chat: 'http://localhost:3333/chat',
          health: 'http://localhost:3333/chat/health',
          mykeys: 'http://localhost:3334' // Future MyKeys.zip API
        },
        frontend: {
          primary: 'http://localhost:8080',
          setupWizard: 'http://localhost:8080/setup-wizard.html',
          auth: 'http://localhost:8080/auth.html'
        },
        features: {
          enableDebugLogging: true,
          enableVerboseErrors: true,
          enableTestEndpoints: true,
          authRequired: false,
          enableChatSync: true,
          enableImagePaste: true
        }
      },
      staging: {
        environment: 'staging',
        api: {
          primary: 'https://api-staging.myl.zip',
          fallback: 'https://api-staging.mykeys.zip',
          chat: 'https://api-staging.myl.zip/chat',
          health: 'https://api-staging.myl.zip/chat/health',
          mykeys: 'https://api-staging.mykeys.zip'
        },
        frontend: {
          primary: 'https://staging.myl.zip',
          setupWizard: 'https://staging.myl.zip/setup-wizard.html',
          auth: 'https://staging.myl.zip/auth.html'
        },
        features: {
          enableDebugLogging: true,
          enableVerboseErrors: true,
          enableTestEndpoints: true,
          authRequired: true,
          enableChatSync: true,
          enableImagePaste: true
        }
      },
      production: {
        environment: 'production',
        api: {
          primary: 'https://api.myl.zip',
          fallback: 'https://api.mykeys.zip',
          chat: 'https://api.myl.zip/chat',
          health: 'https://api.myl.zip/chat/health',
          mykeys: 'https://api.mykeys.zip'
        },
        frontend: {
          primary: 'https://myl.zip',
          setupWizard: 'https://myl.zip/setup-wizard.html',
          auth: 'https://myl.zip/auth.html'
        },
        features: {
          enableDebugLogging: false,
          enableVerboseErrors: false,
          enableTestEndpoints: false,
          authRequired: true,
          enableChatSync: true,
          enableImagePaste: true
        }
      }
    };

    return configs[this.environment];
  }

  getApiUrl(endpoint = '') {
    const baseUrl = this.config.api.primary;
    return endpoint ? `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}` : baseUrl;
  }

  getChatUrl(endpoint = '') {
    const baseUrl = this.config.api.chat;
    return endpoint ? `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}` : baseUrl;
  }

  getMyKeysUrl(endpoint = '') {
    const baseUrl = this.config.api.mykeys;
    return endpoint ? `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}` : baseUrl;
  }

  getFrontendUrl(page = '') {
    const baseUrl = this.config.frontend.primary;
    return page ? `${baseUrl}${page.startsWith('/') ? page : '/' + page}` : baseUrl;
  }

  getSetupWizardUrl(params = {}) {
    let url = this.config.frontend.setupWizard;
    
    if (Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params);
      url += '?' + searchParams.toString();
    }
    
    return url;
  }

  getAuthUrl(params = {}) {
    let url = this.config.frontend.auth;
    
    if (Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params);
      url += '?' + searchParams.toString();
    }
    
    return url;
  }

  isProduction() {
    return this.environment === 'production';
  }

  isDevelopment() {
    return this.environment === 'development';
  }

  isStaging() {
    return this.environment === 'staging';
  }

  shouldLog(level = 'info') {
    if (!this.config.features.enableDebugLogging) {
      return level === 'error' || level === 'warn';
    }
    return true;
  }

  getHeaders(includeAuth = false) {
    const headers = {
      'Content-Type': 'application/json',
      'X-Client-Version': '1.0.0', // Could be dynamic
      'X-Client-Environment': this.environment,
      'X-Client-Type': 'web'
    };

    if (includeAuth && this.config.features.authRequired) {
      // In production, we would add authentication headers
      // headers['Authorization'] = 'Bearer ' + authToken;
    }

    return headers;
  }

  logEnvironmentInfo() {
    if (this.shouldLog('info')) {
      console.log(`🌍 Myl.Zip Web Environment: ${this.environment.toUpperCase()}`);
      console.log(`🔗 API Base URL: ${this.config.api.primary}`);
      console.log(`💬 Chat Base URL: ${this.config.api.chat}`);
      console.log(`🔑 MyKeys Base URL: ${this.config.api.mykeys}`);
      console.log(`🌐 Frontend Base URL: ${this.config.frontend.primary}`);
      console.log(`🔐 Auth Required: ${this.config.features.authRequired}`);
      console.log(`🚀 Debug Logging: ${this.config.features.enableDebugLogging}`);
    }
  }

  // Utility method to make environment-aware API calls
  async makeApiCall(endpoint, options = {}) {
    const url = this.getApiUrl(endpoint);
    const headers = this.getHeaders(options.requireAuth);
    
    const requestOptions = {
      method: options.method || 'GET',
      headers: { ...headers, ...options.headers },
      ...options
    };

    if (this.shouldLog('debug')) {
      console.log(`🔗 API Call [${this.environment}]:`, url, requestOptions);
    }

    try {
      const response = await fetch(url, requestOptions);
      
      if (this.shouldLog('debug')) {
        console.log(`✅ API Response [${response.status}]:`, url);
      }
      
      return response;
    } catch (error) {
      if (this.shouldLog('error')) {
        console.error(`❌ API Error [${this.environment}]:`, url, error);
      }
      throw error;
    }
  }

  // Utility method to make environment-aware chat API calls
  async makeChatCall(endpoint, options = {}) {
    const url = this.getChatUrl(endpoint);
    const headers = this.getHeaders(options.requireAuth);
    
    const requestOptions = {
      method: options.method || 'GET',
      headers: { ...headers, ...options.headers },
      ...options
    };

    if (this.shouldLog('debug')) {
      console.log(`💬 Chat API Call [${this.environment}]:`, url, requestOptions);
    }

    try {
      const response = await fetch(url, requestOptions);
      
      if (this.shouldLog('debug')) {
        console.log(`✅ Chat API Response [${response.status}]:`, url);
      }
      
      return response;
    } catch (error) {
      if (this.shouldLog('error')) {
        console.error(`❌ Chat API Error [${this.environment}]:`, url, error);
      }
      throw error;
    }
  }
}

// Export singleton instance
const webEnvironmentConfig = new WebEnvironmentConfig();

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.WebEnvironmentConfig = WebEnvironmentConfig;
  window.webEnvironmentConfig = webEnvironmentConfig;
}

// Export for Node.js (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WebEnvironmentConfig, webEnvironmentConfig };
}

