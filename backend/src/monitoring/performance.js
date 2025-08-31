const db = require('../config/database');

class PerformanceMonitor {
  constructor() {
    this.startTime = Date.now();
    this.requestCount = 0;
    this.errorCount = 0;
    this.responseTimes = [];
  }

  // Record request metrics
  recordRequest(responseTime, success = true) {
    this.requestCount++;
    if (!success) this.errorCount++;
    
    this.responseTimes.push(responseTime);
    
    // Keep only last 100 response times
    if (this.responseTimes.length > 100) {
      this.responseTimes.shift();
    }
  }

  // Get performance metrics
  getMetrics() {
    const uptime = Date.now() - this.startTime;
    const avgResponseTime = this.responseTimes.length > 0 
      ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length 
      : 0;
    
    return {
      uptime: Math.floor(uptime / 1000), // seconds
      requestCount: this.requestCount,
      errorCount: this.errorCount,
      successRate: this.requestCount > 0 ? ((this.requestCount - this.errorCount) / this.requestCount * 100).toFixed(2) : 100,
      avgResponseTime: avgResponseTime.toFixed(2), // ms
      currentLoad: this.responseTimes.length
    };
  }

  // Get database performance
  async getDatabaseMetrics() {
    try {
      const [userCount, batchCount, eventCount] = await Promise.all([
        db.query('SELECT COUNT(*) as count FROM users'),
        db.query('SELECT COUNT(*) as count FROM batches'),
        db.query('SELECT COUNT(*) as count FROM events')
      ]);

      return {
        users: parseInt(userCount.rows[0].count),
        batches: parseInt(batchCount.rows[0].count),
        events: parseInt(eventCount.rows[0].count),
        database: 'Connected'
      };
    } catch (error) {
      return {
        database: 'Error',
        error: error.message
      };
    }
  }
}

module.exports = new PerformanceMonitor();