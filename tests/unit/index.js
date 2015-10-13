/**
 * Tests
 */

define(function( require ) {
    var registerSuite = require( "intern!object" );
    var assert = require( "intern/chai!assert" );
    var request = require( "../../src/index" );

    registerSuite({
        integrity: function() {
            assert.equal( typeof request, "object",
                "Request should be an object." );

            assert.deepEqual( Object.keys( request ),
                [ "error", "loop", "request", "getJSON", "getResponse", "prepareURI", "getBase", "getPath" ],
                "Request should have integrity." );
        },
        error: function() {
            assert.deepEqual( request.error( "Oops" ), request, "Error should return the context." );

            // @todo "Error should alert the user of an error."
        },
        loop: function() {
            assert.deepEqual(
                request.loop({ greeting: "hello" }, { subject: "World" }),
                { greeting: "hello", subject: "World" },
                "Loop should combine objects." );

            assert.deepEqual(
                request.loop(
                    { greeting: "hello" },
                    { subject: "World" },
                    function( source, key, value ) {
                        source[ key ] = value;
                        return source;
                    }
                ),
                { greeting: "hello", subject: "World" },
                "Loop should execute a callback when provided." );
        },
        getResponse: function() {
            assert.deepEqual( request.getResponse(
                { status: 200, responseJSON: { "hello": "world" } } ),
                { status: "success", data: { "hello": "world" } },
                "getResponse should parse JSON response from an AJAX request."
            );

            assert.deepEqual( request.getResponse( {} ),
                { status: "error", data: undefined },
                "getResponse returns error if AJAX request errs."
            );
        },
        prepareURI: function() {
            assert.strictEqual( request.prepareURI( "http://example.com/" ),
                "http://example.com",
                "prepareURI should remove trailing slashes." );
        },
        getBase: function() {
            assert.strictEqual( request.getBase( "http:", "example.com:8888" ), "http://example.com", "getBase should get the base of the given or the environment's URI." );
        },
        /** @todo Observe window dependency.
        getPath: function() {
            assert.strictEqual( request.getPath( { "home": "", "dashboard": "/dashboard" } ), "", "getPath should get the home path." );
        }
        */
    });
});
