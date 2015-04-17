# stencil-paper

*stencil-paper* is a plugin for `stencil-paperclip` and `stencil-stapler`.

## Usage

```
var Paper = require('stencil-paper'),
    source = {
      'pages/product': '<html>{{> pages/partial }}</html>',
      'pages/partial': '{{ variable }}'
    }, 
    data = {
       'variable': 'hello world'
    },
    compiled;

// Async
Paper.compile('pages/product', source, data, function(err, compiled) {
    console.log(err);      // null
    console.log(compiled); // "<html>hello world</html>"
});

// Sync
compiled = Paper.compileSync('pages/product', source, data);
console.log(compiled); // "<html>hello world</html>"

 
```
