import cron from 'node-cron';
import { updatePendingTransaction, event } from './omise/use-cases/omise.use-cases';

cron.schedule('*/15 * * * * *', function () {
    event().then(function(omiseEvent){
        console.log("[Omise Event Trigger] " + omiseEvent.from + " - " + omiseEvent.to);
        updatePendingTransaction(omiseEvent.data);
    }).catch(function(err){
        throw err;
    });
});