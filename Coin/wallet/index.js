const chainUtil = require('../chainUtil');
const { INITIAL_BALANCE } = require('../config');

class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = chainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex'); // public addresss of the wallet
    }
    toString() { // TODO: toString for public key print
        return ` Wallet -
            publickey: ${this.publicKey}
            balance  :   ${this.balance}`
    }
}

module.exports = Wallet;
