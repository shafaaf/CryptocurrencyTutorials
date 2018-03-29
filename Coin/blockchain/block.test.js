const Block = require('./block');

describe('Block', () => {
    let data, genesisBlock, lastBlock, block;

    beforeEach(() => {
        data = 'bar';
        genesisBlock = Block.genesis();

        lastBlock = genesisBlock;
        block = Block.mineBlock(lastBlock, data);
    });

    it('Checks Genesis Block details', () => {
        expect(genesisBlock.timestamp).toEqual("GenesisTimestamp");
        expect(genesisBlock.lastHash).toEqual("GenesisPrev");
        expect(genesisBlock.hash).toEqual("GenesisCurr");
        expect(genesisBlock.data).toEqual([]);
    });
    it('Sets the `data` to match the input', () => {
        expect(block.data).toEqual(data);
    });
    it('Sets the `lastHash` to match the hash of the last block', () => {
        expect(block.lastHash).toEqual(lastBlock.hash);
    });
});