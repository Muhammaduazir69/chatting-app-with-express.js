let express = require( 'express' );
const chalk = require('chalk');
const figlet = require('figlet');
var ip = require("ip");
let app = express();
const fs = require('fs')
const httpsOptions = {
    key: fs.readFileSync('../key.pem'),
    cert: fs.readFileSync('../cert.pem')
}
let server = require( 'https' ).createServer(httpsOptions, app );
let io = require( 'socket.io' )( server );
let stream = require( './ws/stream' );
let path = require( 'path' );
let favicon = require( 'serve-favicon' );

app.use( favicon( path.join( __dirname, 'favicon.ico' ) ) );
app.use( '/assets', express.static( path.join( __dirname, 'assets' ) ) );

app.get( '/', ( req, res ) => {
    res.sendFile( __dirname + '/index.html' );
} );


io.of( '/stream' ).on( 'connection', stream );

figlet('Live Class', function(err, data) {
    if (err) {
        console.log(chalk.red('Something went wrong with figlet...'));
        console.dir(err);
        return;
    }
    console.log(chalk.blue(data))
    console.log(chalk.green.italic("Super ! Le serveur Socket.io a bien démarré et est disponible à l'adresse "));
    console.log(chalk.bgGreen.bold.black("https://"+ip.address()+":8000\n\n"));
});
server.listen( 8000 );
