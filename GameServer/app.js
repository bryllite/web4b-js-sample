"use strict";
var Web3 = require('web3');
var Web4bServerLib = require("web4b").ServerLib;

var bridgeUrl = 'ws://localhost:9627';   //bryllite Bridge service endpoint.
var gameKey = '0x71807c6849611ea301bd79e53e73bc43835ba7c12c5a819014e8b1d0f575b3a4'; //gameserver private key.
var coinBoxAddress = '0xfd57fea19208081fd28a3840a75bc8e58ee6dcd3';   //gameserver coinBox address.
var gamePort = 1846;    //gameserver port

// bryllite api service for gameserver
var web3Cyprus = new Web3(new Web3.providers.WebsocketProvider(bridgeUrl));
var web4bServerLib = new Web4bServerLib(web3Cyprus, gameKey, coinBoxAddress);

// gameServer websocket
var JsonRpcWs = require('json-rpc-ws');
var server = JsonRpcWs.createServer();
server.start({ port: gamePort }, function started () {
    console.log('Server started on port '+gamePort);
});

var userList = [{'id':'user01', 'pwd':'0000'}];

//gameServer newUser api
server.expose('newUser', function (params, callback) {
    console.log('newUser handler', params);
    var newUserId = params[0];
    var pwd = params[1];

    userList.push({'id':newUserId, 'pwd':pwd});

    callback(null, [newUserId]);
});

//gameServer login api
server.expose('login', function (params, callback) {
    console.log('login handler', params);
    var userId = params[0];
    var pwd = params[1];

    var selectUser = userList.filter(function (object) { return object.id == userId && object.pwd == pwd });

    if(selectUser.length != 0){
        //login success (getUserAddress)
        var userAddress = web4bServerLib.getUserAddress(userId);
        console.log('gameAddress ' + web4bServerLib.getGamePrivateKey());
        console.log(userAddress)
        callback(null, [userId, userAddress]);
    }else{
        //login fail
        callback(null, []);
    }
});

//gameServer user accessToken api
server.expose('getAccessToken', function (params, callback) {
    console.log('getAccessToken handler', params);

    var hash = params[0];
    var iv = params[1];
    var address = params[2];

    var accessToken = web4bServerLib.GetAccessToken(hash, iv, address)    
    console.log('accessToken :' + accessToken);
    
    callback(null, [accessToken]);
});

//gameServer coin balance api
server.expose('balance', function (params, callback) {
    console.log('balance handler', params);
    var uid = params[0];
    var userAddress = web4bServerLib.getUserAddress(uid);

    console.log('userAddress ' + userAddress)

    //balance
    web4bServerLib.GetBalance(userAddress)
    .then(value => {
        console.log(value);
        callback(null, value);
    }).catch(console.log); 
});

//gameServer buy api
server.expose('buy', function (params, callback) {
    console.log('buy handler', params);

    var itemsValue = {
        itemCode01_10BRC : 10,
        itemCode02_50BRC : 50,
        itemCode03_100BRC : 100,
    }

    var uid = params[0];
    var extra = params[1];
    var value = itemsValue[extra];

    var userPrivateKey = web4bServerLib.getUserPrivateKey(uid);
    //send buy
    web4bServerLib.SendBuy(userPrivateKey, value, extra)
    .then(txid => {
        callback(null, txid);
    }).catch(console.log);
});

//gameServer transfer api
server.expose('transfer', function (params, callback) {
    console.log('transfer handler', params);

    var fromUid = params[0];
    var toUid = params[1];
    var value = params[2];
    var extra = params[3];

    var fromPrivateKey = web4bServerLib.getUserPrivateKey(fromUid);    
    var toUserAddress = web4bServerLib.getUserAddress(toUid);

    //SendTransfer
    web4bServerLib.SendTransfer(fromPrivateKey, toUserAddress, value, extra)
    .then(txid => {
        callback(null, txid);
    }).catch(console.log);
});

//gameServer payout api
server.expose('payout', function (params, callback) {
    console.log('payout handler', params);

    var uid = params[0];
    var toAddress = params[1];
    var value = params[2];
    var extra = params[3];

    var userPrivateKey = web4bServerLib.getUserPrivateKey(uid);    
        
    //SendPayout
    web4bServerLib.SendPayout(userPrivateKey, toAddress, value, extra)
    .then(txid => {
        callback(null, txid);
    }).catch(console.log);
});

//gameServer reward api
server.expose('reward', function (params, callback) {
    console.log('reward handler', params);

    var toUid = params[0];
    var value = params[1];
    var extra = params[2];

    var toUserAddress = web4bServerLib.getUserAddress(toUid);   

    //SendReward
    web4bServerLib.SendReward(toUserAddress, value, extra)
    .then(txid => {
        console.log('txid ', txid);
        callback(null, txid);
    }).catch(console.log);
});

//gameServer receipt api
server.expose('receipt', function (params, callback) {
    console.log('receipt handler', params);

    var txid = params[0];

    //GetReceipt
    web4bServerLib.GetReceipt(txid)
    .then(data => {
        callback(null, data);
    }).catch(console.log);
});

//gameServer history api
server.expose('history', function (params, callback) {
    console.log('history handler', params);

    var userAddress = params[0];
    var isTxHash = params[1];

    //GetHistory
    web4bServerLib.GetHistory(userAddress, isTxHash)
    .then(data => {
            callback(null, data);
        }        
    ).catch(console.log);    
});