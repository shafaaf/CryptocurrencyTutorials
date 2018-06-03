const ChainUtil = require('../chainUtil');

// A wallet (user) could have 1 transaction in transaction pool
// at any point in time. If he wants to add other receipents, he can
// do so by updating that transaction in the pool

class Transaction {
    constructor() {
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

    // Creates outputs here
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
    // Update an already made transaction
    // 1. Reduce output amount sent back to sender
    // 2. Add new output for new receiver
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

    // Creates inputs here
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
