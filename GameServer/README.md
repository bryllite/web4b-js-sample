# GameServer Samples
This sample shows you how to integrate web4b-js to your Game Server.

## Installation

Bryllite API for JS `web4b` is provided by [npmjs.com](https://www.npmjs.com/package/web4b/)

~~~bash
npm install --save web4b

node app.js
~~~

### Create ApiService Instance

* `BridgeUrl`: Bridge service endpoint.
* `GameKey`: Game server private key.
* `CoinBoxAddress`: Game server coinBox address.

~~~js
var bridgeUrl = "ws://localhost:9627";
var gameKey = "{gameKey}";
var coinBoxAddress = "{coinBoxAddress}";    //coin retrieveAddress

var web3Cyprus = new Web3(new Web3.providers.WebsocketProvider(brylliteCyprusHost));
var web4bServerLib = new Web4bServerLib(web3Cyprus, gameKey, coinBoxAddress);
~~~

### GameServer Address

~~~js
var  gameaddress = web4bServerLib.getGameAddress();
~~~

### GameServer Balance
* `GameServerAddress`: GameServer address.

~~~js
web4bServerLib.GetBalance(gameServerAddress).then(console.log).catch(console.log);
~~~

### GameUser Balance
* `uid`: Game user's unique identifier.
* `address`: Game User's address.

**Get User Address**

~~~js
// uid to address
var address = web4bServerLib.getUserAddress(uid);

// Balance
web4bServerLib.GetBalance(address).then(console.log).catch(console.log);
~~~

### reward coins to game users
The game server can reward coins to game users within the coinbase balance.

~~~js
web4bServerLib.SendReward(toUserAddress, value, extra).then(txid => {
    console.log('txid ', txid);
}).catch(console.log);
~~~

### Transaction between game users
The game user(client) doesn't have a private key.
So the game server should handle user's transfer request instead.
When game user makes a transfer request to the game server, the transfer is processed after user authentication.

~~~js
// user's private key, address
var signer = web4bServerLib.getUserPrivateKey(fromUid);
var to = web4bServerLib.getUserAddress(toUid);

web4bServerLib.SendTransfer(signer, to, value, extra).then(txid => {
    console.log('txid ', txid);
}).catch(console.log);
~~~

### Withdraw coin outside the game
The game user's balance is only valid within the game.
In order to use it on a mainnet, user must withdraw it to an account outside the game.
The game server should handle user's payout request instead after authentication.

~~~js
//gameServer payout api
var signer = web4bServerLib.getUserPrivateKey(uid); // user's private key
var to = '' //mainnet address
var value;  // value to payout

web4bServerLib.SendPayout(signer, to, value, extra).then(txid => {
    console.log('txid ', txid);
}).catch(console.log);

~~~

### Make sure payout request is complete
Unlike transfer requests between game users (In-Game Tx), payout requests are not processed immediately.
It takes some time for the block to be created on the Bryllite mainnet and the transaction to be included.

~~~js
var txid = '';

web4bServerLib.GetReceipt(txid).then(data => {
    console.log('data ', data);
}).catch(console.log);
~~~

### Buying items on game shop
The game user can use coins to buy items provided by the game service.
When a game user buy an item, the purchase amount is credited to `coinBoxAddress`.

~~~js
// gameServer buy api
// user's balance -> coinBoxAddress
var signer  = web4bServerLib.getUserPrivateKey(uid);
var value;  //item.value

web4bServerLib.SendBuy(signer, value, extra).then(txid => {
    console.log('txid ', txid);
}).catch(console.log);
~~~

### history

~~~js
//gameServer history api
web4bServerLib.GetHistory(userAddress, isTxHash).then(data => {
        console.log(data);
    }        
).catch(console.log);  
~~~

### Issuing AccessToken to game client for PoA(proof of attendance)
Game client receives request for prove game attendance every block time with `hash` and `iv` arguments.
When the client sends these arguments, the game server should issue a valid `accessToken` after authentication.

~~~js
//gameServer user accessToken api
var hash = '';      // block hash
var iv = '';        // initial vector for user
var address = ''    // userAddress

var accessToken = web4bServerLib.GetAccessToken(hash, iv, address);
console.log('accessToken :' + accessToken);
~~~
