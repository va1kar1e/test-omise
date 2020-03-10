import { charge, verify, transaction, transfer, recipient, getsource, gettoken, event } from '../use-cases/omise.use-cases'

function makePaymentController() {
    return function (req, res) {
        const payment = req.body;
        metadata = {
            method: payment.method,
            token: payment.token,
            source: payment.source,
            amount: payment.amount,
            currency: "thb",
            returnURL: payment.returnURL,
            description: payment.description,
            userID: "000001",
            contentID: payment.content,
            transactionID: "tran_00001"
        }
        charge(metadata).then((omise) => {
            if (!omise.data) {
                return res.status(400).json(createMessageResponse(null, omise.failure_message));
            }

            const message = !omise.failure_message ? 'Payment Successful' : omise.failure_message;
            return res.status(200).json(createMessageResponse(omise.data, message));
        }).catch((err) => {
            console.log(err);
            return res.status(500).json(createErrorResponse(undefined, 'Server-side Error'));
        });
        }
    };
}

function verifyController() {
    return function (req, res) {
        const chargeid = req.query.cid;
        verify(chargeid).then((omise) => {
            if (!omise.data) {
                return res.status(400).json(createMessageResponse(null, omise.failure_message));
            }

            const message = !omise.failure_message ? 'Verify Successful' : omise.failure_message;
            return res.status(200).json(createMessageResponse(omise.data, message));
        }).catch((err) => {
            return res.status(500).json(createErrorResponse(undefined, 'Server-side Error'));
        });
    };
}

function readTransactionController() {
    return function (req, res) {
        const chargeid = req.query.cid;
        transaction(chargeid).then((omise) => {
            if (!omise.data) {
                return res.status(400).json(createMessageResponse(null, omise.failure_message));
            }

            const message = !omise.failure_message ? 'Transaction Found' : omise.failure_message;
            return res.status(200).json(createMessageResponse(omise.data, message));
        }).catch((err) => {
            return res.status(500).json(createErrorResponse(undefined, 'Server-side Error'));
        });
    };
}

function makeRecipientController() {
    return function (req, res) {
        const account = req.body;
        recipient(account).then((result) => {
            if (!result.data) {
                return res.status(400).json(createMessageResponse(null, result.failure_message));
            }
            const message = !result.failure_message ? 'Create Recipient Successful' : result.failure_message;
            return res.status(200).json(createMessageResponse(result.data, message));
        }).catch((err) => {
            return res.status(500).json(createErrorResponse(undefined, 'Server-side Error'));
        });
    };
}

function makeTransferController() {
    return function (req, res) {
        const account = req.body;
        transfer(account).then((result) => {
            if (!result) {
                return res.status(400).json(createMessageResponse(null, result.failure_message));
            }
            const message = !result.failure_message ? 'Transfer Sucessful' : result.failure_message;
            return res.status(200).json(createMessageResponse(result.data, message));
        }).catch((err) => {
            return res.status(500).json(createErrorResponse(undefined, 'Server-side Error'));
        });
    };
}

function sourceController() {
    return function (req, res) {
        const metadata = req.body;
        getsource(metadata).then((result) => {
            if (!result) {
                return res.status(404).json(createMessageResponse(result, "Source Error"));
            }
            return res.status(200).json(createMessageResponse(result, 'Source Create'));
        }).catch((err) => {
            return res.status(500).json(createErrorResponse(undefined, 'Server-side Error'));
        });
    };
}

function tokenController() {
    return function (req, res) {
        const metadata = req.body;
        gettoken(metadata).then((result) => {
            if (!result) {
                return res.status(404).json(createMessageResponse(result, "Token Error"));
            }
            return res.status(200).json(createMessageResponse(result, 'Token Create'));
        }).catch((err) => {
            return res.status(500).json(createErrorResponse(undefined, 'Server-side Error'));
        });
    };
}

function eventController() {
    return function (req, res) {
        event().then((result) => {
            if (!result) {
                return res.status(404).json(createMessageResponse(result, "Event Error"));
            }
            return res.status(200).json(createMessageResponse(result, 'Event Result'));
        }).catch((err) => {
            return res.status(500).json(createErrorResponse(undefined, 'Server-side Problem'));
        });
    };
}

let paymentController = makePaymentController(paymentUseCases),
    verifyPaymentController = verifyController(),
    getTransactionController = readTransactionController(),
    transferController = makeTransferController(),
    recipientController = makeRecipientController(),
    getSourceController = sourceController(),
    getTokenController = tokenController(),
    getEventController = eventController();

export { paymentController, verifyPaymentController, getTransactionController, transferController, recipientController, getSourceController, getTokenController, getEventController};
