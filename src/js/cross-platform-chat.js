// Cross-Platform Chat System for MyL.Zip
// Enables real-time communication between web frontend and Chrome extension

class CrossPlatformChat {
  constructor() {
    this.apiUrl = 'http://localhost:3333';
    this.deviceId = this.generateDeviceId();
    this.eventSource = null;
    this.isConnected = false;
    this.messageHistory = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    
    this.initializeChat();
  }

  generateDeviceId() {
    const storedId = localStorage.getItem('mylzip_device_id');
    if (storedId) return storedId;
    
    const newId = `web-frontend-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('mylzip_device_id', newId);
    return newId;
  }

  async initializeChat() {
    console.log('🚀 Initializing cross-platform chat system...');
    console.log(`📱 Device ID: ${this.deviceId}`);
    
    // Test API connection
    await this.testApiConnection();
    
    // Start event stream
    this.startEventStream();
    
    // Load message history
    await this.loadMessageHistory();
    
    // Set up periodic health checks
    this.startHealthChecks();
  }

  async testApiConnection() {
    try {
      const response = await fetch(`${this.apiUrl}/chat/health`);
      const data = await response.json();
      
      if (data.status === 'healthy') {
        console.log('✅ Backend API connection successful');
        return true;
      } else {
        throw new Error('Backend not healthy');
      }
    } catch (error) {
      console.error('❌ Backend API connection failed:', error);
      return false;
    }
  }

  startEventStream() {
    if (this.eventSource) {
      this.eventSource.close();
    }

    try {
      this.eventSource = new EventSource(`${this.apiUrl}/chat/stream/${this.deviceId}`);
      
      this.eventSource.onopen = () => {
        console.log('📡 Event stream connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.updateConnectionStatus(true);
        
        // Clear any polling fallback
        if (this.pollingInterval) {
          clearInterval(this.pollingInterval);
          this.pollingInterval = null;
        }
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleIncomingMessage(data);
        } catch (error) {
          console.error('Error parsing event data:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('📡 Event stream error:', error);
        this.isConnected = false;
        this.updateConnectionStatus(false);
        
        // Start polling fallback immediately
        this.startPollingFallback();
        
        // Try to reconnect EventSource
        this.scheduleReconnect();
      };

      this.eventSource.addEventListener('connected', (event) => {
        console.log('✅ Connected to chat stream');
      });

      this.eventSource.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        this.handleIncomingMessage(data);
      });

      this.eventSource.addEventListener('ping', (event) => {
        // Keep connection alive
        console.log('💓 Ping received');
      });

    } catch (error) {
      console.error('❌ Failed to start event stream:', error);
      this.startPollingFallback();
      this.scheduleReconnect();
    }
  }

  startPollingFallback() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
    
    console.log('🔄 Starting polling fallback for chat messages...');
    
    this.pollingInterval = setInterval(async () => {
      try {
        const response = await fetch(`${this.apiUrl}/chat/history/${this.deviceId}?limit=10`);
        const data = await response.json();
        
        if (data.messages && data.messages.length > 0) {
          // Check for new messages
          const lastMessage = this.messageHistory[this.messageHistory.length - 1];
          const newMessages = data.messages.filter(msg => {
            if (!lastMessage) return true;
            return msg.timestamp > lastMessage.timestamp;
          });
          
          newMessages.forEach(msg => {
            this.handleIncomingMessage(msg);
          });
        }
      } catch (error) {
        console.error('❌ Polling fallback error:', error);
      }
    }, 2000); // Poll every 2 seconds
  }

  handleIncomingMessage(data) {
    console.log('📨 Received message:', data);
    
    if (data.type === 'message' || data.type === 'broadcast' || data.message || data.content) {
      // Handle both 'message' and 'content' fields - backend sends 'message'
      const messageContent = data.message || data.content;
      const messageId = data.id || data.broadcastId;
      
      console.log('📝 Processing message content:', messageContent);
      console.log('🆔 Message ID:', messageId);
      console.log('📱 Source device:', data.sourceDeviceId);
      console.log('🆔 Current device:', this.deviceId);
      
      // Don't process our own messages
      if (data.sourceDeviceId === this.deviceId) {
        console.log('🚫 Skipping own message');
        return;
      }
      
      // Add to message history
      this.messageHistory.push({
        id: messageId,
        message: messageContent,
        sourceDeviceId: data.sourceDeviceId,
        timestamp: data.timestamp || new Date().toISOString(),
        type: data.type || 'broadcast'
      });

      // Keep only last 100 messages
      if (this.messageHistory.length > 100) {
        this.messageHistory.shift();
      }

      console.log('📚 Message history length:', this.messageHistory.length);

      // Display message in UI
      this.displayMessage({
        id: messageId,
        message: messageContent,
        sourceDeviceId: data.sourceDeviceId,
        timestamp: data.timestamp || new Date().toISOString(),
        type: data.type || 'broadcast'
      });
      
      // Trigger UI update
      this.updateChatUI();
    } else {
      console.log('❌ Message format not recognized:', data);
    }
  }

  async sendMessage(message) {
    if (!message.trim()) return;

    try {
      const response = await fetch(`${this.apiUrl}/chat/broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          sourceDeviceId: this.deviceId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('📤 Message sent successfully:', data);
        
        // Add to local history
        this.messageHistory.push({
          id: data.broadcastId,
          message: message,
          sourceDeviceId: this.deviceId,
          timestamp: new Date().toISOString(),
          type: 'sent'
        });

        // Display message in UI
        this.displayMessage({
          id: data.broadcastId,
          message: message,
          sourceDeviceId: this.deviceId,
          timestamp: new Date().toISOString(),
          type: 'sent'
        });

        return true;
      } else {
        console.error('❌ Failed to send message:', data);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
      return false;
    }
  }

  async loadMessageHistory() {
    try {
      const response = await fetch(`${this.apiUrl}/chat/history/${this.deviceId}`);
      const data = await response.json();
      
      if (data.messages) {
        this.messageHistory = data.messages;
        console.log(`📚 Loaded ${data.messages.length} messages from history`);
        
        // Display messages in UI
        this.messageHistory.forEach(msg => {
          this.displayMessage(msg);
        });
        
        this.updateChatUI();
      }
    } catch (error) {
      console.error('❌ Error loading message history:', error);
    }
  }

  displayMessage(data) {
    // This will be overridden by the UI implementation
    if (window.displayCrossPlatformMessage) {
      // Extract message content properly
      let messageContent = '';
      let sender = 'incoming';
      
      if (typeof data === 'string') {
        messageContent = data;
      } else if (data && typeof data === 'object') {
        messageContent = data.content || data.message || data.text || JSON.stringify(data);
        sender = data.sourceDeviceId === this.deviceId ? 'user' : 'incoming';
      } else {
        messageContent = String(data);
      }
      
      window.displayCrossPlatformMessage(messageContent, sender);
    } else {
      console.log('📨 Message:', data.message || data.content || data, 'from:', data.sourceDeviceId);
    }
  }

  updateChatUI() {
    // This will be overridden by the UI implementation
    if (window.updateCrossPlatformChatUI) {
      window.updateCrossPlatformChatUI(this.messageHistory);
    }
  }

  updateConnectionStatus(connected) {
    // This will be overridden by the UI implementation
    if (window.updateCrossPlatformConnectionStatus) {
      window.updateCrossPlatformConnectionStatus(connected, this.pollingInterval ? 'polling' : 'streaming');
    }
  }

  scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Scheduling reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${this.reconnectDelay}ms`);
      
      setTimeout(() => {
        console.log('🔄 Attempting to reconnect...');
        this.startEventStream();
      }, this.reconnectDelay);
      
      // Exponential backoff
      this.reconnectDelay *= 2;
    } else {
      console.error('❌ Max reconnect attempts reached');
    }
  }

  startHealthChecks() {
    setInterval(async () => {
      if (!this.isConnected) {
        console.log('🔍 Health check: Connection lost, attempting reconnect...');
        this.startEventStream();
      }
    }, 30000); // Check every 30 seconds

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('📱 Page hidden, pausing connections...');
        if (this.eventSource) {
          this.eventSource.close();
        }
      } else {
        console.log('📱 Page visible, resuming connections...');
        this.startEventStream();
      }
    });
  }

  getConnectedDevices() {
    return fetch(`${this.apiUrl}/chat/devices`)
      .then(response => response.json())
      .catch(error => {
        console.error('❌ Error getting connected devices:', error);
        return { devices: [] };
      });
  }

  async getSuggestions(context = 'general') {
    try {
      const response = await fetch(`${this.apiUrl}/chat/suggestions/${this.deviceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context })
      });

      const data = await response.json();
      return data.suggestions || [];
    } catch (error) {
      console.error('❌ Error getting suggestions:', error);
      return [];
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isConnected = false;
    console.log('🔌 Disconnected from chat system');
  }

  getStatus() {
    return {
      isConnected: this.isConnected,
      deviceId: this.deviceId,
      messageCount: this.messageHistory.length,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// Initialize cross-platform chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.crossPlatformChat = new CrossPlatformChat();
  
  // Make it globally available
  window.CrossPlatformChat = CrossPlatformChat;
  
  console.log('🚀 Cross-platform chat system initialized');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CrossPlatformChat;
}
