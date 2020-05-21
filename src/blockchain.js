const SHA256=require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); 

class Transaction{
    constructor(fromAddress, toAddress, mensagem){
        this.fromAddress=fromAddress;
        this.toAddress=toAddress;
        this.mensagem=mensagem;
        this.timestamp = Date.now();
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.mensagem + this.timestamp).toString();
    }

    signTransaction(signingKey){
        if(signingKey.getPublic('hex')!== this.fromAddress){
            throw new Error('Voce nao pode efectuar essa transacao');
        }
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid(){
        if(!this.signature || this.signature.length === 0){
            throw new Error('Nao existe nenhuma assinatura para esta transacao');
        }

        const publickey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publickey.verify(this.calculateHash(), this.signature);

    }
}

class Block{
    constructor(timestamp, transactions, previousHash= ''){
        this.timestamp=timestamp;
        this.transactions=transactions;
        this.previousHash=previousHash;
        this.hash= this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(dificulty){
        while(this.hash.substring(0, dificulty) !== Array(dificulty + 1).join('0')){
            this.nonce++;
            this.hash= this.calculateHash(); 
        }

        console.log("Block mine: " + this.hash);
    }

    hashValidTransaction(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }
        return true;
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.dificulty=2;
        this.pendingTransactions=[];
    }

    createGenesisBlock(){
        return new Block(Date.parse('2020-02-05'), [], '0');
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
    

    minePendingTransactions(){
        const block =new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.dificulty);

        console.log('Block sucessfully mined!');
        this.chain.push(block);
        this.pendingTransactions =[];

    }

    addTransaction(transaction){

        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('A transacao deve possuir dois enderecos');
        }

        if(!transaction.isValid()){
            throw new Error('Nao pode adicionar uma transacao invalida na cadeia');
        }

        if(transaction.mensagem == ''){
            throw new Error ('A transacao nao pode ter a mensagem vazia');
        }

        this.pendingTransactions.push(transaction);
    }


    isChainValid(){
        const realGenesis = JSON.stringify(this.createGenesisBlock());
        if(realGenesis !== JSON.stringify(this.chain[0])){
            return false;
        }
        //console.log('HASH 1',this.chain[1].previousHash);
        //console.log('HASH 2',this.chain[0].calculateHash());

        for(let i=1; i < this.chain.length; i++){
            const currentBlock= this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(!currentBlock.hashValidTransaction()){
                return false;
            }

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
        }

        return true;
    }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction =Transaction;
