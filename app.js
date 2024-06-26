/*
const express = require("express");
http   		= require('http');
const app 	= express();
const port 	= process.env.PORT || 5000;

//app.get("/", (req, res) => res.type('html').send(html_));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

//detect the user first connection
server = http.createServer(app),
io     = require('socket.io')(server);	
*/

require('dotenv').config();
const express = require('express')
//const path = require('path')
const PORT = process.env.PORT || 5000
var fs     = require("fs");
http   = require('http'),
app    = express(),
server = http.createServer(app);

var html_;
//io   = require('socket.io').listen(server); //socket.io version 2.
io     = require('socket.io')(server);	//socket.io version 4.4.
server.listen(PORT, () => console.log(`Listening on ${ PORT }`)) //socket.io version 2.

io.on('connection', (socket) => {
	console.log("************************ io connection  ********************************* socket.id = " + socket.id);
	html_ = "socket.id = " + socket.id;
	
	socket.on("note_by_id", async (note, callback)=> {
		console.log("'note_by_id = " + note);
		html_ = html_ + " note_by_id, note = " + note;
		const timeout = 1000
        await new Promise(resolve => setTimeout(resolve, timeout))
		callback( {"res":"success"});
		//socket.emit('note_by_id_res', {"res":"success"});
	});
	
});

const Pool = require('pg').Pool

/*
//localhost
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'tomcat14200',
  port: 5432,
  client_encoding: 'utf8',
  //ssl: true,
  max: 20,
  min: 1,
  idleTimeoutMillis: 1000,
})
*/

/* render pg
console.log('process.env.DATABASE_URL = ' + process.env.DATABASE_URL);
//const DATABASE_URL = "postgres://pgsql_s1ez_user:XyREyfYnYa4t1zacPLgoVwQ330pTReij@dpg-cei36h9gp3jvlf1aeb2g-a.oregon-postgres.render.com/pgsql_s1ez";
//Render
const pool = new Pool({
  //connectionString: DATABASE_URL,
   connectionString:process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
*/

//Render + Aiven + env
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
  client_encoding: 'utf8',
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync("./ca.pem").toString(),
  },
  max: 20,
  min: 1,
  idleTimeoutMillis: 1000,
});

console.log('pool = ' + pool);

//testing db
var query1 = "SELECT * " + 
    " FROM users " ;
	
	console.log('query1 = ' + query1);
	 
	 pool.query(query1, [], async(error, results) => { 
		  
		const promise = new Promise((resolve, reject) => {
			if(error)(reject("promise error " + error));
			resolve(results);
		});
		// 
		await promise;
		promise.then((results) => {
		  //console.log('**************promise in get_all_not_seen_messages. results.rows = ' + results.rows + '(results.rowCount == 0) = ' + (results.rowCount == 0));
		  //console.log('**************promise in get_all_not_seen_messages. results = '+results+' count = '+results.rowCount+' length = '+results.rows.length+' fields length = '+results.fields.length);
		  //console.log('**************value keys = '+Object.keys(results));
		  //console.log('**************rowAsArray = '+results.rowAsArray);
		 
		 for(let f of results.fields){
			console.log('field = ' + f.name);  
		 }
		  
		  /*
		  if(results.length)
			res.end(JSON.stringify({
			"status": 200, 
			"response": 'SUCCESS',
			"data": results.map(({ fromnickname, tonickname }) => ({
            			fromNickname: fromnickname,
            			toNickname: tonickname
         		 }))
        	}));
		  */
		  
		  if(results.rowCount != 0){
			  for (let i = 0; i <= results.rows.length - 1; i++){
				  for(let f of results.fields){
				  	console.log(
							' *nickname = ' + results.rows[i].nickname + "\n" 
							//' *last_name  = ' + results.rows[i].last_name  
				        );
				  }
			  }  
		  }	
		  
		  //send the result to client
		  //io.to(socket.id).emit('get_all_not_seen_messages_res', results);	
		  
		}).catch((error) =>{
			console.log("************get_all_not_seen_messages_res, promise 'SELECT ref ... from messages' " + error.message);
			//io.to(socket.id).emit('get_all_not_seen_messages_res', []);			
		});
	 });//end pool
	 



app.get("/", (req, res) => res.type('html').send(html_));
const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`
