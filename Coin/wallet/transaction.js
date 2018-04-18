const ChainUtil = require('../chainUtil');

class Transaction() {
    constructor() {
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }
    static newTransaction(senderWallet, receipent, amount) {
        const transaction = new this();
        // Why just checking balance? Could be fake? I can set my own balance in wallet object
        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds balance!`);
            return;
        }
        transaction.outputs.push(...[
            { amount: senderWallet.balance - amount, address: senderWallet.publicKey},
            { amount, address: receipent}
        ]);
        return transaction;
    }
}

module.exports = Transaction;
