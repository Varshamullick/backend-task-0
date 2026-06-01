const log4js = require('log4js');
const path = require('path');

log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: {
      type: 'file',
      filename: path.join(__dirname, '../../logs/app.log'),
      maxLogSize: 10485760, // 10MB
      numBackups: 3,
    },
  },
  categories: {
    default: { appenders: ['console', 'file'], level: process.env.LOG_LEVEL || 'info' },
  },
});

module.exports = log4js.getLogger('default');
