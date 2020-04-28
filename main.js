const SHA256=require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash= ''){
        this.index=index;
        this.timestamp=timestamp;
        this.data=data;
        this.previousHash=previousHash;
        this.hash= this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(dificulty){
        while(this.hash.substring(0, dificulty) !== Array(dificulty + 1).join("0")){
            this.nonce++;
            this.hash= this.calculateHash();
        }

        console.log("Block mine: " + this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.dificulty=4;
    }
    createGenesisBlock(){
        return new Block(0, "01/01/2020","Bloco Genesis", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    addBlock (newBlock){
        newBlock.previousHash=this.getLatestBlock().hash;
        newBlock.mineBlock(this.dificulty);
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i=1; i < this.chain.length; i++){
            const currentBlock= this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }

        return true;
    }
}

let euroCoin = new Blockchain();

console.log('Mining block 1...');
euroCoin.addBlock(new Block(1,"20/02/2020",{amount: 4}));

console.log('Mining block 1...');
euroCoin.addBlock(new Block(2,"22/10/2020", {amount: 200}));

