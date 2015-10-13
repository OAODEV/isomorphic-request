# Request

A tiny HTTP/S client smart enough to work in Node or in the browser.

To see request work in the browser, load index.html. RequireJS is configured by `src/browser.js`, which loads `src/index.js`, the main file. The `request` variable is then a global variable you can play with in the browser console, like so: `request.request({ /* AJAX parameters */ })`

To see request execute on the command line, execute `node src/node.js`.  This will log to the command line the output from several examples.

## :satellite: API

**error**  
**loop**  
**request**  
**getJSON**  
**getResponse**  

## :wrench: Contributing

### Testing

`grunt intern:client` is equivalent to `intern-client config=tests/intern`

`grunt intern:runner` is equivalent to `intern-runner config=tests/intern`

To run the tests on a Selenium server like SauceLabs, set your credentials in a config.json file at the root of the application. See the Intern Grunt tasks to learn more.

### Style Guide

Follow the [jQuery Style Guide](https://contribute.jquery.org/style-guide/js/).

###  Dependencies
Developers hosting or contributing to this project require the tools that extend, test, and maintain it:

* [Python](https://www.python.org/): Python v2.7+ is a prerequisite of Node.
* [Node and npm](http://nodejs.org/): Node provides an environment on which to execute JavaScript processes, while npm manages packages.

### Authors
**Luz M. Costa** <luz.costa@adops.com>
