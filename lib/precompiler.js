var Graph = require('tarjan-graph');
var Fs = require('fs');
var Handlebars = require('handlebars');
var Path = require('path');

/**
 * A precompiler for faster runtime rendering
 * @param bundlePath
 * @constructor
 */
function StencilPrecompiler(bundlePath) {
    this.bundlePath = bundlePath;
    this.parsedTemplatePath = Path.join(this.bundlePath, 'parsed/templates');
}

/**
 * Precompiles templates for speedy runtime rendering
 */
StencilPrecompiler.prototype.precompile = function() {
    checkParsedTemplatesDirectoryExists.call(this);
    detectCycles.call(this);
    precompilePartials.call(this);
};

function checkParsedTemplatesDirectoryExists() {
    var stat = Fs.statSync(this.parsedTemplatePath);

    if (!stat.isDirectory()) {
        throw new Error(this.parsedTemplatePath + ' is not a valid directory');
    }
}

function detectCycles() {
    var partialFiles = Fs.readdirSync(this.parsedTemplatePath);
    var partialRegex = /\{\{>\s*([_|\-|a-zA-Z0-9\/]+)[^{]*?}}/g;
    var dynamicComponentRegex = /\{\{\s*?dynamicComponent\s*(?:'|")([_|\-|a-zA-Z0-9\/]+)(?:'|").*?}}/g;

    partialFiles.forEach(function(fileName) {
        var graph = new Graph();
        var filePath = Path.join(this.parsedTemplatePath, fileName);
        var dynamicComponents;
        var fileContent;
        var match;
        var matches;
        var parsedContents;
        var partial;
        var partialPath;
        var prop;

        if (Path.extname(fileName) != '.json') {
            return;
        }

        fileContent = Fs.readFileSync(filePath, 'utf8');
        parsedContents = JSON.parse(fileContent);

        for (prop in parsedContents) {
            if (parsedContents.hasOwnProperty(prop)) {
                matches = [];
                partial = parsedContents[prop];
                match = partialRegex.exec(partial);
                while (match !== null) {
                    partialPath = match[1];
                    matches.push(partialPath);
                    match = partialRegex.exec(partial);
                }

                match = dynamicComponentRegex.exec(partial);

                while (match !== null) {
                    dynamicComponents = getDynamicComponents.call(this, match[1], parsedContents);
                    matches.push.apply(matches, dynamicComponents);
                    match = dynamicComponentRegex.exec(partial);

                }

                graph.add(prop, matches);
            }
        }

        if (graph.hasCycle()) {
            throw new Error('Template includes cycle detected\r\n', graph.getCycles());
        }

    }.bind(this));
}

function getDynamicComponents(componentFolder, possibleTemplates) {
    var output = [];
    var prop;

    for (prop in possibleTemplates) {
        if (possibleTemplates.hasOwnProperty(prop)) {
            if (prop.indexOf(componentFolder) === 0) {
                output.push(prop);
            }
        }
    }

    return output;
}

function precompilePartials() {
    var partialFiles = Fs.readdirSync(this.parsedTemplatePath);
    var handlebars = Handlebars.create();
    var options = {
        preventIndent: true
    };

    partialFiles.forEach(function(fileName) {
        var filePath = Path.join(this.parsedTemplatePath, fileName);
        var precompiledMap = {};
        var fileContent;
        var parsedContents;
        var partial;
        var prop;

        if (Path.extname(fileName) != '.json') {
            return;
        }

        fileContent = Fs.readFileSync(filePath, 'utf8');
        parsedContents = JSON.parse(fileContent);

        for (prop in parsedContents) {
            if (parsedContents.hasOwnProperty(prop)) {
                partial = parsedContents[prop];
                precompiledMap[prop] = handlebars.precompile(parsedContents[prop], options);
            }
        }

        Fs.writeFileSync(filePath, JSON.stringify(precompiledMap), 'utf8');
    }.bind(this));
}

module.exports = StencilPrecompiler;
