# GameClient Samples
This sample shows you how ti integrate `web4b-js` to your JS game client(vue).

## Installation

Bryllite API for JS `web4b` is provided by [npmjs.com](https://www.npmjs.com/package/web4b/)

~~~bash
npm install   // package.json "dependencies": {"json-rpc-ws", "web4b"}

npm run serve
~~~

### In the Browser

Use the prebuild `dist/web4b.min.js`

~~~html
<script type="text/javascript" src="./web4b.min.js"></script>
~~~

Then include `dist/web4b.min.js` in your html file.
This will expose `web4b` on the window object.

### Create ApiService Instance
* `BridgeUrl`: Bridge service endpoint.
* `PoAUrl`: Bridge service endpoint for PoA ( supported only websocket )
* `OnPoARequest`: callback method to process PoA Request.

~~~js
var bridgeUrl = "ws://localhost:9627";  // bridge endpoint
var poaUrl = "ws://localhost:4742";     // poa endpoint

// create api instance
var web3Cyprus = new Web3(new Web3.providers.WebsocketProvider(bridgeUrl));
var web3Poa = new Web3(new Web3.providers.WebsocketProvider(poaUrl));  
~~~

### Start ApiService after user login
* `uid`: game user's unique identifier.
* `address`: game user's address received by the game server.

~~~js
sendLoginCallBack(error, data) {
  //success userLogin : uid, user address
  this.currentUserId = data[0];
  this.currentUserAddress = data[1];

  //web4bClientLib & Poa Start
  web4bClientLib = new Web4bClientLib(web3Cyprus, web3Poa);
  web4bClientLib.PoaCallback(this.onPoaRequest);
}

// called when you receive poa request
// returns valid accessToken from game server.
onPoaRequest(e){
    var hash = e.params[0];
    var iv = e.params[1];

    // send PoA arguments to game server and receives accessToken
    gameServer.send('getAccessToken', [hash, iv, this.currentUserAddress], (error, res) => {
        var accessToken = res[0];
        // accessToken to PoaServerApi Send
        web4bClientLib.PoaResponse(this.currentUserAddress, accessToken).then(console.log).catch(console.log);
    });
}
~~~

### User Balance
The game user can check user's coin balance.

~~~js
//to BridgeServer
web4bClientLib.GetBalance(this.currentUserAddress).then(res =>{
  console.log('getBalance', parseInt(res[0]));
}).catch(console.log);

OR

//to GameServer
gameServer.send('balance', [this.currentUserId], (error, res) => {
  console.log(parseInt(res[0]));
});   
~~~

### User Transaction History
The game user can check user's transaction history.

~~~js
val isTxidOnly = false;
//to BridgeServer
web4bClientLib.GetHistory(this.currentUserAddress, isTxidOnly).then(res =>{
  console.log('getHistory', res[0]);
}).catch(console.log);

OR

//to GameServer
gameServer.send('history', [this.currentUserAddress, isTxidOnly], (error, res) => {
  console.log(parseInt(res[0]));
});   
~~~

### User Transaction Receipt
The game user can check user's transaction Receipt.

~~~js
var txid = '';
//to BridgeServer
web4bClientLib.GetReceipt(txid).then(data => {
    console.log('data ', data);
}).catch(console.log);

OR

//to GameServer
gameServer.send('receipt', [txid], (error, res) => {
  console.log(parseInt(res[0]));
});
~~~

### Use GameServer Api (sample)
#### Create New User
~~~js
sendNewUser(uid, pwd) {
  gameServer.send('newUser', [uid, pwd], this.sendNewUserCallBack);             
}
~~~

#### User Login
~~~js
sendLogin(uid, pwd) {
  gameServer.send('login', [uid, pwd], this.sendLoginCallBack);             
}
~~~

#### Buying items
~~~js
sendBuy(itemCode) {
  gameServer.send('buy', [this.currentUserId, itemCode], (error, res) => {
    console.log(res[0]);
    this.logPrint('sendBuy', res[0]);
  });   
}
~~~

#### Transaction between game users (transfer)
~~~js
sendTransfer(toUid, value) {
  gameServer.send('transfer', [this.currentUserId, toUid, value], (error, res) => {
    console.log(res[0]);
  });         
}
~~~

#### Withdraw coin outside the game (payout)
~~~js
sendPayout(toAddress, value) {
  gameServer.send('payout', [this.currentUserId, toAddress, value], (error, res) => {
    console.log(res[0]);
  });               
}
~~~