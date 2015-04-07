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
    };

Paper.compile('pages/product', source, data); 
```
