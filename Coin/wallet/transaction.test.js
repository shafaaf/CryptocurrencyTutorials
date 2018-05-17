const Transaction = require('./transaction');
const Wallet = require('./index');

describe('Transaction', () => {
    let transaction, wallet, receipent, amount;

    beforeEach(() => {
        wallet = new Wallet();
        amount = 50;
        receipent = 'r3c1p13nt';
<<<<<<< HEAD
        transaction =
            Transaction.newTransaction (
                wallet,
                receipent,
                amount
            );
    });

    it('Outputs the `amount` subtracted sender wallet balance', () => {
=======
        transaction = Transaction.newTransaction (
                                    wallet,
                                    receipent,
                                    amount
                        );
    });

    it('Outputs the `amount` subtracted from the wallet balance', () => {
>>>>>>> 7af157144a6bb30253b27498d4e191fb0fcc883a
        expect(transaction.outputs.find (
            output => output.address === wallet.publicKey).amount)
        .toEqual(wallet.balance - amount);
    });
    it('Outputs the `amount` added to the receipent', () => {
        expect(transaction.outputs.find (
            output => output.address === receipent).amount)
        .toEqual(amount);
    });
    it('inputs the balance of the wallet', () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });
    it('validates a valid transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });
    it('invalidates a corrupt transaction', () => {
        transaction.outputs[0].amount = 50000; // Changes hash
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });
});

describe('transacting with an amount that exceeds the balance', () => {
    beforeEach(() => {
        wallet = new Wallet();
        amount = 50000;
        receipent = 'r3c1p13nt';
        transaction = Transaction.newTransaction (
                                    wallet,
                                    receipent,
                                    amount
                        );
        it('Does not create the transaction', () => {
            expect(transaction).toEqual(undefined);
        });
    });
});