var express = require("express");  
var app = express();  
var server = require("http").createServer(app);
var io = require("socket.io")(server);

server.listen(8080);

app.use(express.static("public"));

app.get("/", function(req, res){
	res.sendFile(__dirname + "/public/html/index.html");
})

var Web3 = require("web3");

web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.159.131:8545"));	

//从remix浏览器编译合约后 复制WEB3DEPLOY内容过来
var proofContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"fileHash","type":"string"}],"name":"get","outputs":[{"name":"timestamp","type":"uint256"},{"name":"owner","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"string"},{"name":"fileHash","type":"string"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"status","type":"bool"},{"indexed":false,"name":"timestamp","type":"uint256"},{"indexed":false,"name":"owner","type":"string"},{"indexed":false,"name":"fileHash","type":"string"}],"name":"logFileAddedStatus","type":"event"}]);
//0xf7f02f65d5cd874d180c3575cb8813a9e7736066是合约地址. 每个合约地址是固定的 复制METADATAHASH内容过来
var proof = proofContract.at("0x3a9c551f1200a93e73b33dc1dd674f74ff581955");

app.get("/submit", function(req, res){
	var fileHash = req.query.hash;
	var owner = req.query.owner;

	var accounts = web3.eth.accounts;
	console.log(accounts); 

	//owner 和 fileHash 是合约set()函数的的入参
	//合约的每次调用都算一次交易
	proof.set.sendTransaction(owner, fileHash, {
			from: web3.eth.accounts[0],
		}, 
		function(error, transactionHash){
			if (!error)
			{
				//返回交易的的hash值
				res.send(transactionHash);
			}
			else
			{
				res.send("Error");
			}
	})
})

app.get("/getInfo", function(req, res){
	var fileHash = req.query.hash;
	// 合约get函数
	// call方法用于evm当前状态上调用一个合约的方法.它不广播交易.若要读取数据,则不需要广播
	//     因为会有自己的区块链赋值
	var details = proof.get.call(fileHash);

	res.send(details);
})

//事件监听
proof.logFileAddedStatus().watch(function(error, result){
	if(!error)
	{
		if(result.args.status == true)
		{
			io.send(result);
		}
	}
})