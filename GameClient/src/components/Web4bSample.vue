<template>
<div class="text-left" :style="{margin:50+'px'}">
  <v-btn color="primary" @click="dialogConnect.visible = true">Connect</v-btn>&nbsp;
  <v-btn color="primary" @click="dialogNewUser.visible = true">New User</v-btn>&nbsp;
  <v-btn color="primary" @click="dialogLogin.visible = true">User Login</v-btn>&nbsp;
  <v-btn color="primary" @click="getBalance()">User Balance</v-btn>&nbsp;
  <v-btn color="primary" @click="dialogReward.visible = true">User Reward</v-btn>&nbsp;
  <v-btn color="primary" @click="dialogBuy.visible = true">User Buy</v-btn>&nbsp;
  <v-btn color="primary" @click="dialogTransfer.visible = true">User Transfer</v-btn>&nbsp;
  <v-btn color="primary" @click="dialogPayout.visible = true">User Payout</v-btn>&nbsp;
  <v-btn color="primary" @click="dialogReceipt.visible = true">User Receipt</v-btn>&nbsp;
  <v-btn color="primary" @click="getHistory()">User History</v-btn>&nbsp;

  <v-simple-table fixed-header :style="{marginTop:30+'px'}">
    <template>
      <thead>
        <tr>
          <th class="text-left" colspan="3">Login Info</th>
        </tr>
      </thead>          
      <tbody>
        <tr>
          <td class="text-left">UserId : {{currentUserId}}</td>
          <td class="text-left">Balance : {{myBalance}}</td>
          <!-- <td class="text-left" width="500px">&nbsp;</td> -->
          <td class="text-left">GameConnect: <v-icon :color="connectColor.game">mdi-circle-slice-8</v-icon> CyprusConnect : <v-icon :color="connectColor.cyprus">mdi-circle-slice-8</v-icon> PoaPollingConnect : <v-icon :color="connectColor.poa">mdi-circle-slice-8</v-icon></td>
        </tr>
      </tbody>
    </template>
  </v-simple-table> 

  <v-simple-table fixed-header dense height="700px" :style="{marginTop:30+'px'}">
    <template>
      <thead>
        <tr>
          <th class="text-left">Response Log</th>
          <th class="text-left"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in logs">
          <td class="text-left">{{ item.method }}</td>
          <td class="text-left">{{ item.data }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>  

  <v-dialog v-model="dialogConnect.visible" max-width="500px">
    <v-card>
      <v-card-title>
        Connect
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="dialogConnect.gameServerHost" label="GameServerHost"></v-text-field>           
        <v-text-field v-model="dialogConnect.cyprusHost" label="Bryllite CyprusHost"></v-text-field>
        <v-text-field v-model="dialogConnect.poaHost" label="Bryllite PoaHost"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="dialogConnect.visible = false">Cancel</v-btn>
        <v-btn color="green darken-1" text @click="connect(dialogConnect.gameServerHost, dialogConnect.cyprusHost, dialogConnect.poaHost); dialogConnect.visible = false">Send</v-btn>
      </v-card-actions>          
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogNewUser.visible" max-width="500px">
    <v-card>
      <v-card-title>
        GameServer New User
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="dialogNewUser.uid" label="UserId"></v-text-field>           
        <v-text-field v-model="dialogNewUser.pwd" label="Password" :type="'password'"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="dialogNewUser.visible = false">Cancel</v-btn>
        <v-btn color="green darken-1" text @click="sendNewUser(dialogNewUser.uid, dialogNewUser.pwd); dialogNewUser.visible = false">Send</v-btn>
      </v-card-actions>          
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogLogin.visible" max-width="500px">
    <v-card>
      <v-card-title>
        GameServer UserLogin
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="dialogLogin.uid" label="UserId"></v-text-field>           
        <v-text-field v-model="dialogLogin.pwd" label="Password" :type="'password'"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="dialogLogin.visible = false">Cancel</v-btn>
        <v-btn color="green darken-1" text @click="sendLogin(dialogLogin.uid, dialogLogin.pwd); dialogLogin.visible = false">Send</v-btn>
      </v-card-actions>          
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogReward.visible" max-width="500px">
    <v-card>
      <v-card-title>
        Send User Reward
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="dialogReward.brc" label="Reward Brc"></v-text-field>           
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="dialogReward.visible = false">Cancel</v-btn>
        <v-btn color="green darken-1" text @click="sendReward(dialogReward.brc); dialogReward.visible = false">Send</v-btn>
      </v-card-actions>          
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogBuy.visible" max-width="500px">
    <v-card>
      <v-card-title>
        Send User Buy
      </v-card-title>
      <v-card-text>
         <v-select :items="dialogBuy.items" v-model="dialogBuy.selectValue" label="Items List" item-value="text"></v-select>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="dialogBuy.visible = false">Cancel</v-btn>
        <v-btn color="green darken-1" text @click="sendBuy(dialogBuy.selectValue); dialogBuy.visible = false">Send</v-btn>
      </v-card-actions>          
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogTransfer.visible" max-width="500px">
    <v-card>
      <v-card-title>
        Send User Transfer
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="dialogTransfer.toUid" label="ToUserId"></v-text-field>
        <v-text-field v-model="dialogTransfer.brc" label="Transfer Brc"></v-text-field>           
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="dialogTransfer.visible = false">Cancel</v-btn>
        <v-btn color="green darken-1" text @click="sendTransfer(dialogTransfer.toUid, dialogTransfer.brc); dialogTransfer.visible = false">Send</v-btn>
      </v-card-actions>          
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogPayout.visible" max-width="500px">
    <v-card>
      <v-card-title>
        Send User Payout
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="dialogPayout.toAddress" label="ToAddress(MainNet)"></v-text-field>
        <v-text-field v-model="dialogPayout.brc" label="Payout Brc"></v-text-field>           
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="dialogPayout.visible = false">Cancel</v-btn>
        <v-btn color="green darken-1" text @click="sendPayout(dialogPayout.toAddress, dialogPayout.brc); dialogPayout.visible = false">Send</v-btn>
      </v-card-actions>          
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogReceipt.visible" max-width="500px">
    <v-card>
      <v-card-title>
        Send User Receipt
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="dialogReceipt.txid" label="Txid"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="dialogReceipt.visible = false">Cancel</v-btn>
        <v-btn color="green darken-1" text @click="getReceipt(dialogReceipt.txid); dialogReceipt.visible = false">Send</v-btn>
      </v-card-actions>          
    </v-card>
  </v-dialog>  

</div>

</template>

<script>
import Web3 from 'web3';
import web4b from 'web4b';
var Web4bClientLib = web4b.ClientLib;                 //브릴라이트 poa 연동
// var Web4bClientLib = require("web4b").ClientLib;   //브릴라이트 poa 연동

var JsonRpcWs = require('json-rpc-ws/browser');               //게임서버 연동용 웹소켓

var gameServer;
var web3Cyprus;
var web3Poa;

var web4bClientLib;

export default {
  data: () => ({
    ecosystem: [ 
      {
        text: 'vuetify-loader',
        href: 'https://github.com/vuetifyjs/vuetify-loader',
      }
    ],
    currentUserId: '',
    currentUserAddress: '',
    myBalance: 0,
    dialogConnect: {
      visible : false,
      gameServerHost :'ws://localhost:1846',
      cyprusHost : 'ws://localhost:9627',
      poaHost : 'ws://localhost:9034'
    },
    dialogNewUser: {
      visible : false,
      uid:'',
      pwd: ''
    },       
    dialogLogin: {
      visible : false,
      uid:'user01',
      pwd: '0000'
    },    
    dialogReward: {
      visible : false,
      brc:'100'
    },
    dialogBuy: {
      visible : false,
      items: [
          { text: 'itemCode01_10BRC'},
          { text: 'itemCode02_50BRC'},
          { text: 'itemCode03_100BRC'},
      ],
      selectValue: ''
    },  
    dialogTransfer: {
      visible : false,
      toUid : '',
      brc:'100'
    },
    dialogPayout: {
      visible : false,
      toAddress : '0x1362279f66d2dbccfc9f34a7d135f5d61fd10ada',
      brc:'100'
    },
    dialogReceipt: {
      visible : false,
      txid : '0x7c83e91eecafc5c0885844dd03d8873fd6ed9ac789aac5c83509008c17d7f6ba'
    },
    connectColor:{
      game: 'red',
      cyprus: 'red',
      poa: 'red'
    },
    logs:[]                     
  }),
  created() {
    gameServer = JsonRpcWs.createClient();    
  },
  methods: {
    connect(gameServerHost, cyprusHost, poaHost) {
      //게임서버 연결
      gameServer.connect(gameServerHost, () => {
        this.connectColor.game = 'green';           
      });

      //브릴라이트 Cyprus 연결
      web3Cyprus = new Web3(new Web3.providers.WebsocketProvider(cyprusHost));
      web3Cyprus.currentProvider.on('connect', () =>{
        console.log('web3Cyprus connected');
        this.connectColor.cyprus = 'green';           
      });
      web3Cyprus.currentProvider.on('end', e => { 
        console.error('web3Cyprus end', e);
        this.connectColor.cyprus = 'red';           
      });

      //브릴라이트 Poa 연결
      web3Poa = new Web3(new Web3.providers.WebsocketProvider(poaHost));  
      web3Poa.currentProvider.on('connect', () =>{
        console.log('web3Poa connected');
        this.connectColor.poa = 'green';           
      });
      web3Poa.currentProvider.on('end', e => { 
        console.error('web3Poa end', e)
        this.connectColor.poa = 'red';           
      });          
    },
    sendNewUser(uid, pwd) {
      console.log("SendNewUser");
      //게임서버 NewUser
      gameServer.send('newUser', [uid, pwd], this.sendNewUserCallBack);             
    },
    sendNewUserCallBack(error, data) {
      this.logPrint('sendNewUserCallBack', 'success ' + data);
    },    
    sendLogin(uid, pwd) {
      console.log("SendLogin");
      //게임서버 로그인 요청
      gameServer.send('login', [uid, pwd], this.sendLoginCallBack);             
    },
    sendLoginCallBack(error, data) {
      if(data.length === 0){
        alert('login fail!');
        return;
      }      
      console.log('loginResult', data);
      this.logPrint('sendLoginCallBack', data);
      this.currentUserId = data[0];
      this.currentUserAddress = data[1]; //성공일경우 발급된 userAddress 전달됨

      //web4bClientLib 연동 및 PoaStart
      web4bClientLib = new Web4bClientLib(web3Cyprus, web3Poa);
      web4bClientLib.PoaCallback(this.onPoaRequest);
    },
    onPoaRequest(e){
        var hash = e.params[0];
        var iv = e.params[1];

        // send PoA arguments to game server and receives accessToken
        gameServer.send('getAccessToken', [hash, iv, this.currentUserAddress], (error, res) => {
            var accessToken = res[0];
            // POA 서비스에 accessToken 전달 (참여증명완료)
            web4bClientLib.PoaResponse(this.currentUserAddress, accessToken).then(console.log).catch(console.log);
        });
    },
    getBalance() {
      console.log("잔고조회 요청");

      //게임서버로 요청
      gameServer.send('balance', [this.currentUserId], (error, res) => {
        console.log(parseInt(res[0]));
        this.logPrint('getBalance', res[0]);
        this.myBalance = parseInt(res[0]);
      });         

      //브릴라이트로 직접 요청
      // web4bClientLib.GetBalance(this.currentUserAddress).then(res =>{
      //   console.log(parseInt(res[0]));
      //   this.logPrint('getBalance', res[0]);
      //   this.myBalance = parseInt(res[0]);
      // }).catch(console.log);
    },    
    sendReward(value) {
      console.log("보상지급 요청");

      //게임서버로 요청
      gameServer.send('reward', [this.currentUserId, value, ''], (error, res) => {
        console.log(res[0]);
        this.logPrint('sendReward', res[0]);
      });   
    },
    sendBuy(itemCode) {
      console.log("구매 요청");
      console.log(itemCode);

      //게임서버로 요청
      gameServer.send('buy', [this.currentUserId, itemCode], (error, res) => {
        console.log(res[0]);
        this.logPrint('sendBuy', res[0]);
      });   
    },   
    sendTransfer(toUid, value) {
      console.log("선물하기 요청");

      //게임서버로 요청
      gameServer.send('transfer', [this.currentUserId, toUid, value], (error, res) => {
        console.log(res[0]);
        this.logPrint('transfer', res[0]);
      });         
    },
    getReceipt(txid) {
      console.log("유저 거래영수증조회");

      //게임서버로 요청
      gameServer.send('receipt', [txid], (error, res) => {
        console.log(res[0]);
        this.logPrint('getReceipt', res[0]);
      });         
    },
    getHistory() {
      console.log("거래내역조회");

      var userAddress_ = this.currentUserAddress;
      var isOnlyTxHash = true;

      //게임서버로 요청
      gameServer.send('history', [userAddress_, isOnlyTxHash], (error, res) => {
        console.log(res[0]);
        this.logPrint('getHistory', res[0]);
      });     

      //브릴라이트로 직접 요청
      // web4bClientLib.GetHistory(userAddress_, isOnlyTxHash).then(res =>{
      //   console.log(parseInt(res[0]));
      //   this.logPrint('getBalance', res[0]);
      //   this.myBalance = parseInt(res[0]);
      // }).catch(console.log);      
    },
    sendPayout(toAddress, value) {
      console.log("외부계좌이체");

      //게임서버로 요청
      gameServer.send('payout', [this.currentUserId, toAddress, value], (error, res) => {
        console.log(res[0]);
        this.logPrint('sendPayout', res[0]);        
      });               
    },
    logPrint(method, data){
      this.logs.unshift({method:method, data:data})
    }            
  }
};
</script>
