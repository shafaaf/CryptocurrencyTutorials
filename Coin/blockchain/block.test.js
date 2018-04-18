const Block = require('./block');
const { DIFFICULTY } = require('../config');

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
        console.log(block.toString());
    });
    it('generates a hash that matches the difficulty', () => {
        expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
    });
    it('lowers the difficulty for slowly mined blocks', () => {
        expect(Block.adjustDifficulty(block, block.timestamp + 360000)).toEqual(block.difficulty - 1);
    });
    it('raises the difficulty for quickly mined blocks', () => {
        expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(block.difficulty + 1);
    });
});
