const redis = require('redis');

const redisClient = redis.createClient({
    socket: {
      host: 'localhost', // or your Redis host
      port: 6379         // default Redis port
    }
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.connect().then(() => {
  console.log('Connected to Redis ✔️');
}).catch((err) => {
  console.error('Redis connect failed ❌', err);
});

module.exports = redisClient;
