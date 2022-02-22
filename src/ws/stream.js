const chalk = require('chalk');
const stream = ( socket ) => {
    socket.on( 'subscribe', ( data ) => {
        //subscribe/join a room
        socket.join( data.room );
        socket.join( data.socketId );
        console.log(chalk.blue("[Entrée]"), chalk.bold(data.user), " vient de rejoindre ", chalk.yellow.bold(data.room));

        //Inform other members in the room of new user's arrival
        if ( socket.adapter.rooms[data.room].length > 1 ) {
            socket.to( data.room ).emit( 'new user', { socketId: data.socketId, user: data.user } );
        }
    } );


    socket.on( 'newUserStart', ( data ) => {
      console.log(chalk.blue("[connexion]"), "Nouvel Utilisateur : ", chalk.green(data.user));
        socket.to( data.to ).emit( 'newUserStart', { sender: data.sender, user: data.user } );
    } );


    socket.on( 'sdp', ( data ) => {
        socket.to( data.to ).emit( 'sdp', { description: data.description, sender: data.sender } );
    } );


    socket.on( 'ice candidates', ( data ) => {
        socket.to( data.to ).emit( 'ice candidates', { candidate: data.candidate, sender: data.sender } );
    } );


    socket.on( 'chat', ( data ) => {
        console.log(chalk.blue("[discussion]"),  "Nouveau message de ", chalk.green(data.sender), " dans ", chalk.green(data.room), " :: ", chalk.italic(data.msg));
        socket.to( data.room ).emit( 'chat', { sender: data.sender, msg: data.msg } );
    } );
};

module.exports = stream;
