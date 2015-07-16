'use strict';
/*globals describe, it*/
var expect = require('chai').expect;
var path = require('path');
var Promise = require('bluebird');

describe('Magic path expander', function() {
    var options = {
        prefixes: {
            'rel_fixture': 'test/fixtures',
            'abs_fixture': path.join(process.cwd(), 'test/fixtures'),

            'modules': [
                'test/fixtures/modules',
                'test/fixtures/alt_modules'
            ]
        }
    };

    it('can be required without throwing', function() {
        this.magic = require('../index.js');
    });

    it('can expand relative prefixes (cwd)', function(done) {
        this.magic.expand('rel_fixture:*.html', options, function(err, files) {
            expect(err).be.equal(null);
            expect(files.length).to.be.equal(3);
            expect(path.isAbsolute(files[0])).to.be.equal(true);
            done();
        });
    });

    it('can expand absolute prefixes (cwd)', function(done) {
        this.magic.expand('abs_fixture:*.html', options, function(err, files) {
            expect(err).be.equal(null);
            expect(files.length).to.be.equal(3);
            done();
        });
    });

    it('can expand an array of prefixes', function(done) {
        this.magic.expand('modules:*.html', options, function(err, files) {
            expect(err).be.equal(null);
            expect(files.length).to.be.equal(2);
            done();
        });
    });

    it('works as a promise', function(done) {
        Promise.join(
            this.magic.expand('modules:*.html', options),
            this.magic.expand('rel_fixture:*.html', options)
        ).then(function(results) {
            expect(results[0].length).to.be.equal(2);
            expect(results[1].length).to.be.equal(3);
            done();
        });
    });
});
