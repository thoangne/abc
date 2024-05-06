const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor(timestamp,transactions,previousHash =''){
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.transactions = transactions;
        this.hash =this.calculateHash();
        this.nonce =0;
    }
    calculateHash(){
        return SHA256(this.index +this.previousHash + this.timestamp + this.nonce + JSON.stringify(this.data)).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: "+ this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain =[this.createGenesisBlock()];
        this.difficulty =2;
        this.pendingTransactions =[];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block('1/1/2024',"Genensis block",'0');
    }   
    
    getLatestBlock(){
        return this.chain[this.chain.length-1]; 
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(),this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions=[
            new Transaction(null,miningRewardAddress,this.miningReward)
        ];

    }

    createTransaction(transaction){ 
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address)
                    balance -= trans.amount;
                if(trans.toAddress === address)
                    balance += trans.amount;
            }
        }

        return balance;
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()) return false;
            if(currentBlock.previousHash !== previousBlock.hash) return false;
        }
        return true;
    }
}



let Tcoin = new Blockchain();

Tcoin.createTransaction(new Transaction('address1', 'add2',100));
Tcoin.createTransaction(new Transaction('add2', 'address1',50));

console.log('\n Starting the miner...');
Tcoin.minePendingTransactions('tcoin-address');

console.log('\n Balance of thoang is', Tcoin.getBalanceOfAddress('tcoin-address'))

console.log('\n Starting the miner...');
Tcoin.minePendingTransactions('tcoin-address');

console.log('\n Balance of thoang is', Tcoin.getBalanceOfAddress('tcoin-address'))