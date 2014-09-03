# angular-selectize.js [![build status](https://secure.travis-ci.org/EvanOxfeld/angular-selectize.js.png)](http://travis-ci.org/EvanOxfeld/angular-selectize.js)

Angular directive that wraps the [Selectize](http://brianreavis.github.io/selectize.js/)
hybrid textbox + &lt;select> box library by Brian Reavis.

Add the `selectize` directive to a `<select>` tag like below:
```html
<select
   multiple
   ng-model="selection"
   ng-options="option.id as option.name for option in options"
   selectize="{ plugins: ['remove_button'], render: objectWithRenderFnPropertiesOnScope }">
</select>
```

Two-way binds to the ngModel.

Supports and two-way binds to an ngOptions expression. Tested with `label for value in array` and `select as label for value in array`.

In theory supports the same options with the `selectize` attribute as selectize.js.

## Demo

View and edit the [angular-selectize.js demo plunker](http://plnkr.co/edit/4BuWxF).

## Installation

```bash
$ bower install angular-selectize.js
```

## Testing

Install angular-selectize.js dependencies via Bower and dev dependencies via npm:

```bash
$ bower install
$ npm install
```

Run tests via [Karma](http://karma-runner.github.io) using the PhantomJS runner:

```bash
$ npm test
```

## License

The MIT License (MIT)

Copyright (c) 2014 Evan Oxfeld

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
