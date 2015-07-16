# Magic Paths

Expand prefixed [glob](https://github.com/isaacs/node-glob) patterns into an array of matching files. The real advantage of this over using a glob matching library by itself is to be able to use path shortcuts that can reference one or more base location.

Instead of this: `some/deeply/nested/folder/*.*` you can set a prefix and reference the files in the folder like this `nested:*.*`. Very useful when the prefix references multiple locations.

## Usage

```javascript
var magic = require('magic-paths');

var options = {
    prefixes: {
        rel_fixture: 'test/fixtures'
    }
};

// Fetch files (callback style)
magic.expand('rel_fixture:*.html', options, function(err, files) {
    // ...
});

// Fetch files (promise style)
magic.expand('rel_fixture:*.html', options).then(function(files) {
    // ...
}).catch(function(err){})
```