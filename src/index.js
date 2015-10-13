/* jshint -W097 */

/**
 * Handles URIs and requests.
 */

// Export based on environment.
if ( typeof module !== "undefined" && typeof module.exports !== "undefined" ) {
    module.exports = exports;

    var $ = require( "jquery" ),
        http = require( "http" );
} else {
    if ( typeof define === "function" && define.amd ) {
        define([ "jquery" ], function( $ ) {
            return exports;
        });

        var exports = {};
    } else {
        // @todo Do we want to fail loud like this?
        window.exports = exports;
    }
}

/**
 * Alerts user of error.
 */
exports.error = function( json ) {
    console.error( "Response returns an error: ", json );
    return this;
};

/**
 * Zips given properties into the given object.
 *
 * @todo Abstract to Format module.
 *
 * @param {object} The default object. Accepts an empty object.
 * @param {array|object} The array or object to map to new object.
 * @param {fn} The function to set new object.
 * @return {object} The new object: default object plus mapped values.
 */
exports.loop = function( source, properties, callback ) {
    Object.keys( properties ).forEach(function( key ) {
        if ( !callback ) {
            // Extend properties object.
            source[ key ] = properties[ key ];
        } else {
            // Execute callback to create new object.
            source = callback( source, key, properties[ key ] );
        }
    });

    return source;
};

/**
 * Makes a request based on the environment.
 *
 * @param {obj|string} { data, type, url, endpoint }
 * @param {fn} Node requests require a callback function to parse the response.
 */
exports.request = function( properties, callback ) {
    // Make a request from Node.
    if ( module ) {
        return http[ properties.type ]( properties, callback );
    }

    // Make a request from the browser.
    return $.ajax( properties );
};

/**
 * Uses this.request to execute an AJAX GET request for JSON data.
 */
exports.getJSON = function( customProp ) {
    var properties = { dataType: "json", method: "GET" };

    // Set custom parameters on request before sending it.
    if ( customProp ) {
        properties = this.loop( properties, customProp );
    }

    return this.request( properties );
};

/**
 * Parses the response to an AJAX request.
 *
 * @param {object} The request object returned by the $.ajax call.
 */
exports.getResponse = function( request ) {
    var response = { status: "error", data: undefined },
        text = request.responseJSON || request.responseText;

    if ( !text ) {
        return response;
    }

    // Catch for malformed JSON.
    response.data =
        text === "" || text.constructor === Array || request.responseJSON ?
        text :
        $.parseJSON( text );

    // Reset status.
    if ( response.data && request.status === 200 ) {
        response.status = "success";
    }

    return response;
};

/**
 * Standardizes URIs.
 *
 * @param {str} A URI to prepare.
 */
exports.prepareURI = function( uri ) {
    // Get the path's last character.
    var lastChar = uri.charAt( uri.length - 1 );

    // Remove any slash prepended to the port.
    uri = uri.replace( /\/:/, ":" );

    // If path ends in slash, remove slash.
    if ( lastChar === "/" ) {
        uri = uri.substring( 0, uri.length - 1 );
    }

    return uri;
};

/**
 * Construct the base URL using the window object.
 */
exports.getBase = function( protocol, host ) {
    protocol = protocol || window.location.protocol;
    host = host || window.location.host;

    // Remove port from host if set.
    if ( /:/.test( host ) ) {
        host = host.replace( /:\d+/, "" );
    }

    return protocol + "//" + host;
};

/**
 * Get the path the smart way.
 *
 * Ideal when window.location.pathname contains other path variables;
 * With this, we can avoid building broken routes for apps running on a path.
 *
 * @param {obj} A map of the site's routes.
 * @param {str}
 * @param {str}
 * @param {str}
 */
exports.getPath = function( routes, href, pathname, port ) {
    var path = "",
        index,
        regex,
        subpaths;

    pathname = pathname || window.location.pathname;
    port = port || window.location.port;
    href = href || window.location.href;

    // Set path according to environment.
    $.each( routes, function( page, address ) {
        // Set this path as regular expression.
        regex = new RegExp( address );

        // If this path is found in the pathname, deduce basepath.
        if ( regex.test( pathname ) ) {
            // Find the length of the resulting array of values.
            subpaths = pathname.split( "/" );

            // Get index of the address variable.
            index = $.inArray( address, subpaths );

            // Get after first slash up to address variable's value.
            subpaths = subpaths.slice( 1, index - 1 );

            // Add port if set on window's href property.
            if ( port && /:/.test( href ) ) {
                subpaths.unshift( ":" + port );
            }

            // Join each value of new array with a slash.
            // If array is length of 1, will not join.
            path = subpaths.join( "/" );

            // Prepare URI. If path ends in slash, remove slash.
            path = exports.prepareURI( path );
        }
    });

    return path;
};
