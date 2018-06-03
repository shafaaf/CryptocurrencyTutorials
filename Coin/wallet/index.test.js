const Wallet = require('./index');
const TransactionPool = require('./transaction-pool.js');

describe('Wallet', () => {
    let wallet;
    let tp;

    beforeEach(() => {
        wallet = new Wallet();
        tp = new TransactionPool();
    });

    describe('Creating a transaction', () => {
        let transaction , sendAmount, receipent;

        beforeEach(() => {
            sendAmount = 50;
            receipent ='r4nd0m-4ddr355' ;
            transaction = wallet.createTransaction (
                receipent,
                sendAmount,
                tp
            );
        });

        describe('and doing the same transaction', () => {
            beforeEach(() => {
                wallet.createTransaction (
                    receipent,
                    sendAmount,
                    tp
                );
            });
            it('doubles the `sendAmount` subtracted from the wallet balance', () => {
                var test = transaction.outputs.find (
                    output => output.address === wallet.publicKey);
                console.log("test is: ", test);

                expect(transaction.outputs.find (
                    output => output.address === wallet.publicKey).amount)
                    .toEqual(wallet.balance - sendAmount * 2);
            });
            // it('clones the `sendAmount` output for the receipent', () => {
            //     // Get the transaction outputs which are only for receiver
            //     // and then only get the amounts from that resultant array.
            //     expect(transaction.outputs.filter (
            //         output => output.address === receipent).map (
            //             (output => output.amount))
            //     ).toEqual([sendAmount, sendAmount]);
            // });
        });
    });
});