class TelemetryService {
  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.apiUrl = import.meta.env.VITE_API_URL || '';
    this.localStorageKey = 'telemetry_logs';
    this.maxLocalLogs = 1000; // Keep last 1000 logs locally
  }

  async logEvent(eventType, params = {}) {
    const event = {
      timestamp: new Date().toISOString(),
      eventType,
      params,
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer
    };

    // Store locally in development
    if (this.isDevelopment) {
      this.storeLocalEvent(event);
    }

    // Send to server if authenticated
    try {
      const response = await fetch(`${this.apiUrl}/api/telemetry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType,
          params
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        console.warn('Telemetry event failed to send to server:', response.status);
      }
    } catch (error) {
      console.warn('Failed to send telemetry event:', error.message);
    }

    return event;
  }

  storeLocalEvent(event) {
    try {
      const existingLogs = this.getLocalLogs();
      existingLogs.push(event);
      
      // Keep only the last maxLocalLogs
      if (existingLogs.length > this.maxLocalLogs) {
        existingLogs.splice(0, existingLogs.length - this.maxLocalLogs);
      }
      
      localStorage.setItem(this.localStorageKey, JSON.stringify(existingLogs));
    } catch (error) {
      console.warn('Failed to store local telemetry event:', error.message);
    }
  }

  getLocalLogs() {
    try {
      const logs = localStorage.getItem(this.localStorageKey);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.warn('Failed to retrieve local telemetry logs:', error.message);
      return [];
    }
  }

  clearLocalLogs() {
    try {
      localStorage.removeItem(this.localStorageKey);
    } catch (error) {
      console.warn('Failed to clear local telemetry logs:', error.message);
    }
  }

  downloadLocalLogs() {
    try {
      const logs = this.getLocalLogs();
      const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `telemetry_logs_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download telemetry logs:', error.message);
    }
  }

  // Specific event methods
  async logPageView(pageName, params = {}) {
    return this.logEvent('page_view', { pageName, ...params });
  }

  async logButtonClick(buttonName, params = {}) {
    return this.logEvent('button_click', { buttonName, ...params });
  }

  async logFormSubmit(formName, params = {}) {
    return this.logEvent('form_submit', { formName, ...params });
  }

  async logSearch(searchType, params = {}) {
    return this.logEvent('search', { searchType, ...params });
  }

  async logExternalLink(provider, params = {}) {
    return this.logEvent('external_link', { provider, ...params });
  }

  async logError(errorType, params = {}) {
    return this.logEvent('error', { errorType, ...params });
  }
}

// Export singleton instance
export default new TelemetryService();
