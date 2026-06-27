import winston from 'winston';

export const login_logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'src/logs/login.log' })  
  ]
});

export const apiKeys_logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'src/logs/apiKeys.log' })  
  ]
});

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: "src/logs/service.log"
    })
  ]
});
