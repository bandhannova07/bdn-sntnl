(function (global) {
  if (global.Sentinel) return;

  const Sentinel = {
    projectId: null,
    endpoint: '/api/ingest',
    sessionReplayEnabled: false,
    sessionEvents: [],
    sessionId: null,
    userId: null,
    _retryQueue: [],
    _retryTimer: null,
    _maxRetries: 3,
    _initialized: false,
    
    init: function (config) {
      if (this._initialized) return;
      this._initialized = true;

      this.projectId = config.projectId;
      if (config.endpoint) this.endpoint = config.endpoint;
      if (config.sessionReplay) this.sessionReplayEnabled = config.sessionReplay;
      if (config.userId) this.userId = config.userId;

      this.setupErrorTracking();
      this.setupLogTracking();
      this.setupTracing();
      this._startRetryWorker();

      if (this.sessionReplayEnabled) {
        this.loadRrwebAndStart();
      }

      console.info('[Sentinel] Initialized for project: ' + this.projectId);
    },

    sendPayload: function (path, payload) {
      if (!this.projectId) return;
      payload.project_id = this.projectId;
      payload.timestamp = new Date().toISOString();

      this._send(path, payload, 0);
    },

    _send: function(path, payload, attempt) {
      var self = this;
      fetch(this.endpoint + '/' + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).then(function(res) {
        if (!res.ok && attempt < self._maxRetries) {
          self._retryQueue.push({ path: path, payload: payload, attempt: attempt + 1 });
        }
      }).catch(function() {
        if (attempt < self._maxRetries) {
          self._retryQueue.push({ path: path, payload: payload, attempt: attempt + 1 });
        }
      });
    },

    _startRetryWorker: function() {
      var self = this;
      this._retryTimer = setInterval(function() {
        if (self._retryQueue.length === 0) return;
        var batch = self._retryQueue.splice(0, 10); // Process max 10 per tick
        batch.forEach(function(item) {
          self._send(item.path, item.payload, item.attempt);
        });
      }, 5000);
    },

    setupErrorTracking: function () {
      var self = this;
      
      window.addEventListener('error', function (event) {
        self.sendPayload('error', {
          message: event.message || 'Unknown error',
          stack: event.error ? event.error.stack : '',
          metadata: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            url: window.location.href
          }
        });
      });

      window.addEventListener('unhandledrejection', function (event) {
        self.sendPayload('error', {
          message: event.reason ? (event.reason.message || String(event.reason)) : 'Unhandled Promise Rejection',
          stack: event.reason && event.reason.stack ? event.reason.stack : '',
          metadata: {
            url: window.location.href,
            type: 'unhandledrejection'
          }
        });
      });
    },

    setupLogTracking: function () {
      var self = this;
      var methods = ['log', 'info', 'warn', 'error', 'debug'];
      var originalConsole = {};

      methods.forEach(function(method) {
        originalConsole[method] = console[method];
        console[method] = function () {
          var args = Array.prototype.slice.call(arguments);
          originalConsole[method].apply(console, args);
          
          // Skip Sentinel's own logs to prevent infinite loop
          if (args[0] && typeof args[0] === 'string' && args[0].indexOf('[Sentinel]') === 0) return;

          self.sendPayload('log', {
            level: method,
            message: args.map(function(a) { return typeof a === 'object' ? JSON.stringify(a) : String(a); }).join(' '),
            metadata: { url: window.location.href }
          });
        };
      });
    },

    setupTracing: function () {
      var self = this;
      var originalFetch = window.fetch;
      
      window.fetch = function () {
        var args = Array.prototype.slice.call(arguments);
        var startTime = Date.now();
        var requestUrl = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url) || 'unknown_url';
        
        // Skip tracing our own ingest endpoints
        if (requestUrl.indexOf('/api/ingest') !== -1) {
          return originalFetch.apply(this, args);
        }

        return originalFetch.apply(this, args).then(function(response) {
          var duration = Date.now() - startTime;
          
          self.sendPayload('trace', {
            trace_id: 'trace_' + Math.random().toString(36).substr(2, 9),
            name: 'FETCH ' + requestUrl,
            status: String(response.status),
            duration_ms: duration
          });
          
          return response;
        }).catch(function(error) {
          var duration = Date.now() - startTime;
          self.sendPayload('trace', {
            trace_id: 'trace_' + Math.random().toString(36).substr(2, 9),
            name: 'FETCH ' + requestUrl,
            status: 'ERROR',
            duration_ms: duration
          });
          throw error;
        });
      };
    },

    loadRrwebAndStart: function () {
      var self = this;
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/rrweb@2.0.0-alpha.11/dist/rrweb.min.js';
      script.onload = function () {
        if (global.rrweb) {
          self.startSessionReplay();
        }
      };
      document.head.appendChild(script);
    },

    startSessionReplay: function () {
      var self = this;
      var sessionStartTime = Date.now();
      var MAX_EVENTS = 500; // Cap events to prevent unbounded growth

      global.rrweb.record({
        emit: function(event) {
          if (self.sessionEvents.length < MAX_EVENTS) {
            self.sessionEvents.push(event);
          }
        },
      });

      // Flush every 10 seconds
      setInterval(function() {
        if (self.sessionEvents.length === 0) return;
        
        var events = self.sessionEvents.splice(0, self.sessionEvents.length);
        var payloadStr = JSON.stringify(events);

        // Skip if payload is too large (>5MB)
        if (payloadStr.length > 5 * 1024 * 1024) {
          console.info('[Sentinel] Session replay payload too large, dropping batch.');
          return;
        }

        self.sendPayload('session', {
          user_id: self.userId || 'anonymous',
          browser: navigator.userAgent,
          os: navigator.platform,
          duration_ms: Date.now() - sessionStartTime,
          payload: payloadStr
        });
      }, 10000);
    }
  };

  global.Sentinel = Sentinel;
})(window);
