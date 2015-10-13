var request = require( "./index.js" );

var callback = function( response ) {
    // Continuously update stream until request is completed.
    var body = "";

    response.on( "data", function( data ) {
        body += data;
    });

    response.on( "end", function() {
        // Data reception is done, do whatever with it!
        var parsed = JSON.parse(body);

        console.log( "\n" + JSON.stringify( parsed ) );
    });
};

var testRequest = {
    type: "get",
    host: "jsonplaceholder.typicode.com",
    path: "/posts/1"
};

console.log( request.request( testRequest, callback ) + "\n" );

request.error( "\nHello Error\n" );

console.log( request.loop( { source: "hello" }, { custom: "world" } ) );
