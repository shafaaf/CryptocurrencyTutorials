const ChainUtil = require('../chainUtil');
const Transaction = require('./transaction');
const { INITIAL_BALANCE } = require('../config');

class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex'); // public addresss of the wallet
    }
    toString() { // TODO: toString for public key print
        return ` Wallet -
            balance  : ${this.balance}™
            publickey:
            ${this.publicKey}`
    }
    sign(dataHash) {
        return this.keyPair.sign(dataHash);
    }
    // Create transaction or update outputs to include new receiver
    // if already in pool
    createTransaction(receipent, amount, transactionPool) {
        if (amount > this.balance) {
            console.log(`Amount ${amount} exceeds current balance: ${this.balance}`);
            return;
        }
        let transaction = transactionPool.existingTransaction(this.publickey);
        if (transaction) {
            transaction.update(this, receipent, amount);
        } else {
            transaction = Transaction.newTransaction (
                            this,
                            receipent,
                            amount
                        );
            transactionPool.updateOrAddTransaction(transaction);
        }
        return transaction;
    }
}

module.exports = Wallet;
