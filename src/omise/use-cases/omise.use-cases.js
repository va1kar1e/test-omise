import * as OmiseModel from '../models/omise.models';
import { omiseKey } from '../omise.config';

const omise = require('omise')(omiseKey);

// For Developement
export function initSource(OmiseModel) {
    return async function createSource(metadata) {
        try {
            const type = metadata.type,
                amount = metadata.amount,
                currency = metadata.currency,
                phonenumber = metadata.phonenumber

            const sourceData = {
                'type': type,
                'amount': amount,
                'currency': currency,
                'phone_number': phonenumber,
            };

            const source = await omise.sources.create(sourceData);
            return source.id;
        } catch (err) {
            throw err;
        }
    }
}

// For Developement
export function initToken(OmiseModel) {
    return async function createToken(metadata) {
        try {
            const cardDetails = {
                card: {
                    'name': metadata.fullname,
                    'number': metadata.cardNumber,
                    'security_code': metadata.securityCode,
                    'expiration_month': metadata.expiredMonth,
                    'expiration_year': metadata.expiredYear,
                },
            };
            const token = await omise.tokens.create(cardDetails)
            return token.id;
        } catch (err) {
            throw err;
        }
    }
}

export function makeChargePayment(OmiseModel) {
    return async function createChargePayment(metadata) {
        try {
            const chargedata = {
                'amount': metadata.amount,
                'currency': metadata.currency,
                'return_uri': metadata.returnURL,
                'description': metadata.description,
                'metadata': {
                    'transaction_id': metadata.transactionID,
                    'user_id': metadata.userID,
                    'content_id': metadata.contentID
                },
                'card': metadata.token,
                'source': metadata.source
            }

            return new Promise(resolve => {
                omise.charges.create(chargedata, async function (err, chargeresult) {
                    if (err || !chargeresult) {
                        return resolve({
                            'data': null,
                            'failure_message': "Payment Process Error",
                        });
                    }

                    return resolve({
                        'data': {
                            'charge_id': chargeresult.id,
                            'error_code': chargeresult.failure_code,
                            'return_uri': chargeresult.authorize_uri
                        },
                        'failure_message': chargeresult.failure_message
                    });
                });
            })
        } catch (err) {
            throw err;
        }
    }
}

export function getTransaction(OmiseModel) {
    return async function readtransaction(charge_id) {
        try {
            return new Promise(resolve => {
                omise.charges.retrieve(charge_id, function (err, charge) {
                    if (err || !charge) {
                        return {
                            'data': null,
                            'failure_message': "Transaction Not Found",
                        };
                    }
                    
                    resolve({
                        'data': charge,
                        'failure_message': null,
                    });
                });
            });
        } catch (err) {
            throw err;
        }
    }
}

export function verifyPayment(OmiseModel) {
    return async function checkPayment(charge_id) {
        try {
            return new Promise(resolve => {
                omise.charges.retrieve(charge_id, async function (err, charge) {
                    if (err || !charge) {
                        return {
                            'data': null,
                            'failure_message': "Transaction Not Found",
                        };
                    }

                    const collection = await OmiseModel.find(charge_id);

                    if (collection.status.trim() == "pending" && charge.status.trim() == "successful") {
                        await OmiseModel.update(charge_id, {
                            'status': charge.status.trim(),
                            'authorized': charge.authorized,
                            'paid': charge.paid,
                            'failure_code': charge.failure_code,
                            'failure_message': charge.failure_message
                        });
                    }

                    resolve({
                        'data': {
                            'paid': charge.status
                        },
                        'failure_message': null,
                    });
                });
            });
        } catch (err) {
            throw err;
        }
    }
}

export function makeRecipient(OmiseModel) {
    return async function createRecipient(account) {
        try {
            const data = {
                'name': account.name,
                'email': account.email,
                'type': account.type,
                'bank_account': {
                    'bank_code': account.bankCode,
                    'brand': account.bankCode,
                    'number': account.bankAccountNumber,
                    'name': account.bankAccountName
                }
            }

            return new Promise(resolve => {
                omise.recipients.create(data, function (err, recp) {
                    if (err) {
                        return {
                            'data': null,
                            'failure_message': "Can't create the Recipient",
                        };
                    }
                    
                    resolve({
                        'data': {
                            'recipient_id': recp.id,
                            'error_code': recp.failure_code,
                            'verified': [recp.verified, recp.verified_at],
                            'active': [recp.active, recp.activated_at],
                        },
                        'failure_message': null,
                    });
                });
            });
        } catch (err) {
            throw err;
        }
    }
}

export function makeTransfer(OmiseModel) {
    return async function createTransfer(account) {
        try {
            const amount = account.amount ? account.amount : null,
                recipient = account.recipient ? account.recipient : null;

            const data = {
                'amount': amount, 
                'recipient': recipient
            }

            return new Promise(resolve => {
                omise.transfers.create(data, function (err, transfer) {
                    if (err) {
                        return {
                            'data': null,
                            'failure_message': "Can't transfer to the Recipient",
                        };
                    }

                    resolve({
                        'data': {
                            'transfer_id': transfer.id,
                            'error_code': transfer.failure_code,
                            'failure_message': transfer.failure_message,
                        },
                        'failure_message': null,
                    });
                });
            });
        } catch (err) {
            throw err;
        }
    }
}

export function updatePendingTransaction(OmiseModel) {
    return async function createUpdatePendingTransaction(eventdata) {
        try {
            for (const event of eventdata) {
                if (event.key == "charge.complete") {
                    const charge_id = event.data.id;

                    const collection = await OmiseModel.find(charge_id);
                    if (collection.status == "pending" && event.data.status == "successful" && event.data.paid == true) {
                        console.log("Update Paid Status: " + charge_id)
                    }
                }
            }
        } catch (err) {
            throw err;
        }
    };
}

export function getEvent(OmiseModel) {
    return async function curlEvent() {
        try {
            let date = new Date();
            date.setSeconds(date.getSeconds() - 15);

            const payload = {
                limit: 100,
                from: date.toISOString()
            };

            const event = await omise.events.list(payload);
            return event;
        } catch (err) {
            throw err;
        }
    };
}

let charge = makeChargePayment(OmiseModel),
    transaction = getTransaction(OmiseModel),
    verify = verifyPayment(OmiseModel),
    transfer = makeTransfer(OmiseModel),
    recipient = makeRecipient(OmiseModel),
    getsource = initSource(OmiseModel),
    gettoken = initToken(OmiseModel),
    jobUpdatePendingTransaction = updatePendingTransaction(OmiseModel),
    event = getEvent(OmiseModel);

export { charge, transaction, verify, transfer, recipient, getsource, gettoken, jobUpdatePendingTransaction, event };