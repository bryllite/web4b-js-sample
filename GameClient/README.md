# GameClient Samples
This sample shows you how ti integrate `web4b-js` to your JS game client(vue).

## Installation

Bryllite API for JS `web4b` is provided by [npmjs.com](https://www.npmjs.com/package/web4b/)

~~~bash
npm install --save web4b

npm run serve
~~~

### Create ApiService Instance , Start ApiService after gameServer user login
* `BridgeUrl`: Bridge service endpoint.
* `PoAUrl`: Bridge service endpoint for PoA ( supported only websocket )
* `OnPoARequest`: callback method to process PoA Request.

~~~js
var bridgeUrl = "ws://localhost:9627";  // bridge endpoint
var poaUrl = "ws://localhost:4742";     // poa endpoint

// create api instance
var web3Cyprus = new Web3(new Web3.providers.WebsocketProvider(bridgeUrl));
var web3Poa = new Web3(new Web3.providers.WebsocketProvider(poaUrl));  
var web4bClientLib = new Web4bClientLib(web3Cyprus, web3Poa);
var web4bClientLib.PoaCallback(this.onPoaRequest);

// called when you receive poa request
// shoud returns valid accessToken from game server.
onPoaRequest(e){
    var hash = e.params[0];
    var iv = e.params[1];
    // send PoA arguments to game server and receives accessToken
    gameServer.send('getAccessToken', [hash, iv, this.currentUserAddress], (error, res) => {
        var accessToken = res[0];
        // accessToken to Poa Send
        web4bClientLib.PoaResponse(this.currentUserAddress, accessToken).then(console.log).catch(console.log);
    });
}
~~~

### User Balance
The game user can check user's coin balance.

~~~js
//toBridgeServer
web4bClientLib.GetBalance(this.currentUserAddress).then(res =>{
  console.log('getBalance', parseInt(res[0]));
}).catch(console.log);

OR

//toGameServer
gameServer.send('balance', [this.currentUserId], (error, res) => {
  console.log(parseInt(res[0]));
});   
~~~

### User Transaction History
The game user can check user's transaction history.

~~~js
val txidOnly = false;

web4bClientLib.GetHistory(this.currentUserAddress, txidOnly).then(res =>{
  console.log('getHistory', res[0]);
}).catch(console.log);
~~~

### User Transaction Receipt
The game user can check user's transaction Receipt.

~~~js
var txid = '';

web4bClientLib.GetReceipt(txid).then(data => {
    console.log('data ', data);
}).catch(console.log);
~~~