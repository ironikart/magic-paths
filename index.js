'use strict';
var glob = require('glob');
var path = require('path');
var merge = require('deep-extend');
var Promise = require('bluebird');

function makeExpr(prefixes) {
    return new RegExp('^\\s*('+Object.keys(prefixes).join('|')+'):([^\\s]+)\\s*', 'i');
}

function _resolvePrefix(pattern, prefixes) {
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
    return pattern;
}

var prefix = module.exports.prefix = function(patterns, prefixes) {
    var prefixed;
    if (Array.isArray(patterns)) {
        prefixed = patterns.map(function(pattern) {
            return _resolvePrefix(pattern, prefixes);
        });
    } else {
        prefixed = [].concat(_resolvePrefix(patterns, prefixes));
    }
    
    return prefixed;
};

module.exports.expand = function (pattern, options) {
    var args = Array.prototype.slice.call(arguments);
    var cb = args.length === 3 ? args.pop() : function(){};

    options = merge({
        prefixes: {
            cwd: process.cwd()
        }
    }, options);

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
            cb(err, files);
        });
    });
};
