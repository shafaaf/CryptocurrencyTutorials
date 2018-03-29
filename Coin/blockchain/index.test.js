const Block = require('./block');
const Blockchain = require('./index');

describe('Blockchain', () => {
    let bc1;
    let bc2;

    beforeEach(() => {
        bc1 = new Blockchain();
        bc2 = new Blockchain();
    });

    // Genesis block test
    it('Starts with genesis block', () => {
        expect(bc1.chain[0]).toEqual(Block.genesis());
    });
    // Add Block test
    it('Adds a new block at end of chain', () => {
        const data = 'foo';
        let newBlock = bc1.addBlock(data);
        expect(bc1.chain[bc1.chain.length - 1].data).toEqual(data);
        expect(bc1.chain[bc1.chain.length - 1]).toEqual(newBlock);
    });
    // Block Validation tests
    it('Validates a valid chain', () => {
        bc2.addBlock('foo');
        expect(bc1.isValidChain(bc2.chain)).toBe(true);
    });
    it('Invalidates a chain with corrupt genesis block', () => {
        bc2.chain[0].data = "Bad Data";
        expect(bc1.isValidChain(bc2.chain)).toBe(false);
    });
    it('Invalidates a chain with corrupt data', () => {
        bc2.addBlock('foo');
        bc2.chain[1].data = "not foo";
        expect(bc1.isValidChain(bc2.chain)).toBe(false);
    });
    it('Invalidates a chain with corrupt hash', () => {
        bc2.addBlock('foo');
        bc2.addBlock('bar');
        bc2.chain[1].hash = "wrong hash";
        expect(bc1.isValidChain(bc2.chain)).toBe(false);
    });
    it('Invalidates a chain with corrupt hash', () => {
        bc2.addBlock('foo');
        bc2.addBlock('bar');
        bc2.chain[1].lastHash = "wrong last hash";
        expect(bc1.isValidChain(bc2.chain)).toBe(false);
    });
    // Chain Replacement test
    it('Replaces the chain with a valid chain', () => {
        bc2.addBlock('foo');
        bc1.replaceChain(bc2.chain);
        expect(bc1.chain).toEqual(bc2.chain);
    });
    it('Does not replace the chain', () => {
        bc1.addBlock('foo');
        bc1.replaceChain(bc2.chain);
        expect(bc1.chain).not.toEqual(bc2.chain);
    });
});
