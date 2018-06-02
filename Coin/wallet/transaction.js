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
        Transaction.signTransaction(transaction, senderWallet); // creates inputs
        return transaction;
    }
    // TODO: Confused how this supposed to work
    // Add more transaction outputs to already made transaction
    update(senderWallet, receipent, amount) {
        const senderOutput = this.outputs.find (
            output => output.address === senderWallet.publicKey
        );
        // new balance sender will have with old transaction
        // is: senderOutput.amount
        if (amount > senderOutput.amount) {
            console.log(`Amount : ${amount} exceeds balance.`);
            return;
        }
        senderOutput.amount = senderOutput.amount - amount;
        // Add new receiver for the transaction
        this.outputs.push({
            amount,
            address: receipent
        });
        Transaction.signTransaction(this, senderWallet)
        // this keyword is current transaction instance
        return this;
    }
    static signTransaction (transaction, senderWallet) { // signs outputs
        // Why just checking balance? Could be fake? I can set my own balance in wallet object
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign ( // Sign the outputs
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
