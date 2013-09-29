var application_root = __dirname,
    express = require("express"),
	path = require("path");
	var databaseUrl = "sampledb"; // "username:password@example.com/mydb"
var collections = ["things"]
var db = require("mongojs").connect(databaseUrl, collections);
var url = require( "url" );
var queryString = require( "querystring" );

var app = express();

var jsonData;
// Config

app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/api', function (req, res) {
  res.header("Access-Control-Allow-Origin", "http://localhost");
  res.send('Ecomm API is running');
});



app.get('/getdartusers', function (req, res) {
	res.header("Access-Control-Allow-Origin", "http://127.0.0.1:3030");
	res.header("Access-Control-Allow-Methods", "GET, POST");
	db.things.find('', function(err, users) {
	if( err || !users) console.log("No users found");
	  else 
	{
		res.writeHead(200, {'Content-Type': 'application/json'});
		str='[';
		users.forEach( function(user) {
			str = str + '{ "name" : "' + user.username + '"},' +'\n';
		});
		str = str.trim();
		str = str.substring(0,str.length-1);
		str = str + ']';
		res.end( str);
	}
  });
});
// https://gist.github.com/nilcolor/816580
// http://stackoverflow.com/questions/17689986/jquery-ajax-sending-both-options-and-post-how-to-handle-with-express-js-node-j

app.all('/insertdartmongouser', function(req, res, next) {
 
  if (req.method === 'OPTIONS') {
      console.log('!OPTIONS');

	  var headers = {};
      // IE8 does not allow domains to be specified, just the *
      // headers["Access-Control-Allow-Origin"] = req.headers.origin;
      headers["Access-Control-Allow-Origin"] = "*";
      headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
      headers["Access-Control-Allow-Credentials"] = false;
      headers["Access-Control-Max-Age"] = '86400'; // 24 hours
      headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
      res.writeHead(200, headers);
      res.end();
	} else {
		next();
	}
});



//http://blog.frankgrimm.net/2010/11/howto-access-http-message-body-post-data-in-node-js/
app.post('/insertdartmongouser', function (req, res){
  console.log("POST: ");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  console.log("got method"+req.method);
  	  console.log("bodyghggghj ---->"+req.body);
	  console.log("bodyghggghj ---->"+req.body.mydata);
	  console.log("bodyghggghj ---->"+req.body['mydata']);
	  var alldata = '';
	  req.on('data', function(chunk) {
		console.log("Received body data:");
		console.log(chunk.toString());
		alldata = chunk.toString();
		var jsonData = JSON.parse(alldata);
		console.log(jsonData.username);
		console.log(jsonData.password);
		console.log(jsonData.email);
		db.things.save({email: jsonData.email, password: jsonData.password, username: jsonData.username}, function(err, saved) {
	    if( err || !saved ) res.end( "User not saved"); 
	    else res.end( "User saved");
	});
      
  
});
});


  
 




app.listen(1212);