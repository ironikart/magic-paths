'use strict';
/*globals describe, it*/
var expect = require('chai').expect;
var path = require('path');
var Promise = require('bluebird');

describe('Magic path expander', function() {
    it('can be required without throwing', function() {
        this.magic = require('../index.js');
    });

    it('can handle global default configuration', function() {
        // Set defaults
        this.magic.defaults({
            prefixes: {
                'rel_fixture': 'test/fixtures',
                'abs_fixture': path.join(process.cwd(), 'test/fixtures'),

                'modules': [
                    'test/fixtures/modules',
                    'test/fixtures/alt_modules'
                ]
            }
        });
    });

    it('can expand relative prefixes (cwd)', function(done) {
        this.magic.expand('rel_fixture:*.html', function(err, files) {
            expect(err).be.equal(null);
            expect(files.length).to.be.equal(3);
            expect(path.isAbsolute(files[0])).to.be.equal(true);
            done();
        });
    });

    it('can expand absolute prefixes (cwd)', function(done) {
        this.magic.expand('abs_fixture:*.html', function(err, files) {
            expect(err).be.equal(null);
            expect(files.length).to.be.equal(3);
            done();
        });
    });

    it('can expand an array of prefixes', function(done) {
        this.magic.expand('modules:*.html', function(err, files) {
            expect(err).be.equal(null);
            expect(files.length).to.be.equal(2);
            done();
        });
    });

    it('can take custom options', function(done) {
        this.magic.expand('custom:*.html', {
            prefixes: {
                custom: 'test/fixtures/custom'
            }
        }, function(err, files) {
            expect(err).be.equal(null);
            expect(files.length).to.be.equal(1);
            expect(files[0].split('/').pop()).to.be.equal('custom.html');
            done();
        });
    });

    it('works as a promise', function(done) {
        Promise.join(
            this.magic.expand('modules:*.html'),
            this.magic.expand('rel_fixture:*.html')
        ).then(function(results) {
            expect(results[0].length).to.be.equal(2);
            expect(results[1].length).to.be.equal(3);
            done();
        });
    });
});
