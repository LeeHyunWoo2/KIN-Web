const schedule = require('node-schedule');
const { backupDatabase } = require('../services/notes/backupService');

schedule.scheduleJob('0 0 * * *', () => {
  console.log('백업 실행 : ', new Date());
  backupDatabase();
});