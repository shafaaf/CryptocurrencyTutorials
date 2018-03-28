const Block = require('./block');

const basicTests = 0;

if (basicTests) {
    const block = new Block ("foo", "bar", "zoo", "baz");
    console.log(block.toString());
    console.log(Block.genesis().toString());
}

const fooBlock = Block.mineBlock(Block.genesis(), 'Block1 data');
console.log(fooBlock.toString());
