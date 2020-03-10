import express from 'express';
import { config } from './config/config';
import { omiseRouter } from './omise/omise.routes';
import './cronJob';
import cors from 'cors';
import { HealthChecker, LivenessEndpoint} from '@cloudnative/health-connect';
import log4js from 'log4js';

(async () => {

  const healthChecker = new HealthChecker();
  const app = express();
  const logger = log4js.getLogger('app');

  app.use(cors());
  app.use(express.json());

  app.use('/', omiseRouter);

  app.use('/live', LivenessEndpoint(healthChecker));

  app.listen(config.port, (err) => {
    if (err) {
      logger.error(`Server is down with cause: ${err}`);
    }
    logger.info(`Server is up at: ${config.port}`);
  });
})();


