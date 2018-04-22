const ChainUtil = require('../chainUtil');

class Transaction {
    constructor() {
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }
    static newTransaction(senderWallet, receipent, amount) {
        const transaction = new this();
        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds balance!`);
            return;
        }
        transaction.outputs.push(...[
            { amount: senderWallet.balance - amount, address: senderWallet.publicKey},
            { amount, address: receipent}
        ]);
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;
    }
    static signTransaction (transaction, senderWallet) { // signs outputs
        // Why just checking balance? Could be fake? I can set my own balance in wallet object
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign (
                ChainUtil.hash(transaction.outputs)
            )
        };
    }
    static verifyTransaction (transaction) {
        return ChainUtil.verifySignature (
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs)
        );
    }
}

module.exports = Transaction;
