/**
 * Tests
 */

define(function( require ) {
    var registerSuite = require( "intern!object" );
    var assert = require( "intern/chai!assert" );
    var request = require( "../../src/index" );

    // @todo Require Sinon.

    var callback = function( response ) {
        // Continuously update stream until request is completed.
        var body = "";

        response.on( "data", function( data ) {
            body += data;
        });

        response.on( "end", function() {
            // Data reception is done, do whatever with it!
            var parsed = JSON.parse( body );

            console.log( "\n" + JSON.stringify( parsed ) );
        });
    };

    registerSuite({
        request: function() {
            var testRequest = {
                type: "get",
                url: "jsonplaceholder.typicode.com/posts/1"
            };

            assert.deepEqual(
                request.request( testRequest, callback ),
                { greeting: "hello", subject: "World" },
                "Request should make a request." );
        },
        getJSON: function() {
            var customProp = {
                type: "get",
                url: "jsonplaceholder.typicode.com/posts/1"
            };

            assert.deepEqual(
                request.getJSON( customProp ),
                /* @todo request object */,
                "Request should make a request." );
        }
    });
});
