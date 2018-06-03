class TransactionPool {
    constructor() {
        this.transactions = [];
    }
    updateOrAddTransaction(transaction) {
        let transactionWithId = this.transactions.find (
            t => t.id === transaction.id);

        if (transactionWithId) { // update the transaction in pool
            this.transactions [
                this.transactions.indexOf(transactionWithId)
            ] = transaction;
        } else { // transaction not in pool, so add in
            this.transactions.push(transaction);
        }
    }

    // Find a tranasaction within the transaction pool array
    // which is owned by address. Done checking input address
    existingTransaction(address) {
        return this.transactions.find(transaction =>
            transaction.input.address == address
        );
    }
}

module.exports = TransactionPool;
