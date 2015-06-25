# Magic Paths

Expand prefixed [glob](https://github.com/isaacs/node-glob) patterns into an array of matching files. The real advantage of this over using a glob matching library by itself is to be able to use path shortcuts that can reference one or more base location.

Instead of this: `some/deeply/nested/folder/*.*` you can set a prefix and reference the files in the folder like this `nested:*.*`. Very useful when the prefix references multiple locations.

## Usage

```javascript
var magic = require('magic-paths');

// Setting global defaults
magic.defaults({
    prefixes: {
        // Single prefix
        'single': 'path/to/files/'

        // Pass an array for multiples
        'multi': [
            'test/fixtures/modules',
            'test/fixtures/alt_modules'
        ]
    },
    // Pass options to glob
    glob: {}
});

// Fetch files (callback style)
magic.expand('rel_fixture:*.html', function(err, files) {
    // ...
});

// Fetch files (promise style)
magic.expand('rel_fixture:*.html').then(function(files) {
    // ...
}).catch(function(err){})

// Custom config (does not replace global defaults)
magic.expand('custom:*.html', {
    prefixes: {
        custom: 'path/to/custom'
    }
}, function(err, files) {
    // ...
});
```