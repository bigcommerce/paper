# stencil-paper
[![Build Status](https://travis-ci.org/bigcommerce/paper.svg?branch=master)](https://travis-ci.org/bigcommerce/paper) [![npm (scoped)](https://img.shields.io/npm/v/@bigcommerce/stencil-paper.svg)](https://www.npmjs.com/package/@bigcommerce/stencil-paper)

*stencil-paper* is a plugin for `stencil-cli`. Its duty is to load templates and translations, and call
out to [paper-handlebars](https://github.com/bigcommerce/paper-handlebars) to render pages.

## Usage
Load Paper into your app:
```
const Paper = require('@bigcommerce/stencil-paper');
```

Instatiate paper passing `siteSettings`, `themeSettings`, `assembler`, and an optional `logger` (overriding the default logger):
```
const paper = new Paper(siteSettings, themeSettings, assembler, logger);
```

The `assembler` is the interface that Paper uses to load the templates and translations. This way we can use paper to load the templates
from the file system or any other source. It's just an object that implements two methods: `getTemplates()` & `getTranslations()`:
```
const assembler = {
    getTemplates: (path, processor) => {
        return new Promise((resolve, reject) => {
            // implement me
            resolve(processor(templates));
        });
    },
    getTranslations: () => {
        return new Promise((resolve, reject) => {
            // implement me
            resolve(translations);
        });
    }
};
```

Now we can load the theme for the page we want to render:
```
paper.loadTheme(path, 'en').then(() => {
    paper.render(path, context).then(html => {
        reply(html);
    });
});
```

## Helpers Reference
See the [stencil API reference](https://stencil.bigcommerce.com/docs/handlebars-helpers-reference) for documentation on the available helpers.

#### License
Copyright (c) 2015-2018, Bigcommerce Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
3. All advertising materials mentioning features or use of this software
   must display the following acknowledgement:
   This product includes software developed by Bigcommerce Inc.
4. Neither the name of Bigcommerce Inc. nor the
   names of its contributors may be used to endorse or promote products
   derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY BIGCOMMERCE INC ''AS IS'' AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL BIGCOMMERCE INC BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
