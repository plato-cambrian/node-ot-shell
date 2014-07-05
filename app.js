var express = require('express'); 
var app = express();
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(app.router);
app.get('/newnym', function(req, res){
   // second argument is array of parameters, e.g.:
   // Desired command:
   // opentxs newnym --args "name \"MyNewOTServerNym\""
   var opentxs = require('child_process').spawn(
   'opentxs',
   ["newnym"
   ,"--args"
   ,"\"name \\\"MyNewOTServerNym\\\"\""
   ]);
   var output = "";
   var errs = "";
   opentxs.stdout.on('data', function(data){ output += data });
   opentxs.stderr.on('data', function(data){ errs += data });
   opentxs.on('close', function(code){ 
     if (code !== 0) {  return res.send(500, code+"\n"+output+"\n"+errs); }
     return res.send(200, output)
   });
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

require('http').createServer(app).listen(3000, function(){
  console.log('Listening on 3000');
});
