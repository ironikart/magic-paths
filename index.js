'use strict';
var glob = require('glob');
var path = require('path');
var setDefaults = require('lodash.defaults');
var Promise = require('bluebird');
var globalDefaults = {
    prefixes: {
        cwd: process.cwd()
    },
    glob: {}
};

function makeExpr(prefixes) {
    return new RegExp('^\\s*('+Object.keys(prefixes).join('|')+'):([^\\s]+)\\s*', 'i');
}

function prefix(pattern, prefixes) {
    var matches = pattern.match(makeExpr(prefixes));
    if (matches) {
        var prefixed = prefixes[matches[1]];
        var relPath = matches[2];
        if (!Array.isArray(prefixed)) {
            prefixed = [prefixed];
        }
        return prefixed.map(function(prefixPath) {
            return path.join(prefixPath, relPath);
        });
    }
    return [pattern];
}

module.exports.defaults = function(options) {
    globalDefaults = setDefaults(options, globalDefaults);
};

module.exports.expand = function(pattern) {
    var cb;
    var options = globalDefaults;

    // Allow an optional number of arguments & optional callback
    var args = Array.prototype.slice.call(arguments);
    if (args.length === 2) {
        var last = args.pop();
        if (typeof last === 'function') {
            cb = last;
        } else {
            options = last;
        }
    } else if (args.length === 3) {
        cb = args[2];
        options = args[1];
    }

    options = setDefaults(options, globalDefaults);

    return new Promise(function(resolve, reject) {
        var prefixed = prefix(pattern, options.prefixes);
        var paths = prefixed.length > 1 ? '{'+prefixed.join(',')+'}' : prefixed[0];
        glob(paths, options.glob, function(err, files) {
            if (err) {
                reject(err);
            }
            files = files.map(function(file) {
                if (!path.isAbsolute(file)) {
                    file = path.resolve(process.cwd(), file);
                }
                return file;
            });
            resolve(files);
            if (cb) {
                cb(err, files);
            }
        });
    });
};
