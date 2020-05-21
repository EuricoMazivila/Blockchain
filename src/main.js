const {Blockchain, Transaction} =require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); 

const myKey = ec.keyFromPrivate('451b321e83fb778e3586b09cf787457cd9131f5f0bc80832d321991df6ca65aa');
const myWalletAddress = myKey.getPublic('hex');


let euroCoin = new Blockchain();

const tx1 =new Transaction(myWalletAddress, 'public key goes here', 100);
tx1.signTransaction(myKey);
euroCoin.addTransaction(tx1);

console.log('\n Starting the miner...');
euroCoin.minePendingTransactions();


console.log();
console.log('Is chain valid? ', euroCoin.isChainValid());



//console.log(JSON.stringify(euroCoin, null, 4));