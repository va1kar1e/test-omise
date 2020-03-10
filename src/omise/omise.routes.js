import { Router } from 'express';
import { paymentController, verifyPaymentController, getTransactionController, transferController, recipientController, getTokenController, getSourceController, getEventController } from './controllers/omise.controller';

const omiseRouter = Router();

omiseRouter.get('/', function (req, res) {
    res.send('Omise')
})

paymentRouter.post('/', [paymentController]);

paymentRouter.get('/verify', [verifyPaymentController]);

paymentRouter.get('/transaction', [getTransactionController]);

omiseRouter.post('/transfer', [transferController]);

omiseRouter.post('/recipient', [recipientController]);

omiseRouter.post('/token', [getTokenController]);

omiseRouter.post('/source', [getSourceController]);

omiseRouter.get('/event', [getEventController]);

export { omiseRouter };
