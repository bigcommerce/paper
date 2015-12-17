var Code = require('code');
var Lab = require('lab');
var Precompiler = require('../../lib/precompiler');
var Fs = require('fs');
var _ = require('lodash');
var Handlebars = require('handlebars');
var sinon = require('sinon');
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Code.expect;
var it = lab.it;

describe('Paper precompiler', function() {
    var templateFiles = [
        'file1.json'
    ];
    var fileContents = '{"abc":"Inside abc,{{> bbb}}","bbb":"Inside bbb,{{> ccc}}","ccc":"Inside ccc,{{> abc}}"}';
    var noCycleFileContents = '{"abc":"Inside abc,{{> bbb}} {{> ccc}}","bbb":"Inside bbb,{{> ccc}}","ccc":"Inside ccc"}';
    var fsReaddirSyncStub;
    var fsReadfileSyncStub;
    var fsStatSyncStub;
    var fsWriteFileSyncStub;

    lab.beforeEach(function(done) {
        fsReaddirSyncStub = sinon.stub(Fs, 'readdirSync');
        fsReadfileSyncStub = sinon.stub(Fs, 'readFileSync');
        fsStatSyncStub = sinon.stub(Fs, 'statSync');
        fsWriteFileSyncStub = sinon.stub(Fs, 'writeFileSync');

        done();
    });

    lab.afterEach(function(done) {
        fsReaddirSyncStub.restore();
        fsReadfileSyncStub.restore();
        fsStatSyncStub.restore();
        fsWriteFileSyncStub.restore();

        done();
    });

    it('should throw an error if the bundle directory does not exist', function(done) {
        var error = null;
        var precompiler = new Precompiler('/var/tmp/example/fakepath');

        fsStatSyncStub.returns({
            isDirectory: function() {return false;}
        });

        try {
            precompiler.precompile();
        } catch (e) {
            error = e;
        }

        expect(error).instanceOf(Error);

        done();
    });

    it('should throw an error if the bundled templates have a cycle', function(done) {
        var error = null;
        var precompiler = new Precompiler('/var/tmp/example/fakepath');

        fsStatSyncStub.returns({
            isDirectory: function() {return true;}
        });
        fsReaddirSyncStub.returns(templateFiles);
        fsReadfileSyncStub.returns(fileContents);

        try {
            precompiler.precompile();
        } catch (e) {
            error = e;
        }

        expect(error).instanceOf(Error);

        done();
    });

    it('should precompile templates', function(done) {
        var error = null;
        var handlebars = Handlebars.create();
        var precompiler = new Precompiler('/var/tmp/example/fakepath');
        var result;

        var output;

        fsStatSyncStub.returns({
            isDirectory: function() {return true;}
        });
        fsReaddirSyncStub.returns(templateFiles);
        fsReadfileSyncStub.returns(noCycleFileContents);


        try {
            precompiler.precompile();
        } catch (e) {
            error = e;
        }

        expect(error).to.be.null();

        result = JSON.parse(fsWriteFileSyncStub.getCall(0).args[1]);

        _.each(result, function (precompiled, path) {

            if (!handlebars.partials[path]) {
                eval('var template = ' + precompiled);
                handlebars.partials[path] = handlebars.template(template);
            }
        });

        output = handlebars.partials['abc']();

        expect(output).to.equal("Inside abc,Inside bbb,Inside ccc Inside ccc");

        done();
    });
});

