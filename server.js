//variables
var AuthInstance
var AuthContract
var accounts
var addr


//imports
const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
const bodyparser = require('body-parser');
var  { JSDOM } = require('jsdom');
const  session = require('express-session');
const contract = require('@truffle/contract');
const abiJSON = require("./build/contracts/Authentication.json");

const express = require('express');
const app = express();

//about app
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "secret",
}))

app.listen(3000, function(){
    console.log('Server has started  on port localhost:3000......');
})
console.log('hello sir , i am running');


// loading web3 accounts
async function loadWeb3() {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))
    accounts = await web3.eth.getAccounts()
    web3.eth.defaultAccount = accounts[0]
}
loadWeb3()

async function init() {

    networkID = await web3.eth.net.getId()
    AuthContract = contract(abiJSON)
    AuthContract.setProvider(web3.currentProvider)
    AuthContract.setNetwork(networkID)
    try {
        AuthInstance = await AuthContract.deployed()
        var own = await AuthInstance.owner();
        accounts = await web3.eth.getAccounts()
        console.log("Got instance at ", AuthInstance.address)
        console.log('owner is ', own);
        console.log('Accounts Are' , accounts)
        console.log('\n')

    } catch (err) {
        console.log("No admin Contract found, deploying new Admin Contract", err)
        try {
            accounts = await web3.eth.getAccounts()
            console.log("Accounts", accounts)
            web3.eth.defaultAccount = accounts[0]
            AuthInstance = await AuthContract.new({ from: accounts[0] })
            console.log("Contract deployed at", AuthInstance.address)
        } catch (err) {
            console.log("Error", err)
        }
    }
}
init()

async function getinfo(addr , res){
    networkID = await web3.eth.net.getId()
    AuthContract = contract(abiJSON)
    AuthContract.setProvider(web3.currentProvider)
    AuthContract.setNetwork(networkID)
    AuthInstance = await AuthContract.deployed()
    accounts = await web3.eth.getAccounts();

    var vau = await AuthInstance.AuthOrNot(addr, {from:addr});
    return vau;
}

async function DoAuthentication(addr , res){
    networkID = await web3.eth.net.getId()
    AuthContract = contract(abiJSON)
    AuthContract.setProvider(web3.currentProvider)
    AuthContract.setNetwork(networkID)
    AuthInstance = await AuthContract.deployed()
    accounts = await web3.eth.getAccounts();

    var doo = await AuthInstance.DoAuthenticate(addr , {from:addr});
    return doo;
}

async function  Removeauthentication(addr , admn , res){
    networkID = await web3.eth.net.getId()
    AuthContract = contract(abiJSON)
    AuthContract.setProvider(web3.currentProvider)
    AuthContract.setNetwork(networkID)
    AuthInstance = await AuthContract.deployed()
    accounts = await web3.eth.getAccounts();

    var doo = await AuthInstance.RemoveAuthentication(addr , {from:admn});
    return doo;
}

app.get ('/loading' , async function(req , res){
    try{
        var addr =''+ req.query.aad
        console.log("got adrees ",addr);

        var truth = await getinfo(addr);
        console.log(" user is",truth);
        if (truth == true){
            // Redirect to Clients Website if USER is authenticated
            // res.redirect('https://www.google.com/');
            res.sendFile(path.join(__dirname + "/welcome.html"))
        }else{
            res.sendFile(path.join(__dirname + '/error.html'))
        }
    }catch(err){
        console.log( "error is", err)
        res.sendFile(path.join(__dirname + '/error.html'))
    }
})

app.get ('/loading2' , async function(req , res){

    try{
        var addr =''+ req.query.aad
        var truth = await DoAuthentication(addr);
        console.log('doauth', truth);
        res.redirect('/')
    }catch(err){
        console.log("error is", err)
        res.sendFile(path.join(__dirname + '/error.html'))
    }
 })
 
app.get ('/loading3' , async function(req , res){

    try{
        var addr ='' +req.query.aad
        var admn =''+ req.query.admin
        var truth = await Removeauthentication(addr , admn);
        console.log('de auth', truth);
        res.redirect('/')

    }catch(err){
        console.log("error is", err)
        res.sendFile(path.join(__dirname + '/error.html'))
    }
 })

app.get('/', async function(req,res){

    res.sendFile(path.join(__dirname + '/index.html'))
})

/////////These Routes can be used in website for extra control over 'users authentication'
app.get ('/DoAuthenticate' , async function (req ,res) {
    res.sendFile(path.join(__dirname + '/DoAuthenticate.html'))
})

app.get ('/RemovAuthenticate' , async function (req ,res) {
    res.sendFile(path.join(__dirname + '/RemoveAuthentication.html'))
})