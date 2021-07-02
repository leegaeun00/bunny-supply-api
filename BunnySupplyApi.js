import Web3 from 'web3';
import express from 'express';
import bigPkg from 'big.js';
import {bunnyAbi} from "./bunnyAbi.js";

const {Big} = bigPkg;

//get total supply
const web3 = new Web3(`https://bsc-dataseed.binance.org/`);

const bunnyContractAddr = "0xC9849E6fdB743d08fAeE3E34dd2D1bc69EA11a51";

const bunnyInstance = new web3.eth.Contract(bunnyAbi, bunnyContractAddr);

function getBunnySupply() {
    return new Promise (async (resolve) => {
        let bunnySupply = await bunnyInstance.methods.totalSupply().call();
        console.log(bunnySupply);
        resolve(bunnySupply);
    })
}

//build api
const api = express()

const HOST = 'localhost'
const PORT = 3050

api.get('/', (req,res) => {
    res.send('Welcome to Bunny API.')
})

api.get('/totalSupply', (req,res) => {
    getBunnySupply().then((totalSupply) => {
        //convert from uint256 into decimal number
        const decimalTotalSupply = new Big(totalSupply).div(10 ** 18).toFixed(8);
        res.send(decimalTotalSupply);
    })
})


api.listen(PORT, () => console.log(`API running at ${HOST}:${PORT}!`))