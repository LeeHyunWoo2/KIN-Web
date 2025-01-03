const mongoose = require('mongoose');
const redisClient = require('../../config/redis');
const os = require('os');

const getStatus = async () => {
  const mongodbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  const redisStatus = redisClient.isConnected() ? 'Connected' : 'Disconnected';
  const now = new Date();
  const serverDate = now.toLocaleDateString("ko-KR");
  const serverTime = now.toLocaleTimeString("en-GB");

  return {
    mongodb: mongodbStatus,
    redis: redisStatus,
    uptime: os.uptime(),
    nodeUptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    cpuUsagePerCore: os.cpus().map(cpu => cpu.times.user), // 연산, 데이터 처리등 로직에 쓰인 cpu사용 시간
    cpuTotalUsage: os.totalmem(), // 총 메모리
    cpuFreeMemory: os.freemem(), // 시스템 여유 메모리
    loadAverage: os.loadavg(),
    serverTime: `${serverDate} - ${serverTime}`,
  };
};

module.exports = { getStatus };