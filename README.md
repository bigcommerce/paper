# stencil-paper

*stencil-paper* is a plugin for `stencil-cli` and `stapler`. Its duty is to render the themes using [Handlebars](http://handlebarsjs.com/) template engine.

## Usage

Load Paper into your app:

```
var Paper = require('stencil-paper');
```

Instatiate paper passing an `assembler`:
```
var paper = new Paper(assembler);
```

The `assembler` is the interface that paper uses to load the templates and translations. This way we can use paper to load the templates from the file system or any other source.
Is just an object that implements two methods: `getTemplates()` & `getTranslations()`:
```
var assembler = {
    getTemplates: function (path, processor, callback) {
      // inplement me

      callback(null, processor(templates));
    },
    getTranslations: function (callback) {
      // inplement me

      callback(null, translations);
    }
};

var paper = new Paper(assembler);
```

Now we can load the theme for the page we want to render:
```
paper.loadTheme(path, 'en', function (err) {
  var html = paper.render(path, context);

  reply(html);
});
```