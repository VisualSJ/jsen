/*
 * jsen
 * https://github.com/bugventure/jsen
 * v0.6.3
 *
 * Copyright (c) 2016 Veli Pehlivanov <bugventure@gmail.com>
 * Licensed under the MIT license
 */

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jsen = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./lib/jsen.js');
},{"./lib/jsen.js":5}],2:[function(require,module,exports){
'use strict';

function type(obj) {
    var str = Object.prototype.toString.call(obj);
    return str.substr(8, str.length - 9).toLowerCase();
}

function deepEqual(a, b) {
    var keysA = Object.keys(a).sort(),
        keysB = Object.keys(b).sort(),
        i, key;

    if (!equal(keysA, keysB)) {
        return false;
    }

    for (i = 0; i < keysA.length; i++) {
        key = keysA[i];

        if (!equal(a[key], b[key])) {
            return false;
        }
    }

    return true;
}

function equal(a, b) {  // jshint ignore: line
    var typeA = typeof a,
        typeB = typeof b,
        i;

    // get detailed object type
    if (typeA === 'object') {
        typeA = type(a);
    }

    // get detailed object type
    if (typeB === 'object') {
        typeB = type(b);
    }

    if (typeA !== typeB) {
        return false;
    }

    if (typeA === 'object') {
        return deepEqual(a, b);
    }

    if (typeA === 'regexp') {
        return a.toString() === b.toString();
    }

    if (typeA === 'array') {
        if (a.length !== b.length) {
            return false;
        }

        for (i = 0; i < a.length; i++) {
            if (!equal(a[i], b[i])) {
                return false;
            }
        }

        return true;
    }

    return a === b;
}

module.exports = equal;
},{}],3:[function(require,module,exports){
'use strict';

var formats = {};

// reference: http://dansnetwork.com/javascript-iso8601rfc3339-date-parser/
formats['date-time'] = /(\d\d\d\d)(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))/;
// reference: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js#L7
formats.uri = /^([a-zA-Z][a-zA-Z0-9+-.]*:){0,1}\/\/[^\s]*$/;
// reference: http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
//            http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'willful violation')
formats.email = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
// reference: https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
formats.ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
// reference: http://stackoverflow.com/questions/53497/regular-expression-that-matches-valid-ipv6-addresses
formats.ipv6 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|[fF][eE]80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::([fF]{4}(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
// reference: http://stackoverflow.com/questions/106179/regular-expression-to-match-dns-hostname-or-ip-address#answer-3824105
formats.hostname = /^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]))*$/;

module.exports = formats;
},{}],4:[function(require,module,exports){
'use strict';

module.exports = function func() {
    var name = arguments[0] || '',
        args = [].join.call([].slice.call(arguments, 1), ', '),
        lines = '',
        vars = '',
        ind = 1,
        tab = '  ',
        bs = '{[',  // block start
        be = '}]',  // block end
        space = function () {
            return new Array(ind + 1).join(tab);
        },
        push = function (line) {
            lines += space() + line + '\n';
        },
        builder = function (line) {
            var first = line[0],
                last = line[line.length - 1];

            if (be.indexOf(first) > -1 && bs.indexOf(last) > -1) {
                ind--;
                push(line);
                ind++;
            }
            else if (bs.indexOf(last) > -1) {
                push(line);
                ind++;
            }
            else if (be.indexOf(first) > -1) {
                ind--;
                push(line);
            }
            else {
                push(line);
            }

            return builder;
        };

    builder.def = function (id, def) {
        vars += space() + 'var ' + id + (def !== undefined ? ' = ' + def : '') + '\n';

        return builder;
    };

    builder.toSource = function () {
        return 'function ' + name + '(' + args + ') {\n' + vars + '\n' + lines + '\n}';
    };

    builder.compile = function (scope) {
        var src = 'return (' + builder.toSource() + ')',
            scp = scope || {},
            keys = Object.keys(scp),
            vals = keys.map(function (key) { return scp[key]; });

        return Function.apply(null, keys.concat(src)).apply(null, vals);
    };

    return builder;
};
},{}],5:[function(require,module,exports){
'use strict';

var PATH_REPLACE_EXPR = /\[.+?\]/g,
    PATH_PROP_REPLACE_EXPR = /\[?(.*?)?\]/,
    REGEX_ESCAPE_EXPR = /[\/]/g,
    STR_ESCAPE_EXPR = /(")/gim,
    VALID_IDENTIFIER_EXPR = /^[a-z_$][0-9a-z]*$/gi,
    INVALID_SCHEMA = 'jsen: invalid schema object',
    browser = typeof window === 'object' && !!window.navigator,   // jshint ignore: line
    regescape = new RegExp('/').source !== '/', // node v0.x does not properly escape '/'s in inline regex
    func = require('./func.js'),
    equal = require('./equal.js'),
    unique = require('./unique.js'),
    SchemaResolver = require('./resolver.js'),
    formats = require('./formats.js'),
    ucs2length = require('./ucs2length.js'),
    types = {},
    keywords = {};

function inlineRegex(regex) {
    regex = regex instanceof RegExp ? regex : new RegExp(regex);

    return regescape ?
        regex.toString() :
        '/' + regex.source.replace(REGEX_ESCAPE_EXPR, '\\$&') + '/';
}

function encodeStr(str) {
    return '"' + str.replace(STR_ESCAPE_EXPR, '\\$1') + '"';
}

function appendToPath(path, key) {
    VALID_IDENTIFIER_EXPR.lastIndex = 0;

    return VALID_IDENTIFIER_EXPR.test(key) ?
        path + '.' + key :
        path + '[' + encodeStr(key) + ']';
}

function type(obj) {
    if (obj === undefined) {
        return 'undefined';
    }

    var str = Object.prototype.toString.call(obj);
    return str.substr(8, str.length - 9).toLowerCase();
}

function isInteger(obj) {
    return (obj | 0) === obj;   // jshint ignore: line
}

types['null'] = function (path) {
    return path + ' === null';
};

types.boolean = function (path) {
    return 'typeof ' + path + ' === "boolean"';
};

types.string = function (path) {
    return 'typeof ' + path + ' === "string"';
};

types.number = function (path) {
    return 'typeof ' + path + ' === "number"';
};

types.integer = function (path) {
    return 'typeof ' + path + ' === "number" && !(' + path + ' % 1)';
};

types.array = function (path) {
    return path + ' !== undefined && Array.isArray(' + path + ')';
};

types.object = function (path) {
    return path + ' !== undefined && typeof ' + path + ' === "object" && ' + path + ' !== null && !Array.isArray(' + path + ')';
};

types.date = function (path) {
    return path + ' !== undefined && ' + path + ' instanceof Date';
};

keywords.type = function (context) {
    if (!context.schema.type) {
        return;
    }

    var specified = Array.isArray(context.schema.type) ? context.schema.type : [context.schema.type],
        src = specified.map(function mapType(type) {
            return types[type] ? types[type](context.path) : 'true';
        }).join(' || ');

    if (src) {
        context.code('if (!(' + src + ')) {');

        context.error('type');

        context.code('}');
    }
};

keywords['enum'] = function (context) {
    var arr = context.schema['enum'],
        clauses = [],
        value, enumType, i;

    if (!Array.isArray(arr) || !arr.length) {
        return;
    }

    for (i = 0; i < arr.length; i++) {
        value = arr[i];
        enumType = typeof value;

        if (value === null || ['boolean', 'number', 'string'].indexOf(enumType) > -1) {
            // simple equality check for simple data types
            if (enumType === 'string') {
                clauses.push(context.path + ' === ' + encodeStr(value));
            }
            else {
                clauses.push(context.path + ' === ' + value);
            }
        }
        else {
            // deep equality check for complex types or regexes
            clauses.push('equal(' + context.path + ', ' + JSON.stringify(value) + ')');
        }
    }

    context.code('if (!(' + clauses.join(' || ') + ')) {');
    context.error('enum');
    context.code('}');
};

keywords.minimum = function (context) {
    if (typeof context.schema.minimum === 'number') {
        context.code('if (' + context.path + ' < ' + context.schema.minimum + ') {');
        context.error('minimum');
        context.code('}');
    }
};

keywords.exclusiveMinimum = function (context) {
    if (context.schema.exclusiveMinimum === true && typeof context.schema.minimum === 'number') {
        context.code('if (' + context.path + ' === ' + context.schema.minimum + ') {');
        context.error('exclusiveMinimum');
        context.code('}');
    }
};

keywords.maximum = function (context) {
    if (typeof context.schema.maximum === 'number') {
        context.code('if (' + context.path + ' > ' + context.schema.maximum + ') {');
        context.error('maximum');
        context.code('}');
    }
};

keywords.exclusiveMaximum = function (context) {
    if (context.schema.exclusiveMaximum === true && typeof context.schema.maximum === 'number') {
        context.code('if (' + context.path + ' === ' + context.schema.maximum + ') {');
        context.error('exclusiveMaximum');
        context.code('}');
    }
};

keywords.multipleOf = function (context) {
    if (typeof context.schema.multipleOf === 'number') {
        var mul = context.schema.multipleOf,
            decimals = mul.toString().length - mul.toFixed(0).length - 1,
            pow = decimals > 0 ? Math.pow(10, decimals) : 1,
            path = context.path;

        if (decimals > 0) {
            context.code('if (+(Math.round((' + path + ' * ' + pow + ') + "e+" + ' + decimals + ') + "e-" + ' + decimals + ') % ' + (mul * pow) + ' !== 0) {');
        } else {
            context.code('if (((' + path + ' * ' + pow + ') % ' + (mul * pow) + ') !== 0) {');
        }

        context.error('multipleOf');
        context.code('}');
    }
};

keywords.minLength = function (context) {
    if (isInteger(context.schema.minLength)) {
        context.code('if (ucs2length(' + context.path + ') < ' + context.schema.minLength + ') {');
        context.error('minLength');
        context.code('}');
    }
};

keywords.maxLength = function (context) {
    if (isInteger(context.schema.maxLength)) {
        context.code('if (ucs2length(' + context.path + ') > ' + context.schema.maxLength + ') {');
        context.error('maxLength');
        context.code('}');
    }
};

keywords.pattern = function (context) {
    var pattern = context.schema.pattern;

    if (typeof pattern === 'string' || pattern instanceof RegExp) {
        context.code('if (!(' + inlineRegex(pattern) + ').test(' + context.path + ')) {');
        context.error('pattern');
        context.code('}');
    }
};

keywords.format = function (context) {
    if (typeof context.schema.format !== 'string' || !formats[context.schema.format]) {
        return;
    }

    context.code('if (!(' + formats[context.schema.format] + ').test(' + context.path + ')) {');
    context.error('format');
    context.code('}');
};

keywords.minItems = function (context) {
    if (isInteger(context.schema.minItems)) {
        context.code('if (' + context.path + '.length < ' + context.schema.minItems + ') {');
        context.error('minItems');
        context.code('}');
    }
};

keywords.maxItems = function (context) {
    if (isInteger(context.schema.maxItems)) {
        context.code('if (' + context.path + '.length > ' + context.schema.maxItems + ') {');
        context.error('maxItems');
        context.code('}');
    }
};

keywords.additionalItems = function (context) {
    if (context.schema.additionalItems === false && Array.isArray(context.schema.items)) {
        context.code('if (' + context.path + '.length > ' + context.schema.items.length + ') {');
        context.error('additionalItems');
        context.code('}');
    }
};

keywords.uniqueItems = function (context) {
    if (context.schema.uniqueItems) {
        context.code('if (unique(' + context.path + ').length !== ' + context.path + '.length) {');
        context.error('uniqueItems');
        context.code('}');
    }
};

keywords.items = function (context) {
    var index = context.declare(0),
        i = 0;

    if (type(context.schema.items) === 'object') {
        context.code('for (' + index + ' = 0; ' + index + ' < ' + context.path + '.length; ' + index + '++) {');

        context.validate(context.path + '[' + index + ']', context.schema.items, context.noFailFast);

        context.code('}');
    }
    else if (Array.isArray(context.schema.items)) {
        for (; i < context.schema.items.length; i++) {
            context.code('if (' + context.path + '.length - 1 >= ' + i + ') {');

            context.validate(context.path + '[' + i + ']', context.schema.items[i], context.noFailFast);

            context.code('}');
        }

        if (type(context.schema.additionalItems) === 'object') {
            context.code('for (' + index + ' = ' + i + '; ' + index + ' < ' + context.path + '.length; ' + index + '++) {');

            context.validate(context.path + '[' + index + ']', context.schema.additionalItems, context.noFailFast);

            context.code('}');
        }
    }
};

keywords.maxProperties = function (context) {
    if (isInteger(context.schema.maxProperties)) {
        context.code('if (Object.keys(' + context.path + ').length > ' + context.schema.maxProperties + ') {');
        context.error('maxProperties');
        context.code('}');
    }
};

keywords.minProperties = function (context) {
    if (isInteger(context.schema.minProperties)) {
        context.code('if (Object.keys(' + context.path + ').length < ' + context.schema.minProperties + ') {');
        context.error('minProperties');
        context.code('}');
    }
};

keywords.required = function (context) {
    if (!Array.isArray(context.schema.required)) {
        return;
    }

    for (var i = 0; i < context.schema.required.length; i++) {
        context.code('if (' + appendToPath(context.path, context.schema.required[i]) + ' === undefined) {');
        context.error('required', context.schema.required[i]);
        context.code('}');
    }
};

keywords.properties = function (context) {
    if (context.validatedProperties) {
        // prevent multiple generations of property validation
        return;
    }

    var props = context.schema.properties,
        propKeys = type(props) === 'object' ? Object.keys(props) : [],
        patProps = context.schema.patternProperties,
        patterns = type(patProps) === 'object' ? Object.keys(patProps) : [],
        addProps = context.schema.additionalProperties,
        addPropsCheck = addProps === false || type(addProps) === 'object',
        prop, i, nestedPath;

    // do not use this generator if we have patternProperties or additionalProperties
    // instead, the generator below will be used for all three keywords
    if (!propKeys.length || patterns.length || addPropsCheck) {
        return;
    }

    for (i = 0; i < propKeys.length; i++) {
        prop = propKeys[i];
        nestedPath = appendToPath(context.path, prop);

        context.code('if (' + nestedPath + ' !== undefined) {');

        context.validate(nestedPath, props[prop], context.noFailFast);

        context.code('}');
    }

    context.validatedProperties = true;
};

keywords.patternProperties = keywords.additionalProperties = function (context) {
    if (context.validatedProperties) {
        // prevent multiple generations of this function
        return;
    }

    var props = context.schema.properties,
        propKeys = type(props) === 'object' ? Object.keys(props) : [],
        patProps = context.schema.patternProperties,
        patterns = type(patProps) === 'object' ? Object.keys(patProps) : [],
        addProps = context.schema.additionalProperties,
        addPropsCheck = addProps === false || type(addProps) === 'object',
        keys, key, n, found,
        propKey, pattern, i;

    if (!propKeys.length && !patterns.length && !addPropsCheck) {
        return;
    }

    keys = context.declare('[]');
    key = context.declare('""');
    n = context.declare(0);

    if (addPropsCheck) {
        found = context.declare(false);
    }

    context.code(keys + ' = Object.keys(' + context.path + ')');

    context.code('for (' + n + ' = 0; ' + n + ' < ' + keys + '.length; ' + n + '++) {')
        (key + ' = ' + keys + '[' + n + ']')

        ('if (' + context.path + '[' + key + '] === undefined) {')
            ('continue')
        ('}');

    if (addPropsCheck) {
        context.code(found + ' = false');
    }

    // validate regular properties
    for (i = 0; i < propKeys.length; i++) {
        propKey = propKeys[i];

        context.code((i ? 'else ' : '') + 'if (' + key + ' === ' + encodeStr(propKey) + ') {');

        if (addPropsCheck) {
            context.code(found + ' = true');
        }

        context.validate(appendToPath(context.path, propKey), props[propKey], context.noFailFast);

        context.code('}');
    }

    // validate pattern properties
    for (i = 0; i < patterns.length; i++) {
        pattern = patterns[i];

        context.code('if ((' + inlineRegex(pattern) + ').test(' + key + ')) {');

        if (addPropsCheck) {
            context.code(found + ' = true');
        }

        context.validate(context.path + '[' + key + ']', patProps[pattern], context.noFailFast);

        context.code('}');
    }

    // validate additional properties
    if (addPropsCheck) {
        context.code('if (!' + found + ') {');

        if (addProps === false) {
            // do not allow additional properties
            context.error('additionalProperties', undefined, key);
        }
        else {
            // validate additional properties
            context.validate(context.path + '[' + key + ']', addProps, context.noFailFast);
        }

        context.code('}');
    }

    context.code('}');

    context.validatedProperties = true;
};

keywords.dependencies = function (context) {
    if (type(context.schema.dependencies) !== 'object') {
        return;
    }

    var key, dep, i = 0;

    for (key in context.schema.dependencies) {
        dep = context.schema.dependencies[key];

        context.code('if (' + appendToPath(context.path, key) + ' !== undefined) {');

        if (type(dep) === 'object') {
            //schema dependency
            context.validate(context.path, dep, context.noFailFast);
        }
        else {
            // property dependency
            for (i; i < dep.length; i++) {
                context.code('if (' + appendToPath(context.path, dep[i]) + ' === undefined) {');
                context.error('dependencies', dep[i]);
                context.code('}');
            }
        }

        context.code('}');
    }
};

keywords.allOf = function (context) {
    if (!Array.isArray(context.schema.allOf)) {
        return;
    }

    for (var i = 0; i < context.schema.allOf.length; i++) {
        context.validate(context.path, context.schema.allOf[i], context.noFailFast);
    }
};

keywords.anyOf = function (context) {
    if (!Array.isArray(context.schema.anyOf)) {
        return;
    }

    var errCount = context.declare(0),
        initialCount = context.declare(0),
        found = context.declare(false),
        i = 0;

    context.code(initialCount + ' = errors.length');

    for (; i < context.schema.anyOf.length; i++) {
        context.code('if (!' + found + ') {');

        context.code(errCount + ' = errors.length');

        context.validate(context.path, context.schema.anyOf[i], true);

        context.code(found + ' = errors.length === ' + errCount)
        ('}');
    }

    context.code('if (!' + found + ') {');

    context.error('anyOf');

    context.code('} else {')
        ('errors.length = ' + initialCount)
    ('}');
};

keywords.oneOf = function (context) {
    if (!Array.isArray(context.schema.oneOf)) {
        return;
    }

    var matching = context.declare(0),
        initialCount = context.declare(0),
        errCount = context.declare(0),
        i = 0;

    context.code(initialCount + ' = errors.length');
    context.code(matching + ' = 0');

    for (; i < context.schema.oneOf.length; i++) {
        context.code(errCount + ' = errors.length');

        context.validate(context.path, context.schema.oneOf[i], true);

        context.code('if (errors.length === ' + errCount + ') {')
            (matching + '++')
        ('}');
    }

    context.code('if (' + matching + ' !== 1) {');

    context.error('oneOf');

    context.code('} else {')
        ('errors.length = ' + initialCount)
    ('}');
};

keywords.not = function (context) {
    if (type(context.schema.not) !== 'object') {
        return;
    }

    var errCount = context.declare(0);

    context.code(errCount + ' = errors.length');

    context.validate(context.path, context.schema.not, true);

    context.code('if (errors.length === ' + errCount + ') {');

    context.error('not');

    context.code('} else {')
        ('errors.length = ' + errCount)
    ('}');
};

['minimum', 'exclusiveMinimum', 'maximum', 'exclusiveMaximum', 'multipleOf']
    .forEach(function (keyword) { keywords[keyword].type = 'number'; });

['minLength', 'maxLength', 'pattern', 'format']
    .forEach(function (keyword) { keywords[keyword].type = 'string'; });

['minItems', 'maxItems', 'additionalItems', 'uniqueItems', 'items']
    .forEach(function (keyword) { keywords[keyword].type = 'array'; });

['maxProperties', 'minProperties', 'required', 'properties', 'patternProperties', 'additionalProperties', 'dependencies']
    .forEach(function (keyword) { keywords[keyword].type = 'object'; });

function getGenerators(schema) {
    var keys = Object.keys(schema),
        start = [],
        perType = {},
        gen, i;

    for (i = 0; i < keys.length; i++) {
        gen = keywords[keys[i]];

        if (!gen) {
            continue;
        }

        if (gen.type) {
            if (!perType[gen.type]) {
                perType[gen.type] = [];
            }

            perType[gen.type].push(gen);
        }
        else {
            start.push(gen);
        }
    }

    return start.concat(Object.keys(perType).reduce(function (arr, key) {
        return arr.concat(perType[key]);
    }, []));
}

function replaceIndexedProperty(match) {
    var index = match.replace(PATH_PROP_REPLACE_EXPR, '$1');

    if (!isNaN(+index)) {
        // numeric index in array
        return '.' + index;
    }
    else if (index[0] === '"') {
        // string key for an object property
        return '[\\"' + index.substr(1, index.length - 2) + '\\"]';
    }

    // variable containing the actual key
    return '." + ' + index + ' + "';
}

function getPathExpression(path) {
    return '"' + path.replace(PATH_REPLACE_EXPR, replaceIndexedProperty).substr(5) + '"';
}

function clone(obj) {
    var cloned = obj,
        objType = type(obj),
        key, i;

    if (objType === 'object') {
        cloned = {};

        for (key in obj) {
            cloned[key] = clone(obj[key]);
        }
    }
    else if (objType === 'array') {
        cloned = [];

        for (i = 0; i < obj.length; i++) {
            cloned[i] = clone(obj[i]);
        }
    }
    else if (objType === 'regexp') {
        return new RegExp(obj);
    }
    else if (objType === 'date') {
        return new Date(obj.toJSON());
    }

    return cloned;
}

function PropertyMarker() {
    this.objects = [];
    this.properties = [];
}

PropertyMarker.prototype.mark = function (obj, key) {
    var index = this.objects.indexOf(obj),
        prop;

    if (index < 0) {
        this.objects.push(obj);

        prop = {};
        prop[key] = 1;

        this.properties.push(prop);

        return;
    }

    prop = this.properties[index];

    prop[key] = prop[key] ? prop[key] + 1 : 1;
};

PropertyMarker.prototype.deleteDuplicates = function () {
    var key, i;

    for (i = 0; i < this.properties.length; i++) {
        for (key in this.properties[i]) {
            if (this.properties[i][key] > 1) {
                delete this.objects[i][key];
            }
        }
    }
};

PropertyMarker.prototype.dispose = function () {
    this.objects.length = 0;
    this.properties.length = 0;
};

function build(schema, def, additional, resolver, parentMarker) {
    var defType, defValue, key, i, propertyMarker;

    if (type(schema) !== 'object') {
        return def;
    }

    schema = resolver.resolve(schema);

    if (def === undefined && schema.hasOwnProperty('default')) {
        def = clone(schema['default']);
    }

    defType = type(def);

    if (defType === 'object' && type(schema.properties) === 'object') {
        for (key in schema.properties) {
            defValue = build(schema.properties[key], def[key], additional, resolver);

            if (defValue !== undefined) {
                def[key] = defValue;
            }
        }

        if (additional !== 'always') {
            for (key in def) {
                if (!(key in schema.properties) &&
                    (schema.additionalProperties === false ||
                    (additional === false && !schema.additionalProperties))) {

                    if (parentMarker) {
                        parentMarker.mark(def, key);
                    }
                    else {
                        delete def[key];
                    }
                }
            }
        }
    }
    else if (defType === 'array' && schema.items) {
        if (type(schema.items) === 'array') {
            for (i = 0; i < schema.items.length; i++) {
                defValue = build(schema.items[i], def[i], additional, resolver);

                if (defValue !== undefined || i < def.length) {
                    def[i] = defValue;
                }
            }
        }
        else if (def.length) {
            for (i = 0; i < def.length; i++) {
                def[i] = build(schema.items, def[i], additional, resolver);
            }
        }
    }
    else if (type(schema.allOf) === 'array' && schema.allOf.length) {
        propertyMarker = new PropertyMarker();

        for (i = 0; i < schema.allOf.length; i++) {
            def = build(schema.allOf[i], def, additional, resolver, propertyMarker);
        }

        propertyMarker.deleteDuplicates();
        propertyMarker.dispose();
    }

    return def;
}

function jsen(schema, options) {
    if (type(schema) !== 'object') {
        throw new Error(INVALID_SCHEMA);
    }

    options = options || {};

    var missing$Ref = options.missing$Ref || false,
        resolver = new SchemaResolver(schema, options.schemas, missing$Ref),
        counter = 0,
        id = function () { return 'i' + (counter++); },
        funcache = {},
        compiled,
        refs = {
            errors: []
        },
        scope = {
            equal: equal,
            unique: unique,
            ucs2length: ucs2length,
            refs: refs
        };

    function cache(schema) {
        var deref = resolver.resolve(schema),
            ref = schema.$ref,
            cached = funcache[ref],
            func;

        if (!cached) {
            cached = funcache[ref] = {
                key: id(),
                func: function (data) {
                    return func(data);
                }
            };

            func = compile(deref);

            Object.defineProperty(cached.func, 'errors', {
                get: function () {
                    return func.errors;
                }
            });

            refs[cached.key] = cached.func;
        }

        return 'refs.' + cached.key;
    }

    function compile(schema) {  // jshint ignore: line
        function declare(def) {
            var variname = id();

            code.def(variname, def);

            return variname;
        }

        function validate(path, schema, noFailFast) {
            var context,
                encodedFormat,
                cachedRef,
                pathExp,
                index,
                lastType,
                format,
                gens,
                gen,
                i;

            function error(keyword, key, additional) {
                var errorPath = path,
                    res = key && schema.properties && schema.properties[key] ?
                        resolver.resolve(schema.properties[key]) : null,
                    message = res ? res.requiredMessage : schema.invalidMessage;

                if (!message) {
                    message = (res && res.messages && res.messages[keyword]) ||
                        (schema.messages && schema.messages[keyword]);
                }

                errorPath = path.indexOf('[') > -1 ? getPathExpression(path) : encodeStr(errorPath.substr(5));

                if (key) {
                    errorPath = errorPath !== '""' ? errorPath + ' + ".' + key + '"' : encodeStr(key);
                }

                code('errors.push({');

                if (message) {
                    code('message: ' + encodeStr(message) + ',');
                }

                if (additional) {
                    code('additionalProperties: ' + additional + ',');
                }

                code('path: ' +  errorPath + ', ')
                    ('keyword: ' + encodeStr(keyword))
                ('})');

                if (!noFailFast && !options.greedy) {
                    code('return (validate.errors = errors) && false');
                }
            }

            if (type(schema) !== 'object') {
                return;
            }

            if (schema.$ref !== undefined) {
                cachedRef = cache(schema);
                pathExp = getPathExpression(path);
                index = declare(0);

                code('if (!' + cachedRef + '(' + path + ')) {')
                    ('if (' + cachedRef + '.errors) {')
                        ('errors.push.apply(errors, ' + cachedRef + '.errors)')
                        ('for (' + index + ' = 0; ' + index + ' < ' + cachedRef + '.errors.length; ' + index + '++) {')
                            ('if (' + cachedRef + '.errors[' + index + '].path) {')
                                ('errors[errors.length - ' + cachedRef + '.errors.length + ' + index + '].path = ' + pathExp +
                                    ' + "." + ' + cachedRef + '.errors[' + index + '].path')
                            ('} else {')
                                ('errors[errors.length - ' + cachedRef + '.errors.length + ' + index + '].path = ' + pathExp)
                            ('}')
                        ('}')
                    ('}')
                ('}');

                return;
            }

            context = {
                path: path,
                schema: schema,
                code: code,
                declare: declare,
                validate: validate,
                error: error,
                noFailFast: noFailFast
            };

            gens = getGenerators(schema);

            for (i = 0; i < gens.length; i++) {
                gen = gens[i];

                if (gen.type && lastType !== gen.type) {
                    if (lastType) {
                        code('}');
                    }

                    lastType = gen.type;

                    code('if (' + types[gen.type](path) + ') {');
                }

                gen(context);
            }

            if (lastType) {
                code('}');
            }

            if (schema.format && options.formats) {
                format = options.formats[schema.format];

                if (format) {
                    if (typeof format === 'string' || format instanceof RegExp) {
                        code('if (!(' + inlineRegex(format) + ').test(' + context.path + ')) {');
                        error('format');
                        code('}');
                    }
                    else if (typeof format === 'function') {
                        (scope.formats || (scope.formats = {}))[schema.format] = format;
                        (scope.schemas || (scope.schemas = {}))[schema.format] = schema;

                        encodedFormat = encodeStr(schema.format);

                        code('if (!formats[' + encodedFormat + '](' + context.path + ', schemas[' + encodedFormat + '])) {');
                        error('format');
                        code('}');
                    }
                }
            }
        }

        var code = func('validate', 'data')     // jshint ignore: line
            ('var errors = []');

        validate('data', schema);

        code('return (validate.errors = errors) && errors.length === 0');

        compiled = code.compile(scope);

        compiled.errors = [];

        compiled.build = function (initial, options) {
            return build(
                schema,
                (options && options.copy === false ? initial : clone(initial)),
                options && options.additionalProperties,
                resolver);
        };

        return compiled;
    }

    return compile(schema);
}

jsen.browser = browser;
jsen.clone = clone;
jsen.equal = equal;
jsen.unique = unique;
jsen.ucs2length = ucs2length;
jsen.SchemaResolver = SchemaResolver;
jsen.resolve = SchemaResolver.resolvePointer;

module.exports = jsen;

},{"./equal.js":2,"./formats.js":3,"./func.js":4,"./resolver.js":7,"./ucs2length.js":8,"./unique.js":9}],6:[function(require,module,exports){
module.exports={
    "id": "http://json-schema.org/draft-04/schema#",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "description": "Core schema meta-schema",
    "definitions": {
        "schemaArray": {
            "type": "array",
            "minItems": 1,
            "items": { "$ref": "#" }
        },
        "positiveInteger": {
            "type": "integer",
            "minimum": 0
        },
        "positiveIntegerDefault0": {
            "allOf": [ { "$ref": "#/definitions/positiveInteger" }, { "default": 0 } ]
        },
        "simpleTypes": {
            "enum": [ "array", "boolean", "integer", "null", "number", "object", "string" ]
        },
        "stringArray": {
            "type": "array",
            "items": { "type": "string" },
            "minItems": 1,
            "uniqueItems": true
        }
    },
    "type": "object",
    "properties": {
        "id": {
            "type": "string",
            "format": "uri"
        },
        "$schema": {
            "type": "string",
            "format": "uri"
        },
        "title": {
            "type": "string"
        },
        "description": {
            "type": "string"
        },
        "default": {},
        "multipleOf": {
            "type": "number",
            "minimum": 0,
            "exclusiveMinimum": true
        },
        "maximum": {
            "type": "number"
        },
        "exclusiveMaximum": {
            "type": "boolean",
            "default": false
        },
        "minimum": {
            "type": "number"
        },
        "exclusiveMinimum": {
            "type": "boolean",
            "default": false
        },
        "maxLength": { "$ref": "#/definitions/positiveInteger" },
        "minLength": { "$ref": "#/definitions/positiveIntegerDefault0" },
        "pattern": {
            "type": "string",
            "format": "regex"
        },
        "additionalItems": {
            "anyOf": [
                { "type": "boolean" },
                { "$ref": "#" }
            ],
            "default": {}
        },
        "items": {
            "anyOf": [
                { "$ref": "#" },
                { "$ref": "#/definitions/schemaArray" }
            ],
            "default": {}
        },
        "maxItems": { "$ref": "#/definitions/positiveInteger" },
        "minItems": { "$ref": "#/definitions/positiveIntegerDefault0" },
        "uniqueItems": {
            "type": "boolean",
            "default": false
        },
        "maxProperties": { "$ref": "#/definitions/positiveInteger" },
        "minProperties": { "$ref": "#/definitions/positiveIntegerDefault0" },
        "required": { "$ref": "#/definitions/stringArray" },
        "additionalProperties": {
            "anyOf": [
                { "type": "boolean" },
                { "$ref": "#" }
            ],
            "default": {}
        },
        "definitions": {
            "type": "object",
            "additionalProperties": { "$ref": "#" },
            "default": {}
        },
        "properties": {
            "type": "object",
            "additionalProperties": { "$ref": "#" },
            "default": {}
        },
        "patternProperties": {
            "type": "object",
            "additionalProperties": { "$ref": "#" },
            "default": {}
        },
        "dependencies": {
            "type": "object",
            "additionalProperties": {
                "anyOf": [
                    { "$ref": "#" },
                    { "$ref": "#/definitions/stringArray" }
                ]
            }
        },
        "enum": {
            "type": "array",
            "minItems": 1,
            "uniqueItems": true
        },
        "type": {
            "anyOf": [
                { "$ref": "#/definitions/simpleTypes" },
                {
                    "type": "array",
                    "items": { "$ref": "#/definitions/simpleTypes" },
                    "minItems": 1,
                    "uniqueItems": true
                }
            ]
        },
        "allOf": { "$ref": "#/definitions/schemaArray" },
        "anyOf": { "$ref": "#/definitions/schemaArray" },
        "oneOf": { "$ref": "#/definitions/schemaArray" },
        "not": { "$ref": "#" }
    },
    "dependencies": {
        "exclusiveMaximum": [ "maximum" ],
        "exclusiveMinimum": [ "minimum" ]
    },
    "default": {}
}
},{}],7:[function(require,module,exports){
'use strict';

var url = require('url'),
    metaschema = require('./metaschema.json'),
    INVALID_SCHEMA_REFERENCE = 'jsen: invalid schema reference',
    INVALID_SCHEMA_ID = 'jsen: invalid schema id',
    DUPLICATE_SCHEMA_ID = 'jsen: duplicate schema id',
    CIRCULAR_SCHEMA_REFERENCE = 'jsen: circular schema reference';

function get(obj, path) {
    if (!path.length) {
        return obj;
    }

    var key = path.shift(),
        val;

    if (obj && typeof obj === 'object' && obj.hasOwnProperty(key)) {
        val = obj[key];
    }

    if (path.length) {
        if (val && typeof val === 'object') {
            return get(val, path);
        }

        return undefined;
    }

    return val;
}

function refToObj(ref) {
    var index = ref.indexOf('#'),
        ret = {
            base: ref.substr(0, index),
            path: []
        };

    if (index < 0) {
        ret.base = ref;
        return ret;
    }

    ref = ref.substr(index + 1);

    if (!ref) {
        return ret;
    }

    ret.path = ref.split('/').map(function (segment) {
        // Reference: http://tools.ietf.org/html/draft-ietf-appsawg-json-pointer-08#section-3
        return decodeURIComponent(segment)
            .replace(/~1/g, '/')
            .replace(/~0/g, '~');
    });

    if (ref[0] === '/') {
        ret.path.shift();
    }

    return ret;
}

// TODO: Can we prevent nested resolvers and combine schemas instead?
function SchemaResolver(rootSchema, external, missing$Ref, baseId) {  // jshint ignore: line
    this.rootSchema = rootSchema;
    this.resolvers = null;
    this.resolvedRootSchema = null;
    this.cache = {};
    this.idCache = {};
    this.refCache = { refs: [], schemas: [] };
    this.missing$Ref = missing$Ref;
    this.refStack = [];

    baseId = baseId || '';

    this._buildIdCache(rootSchema, baseId);

    // get updated base id after normalizing root schema id
    baseId = this.refCache.refs[this.refCache.schemas.indexOf(this.rootSchema)] || baseId;

    this._buildResolvers(external, baseId);
}

SchemaResolver.prototype._cacheId = function (id, schema, resolver) {
    if (this.idCache[id]) {
        throw new Error(DUPLICATE_SCHEMA_ID + ' ' + id);
    }

    this.idCache[id] = { resolver: resolver, schema: schema };
};

SchemaResolver.prototype._buildIdCache = function (schema, baseId) {
    var id = baseId,
        ref, keys, i;

    if (!schema || typeof schema !== 'object') {
        return;
    }

    if (schema.id !== undefined) {
        if (!schema.id || typeof schema.id !== 'string' || schema.id === '#') {
            throw new Error(INVALID_SCHEMA_ID + ' ' + schema.id);
        }

        id = url.resolve(baseId, schema.id);

        this._cacheId(id, schema, this);
    }
    else if (schema === this.rootSchema && baseId) {
        this._cacheId(baseId, schema, this);
    }

    if (schema.$ref && typeof schema.$ref === 'string') {
        ref = url.resolve(id, schema.$ref);

        this.refCache.schemas.push(schema);
        this.refCache.refs.push(ref);
    }

    keys = Object.keys(schema);

    for (i = 0; i < keys.length; i++) {
        this._buildIdCache(schema[keys[i]], id);
    }
};

SchemaResolver.prototype._buildResolvers = function (schemas, baseId) {
    if (!schemas || typeof schemas !== 'object') {
        return;
    }

    var that = this,
        resolvers = {};

    Object.keys(schemas).forEach(function (key) {
        var id = url.resolve(baseId, key),
            resolver = new SchemaResolver(schemas[key], null, that.missing$Ref, id);

        that._cacheId(id, resolver.rootSchema, resolver);

        Object.keys(resolver.idCache).forEach(function (idKey) {
            that.idCache[idKey] = resolver.idCache[idKey];
        });

        resolvers[key] = resolver;
    });

    this.resolvers = resolvers;
};

SchemaResolver.prototype._getNormalizedRef = function (schema) {
    var index = this.refCache.schemas.indexOf(schema);
    return this.refCache.refs[index];
};

SchemaResolver.prototype._resolveRef = function (ref) {
    var err = new Error(INVALID_SCHEMA_REFERENCE + ' ' + ref),
        idCache = this.idCache,
        externalResolver, cached, descriptor, path, dest;

    if (!ref || typeof ref !== 'string') {
        throw err;
    }

    if (ref === metaschema.id) {
        dest = metaschema;
    }

    cached = idCache[ref];

    if (cached) {
        dest = cached.resolver.resolve(cached.schema);
    }

    if (dest === undefined) {
        descriptor = refToObj(ref);
        path = descriptor.path;

        if (descriptor.base) {
            cached = idCache[descriptor.base] || idCache[descriptor.base + '#'];

            if (cached) {
                dest = cached.resolver.resolve(get(cached.schema, path.slice(0)));
            }
            else {
                path.unshift(descriptor.base);
            }
        }
    }

    if (dest === undefined && this.resolvedRootSchema) {
        dest = get(this.resolvedRootSchema, path.slice(0));
    }

    if (dest === undefined) {
        dest = get(this.rootSchema, path.slice(0));
    }

    if (dest === undefined && path.length && this.resolvers) {
        externalResolver = get(this.resolvers, path);

        if (externalResolver) {
            dest = externalResolver.resolve(externalResolver.rootSchema);
        }
    }

    if (dest === undefined || typeof dest !== 'object') {
        if (this.missing$Ref) {
            dest = {};
        } else {
            throw err;
        }
    }

    if (this.cache[ref] === dest) {
        return dest;
    }

    this.cache[ref] = dest;

    if (dest.$ref !== undefined) {
        dest = this.resolve(dest);
    }

    return dest;
};

SchemaResolver.prototype.resolve = function (schema) {
    if (!schema || typeof schema !== 'object' || schema.$ref === undefined) {
        return schema;
    }

    var ref = this._getNormalizedRef(schema) || schema.$ref,
        resolved = this.cache[ref];

    if (resolved !== undefined) {
        return resolved;
    }

    if (this.refStack.indexOf(ref) > -1)  {
        throw new Error(CIRCULAR_SCHEMA_REFERENCE + ' ' + ref);
    }

    this.refStack.push(ref);

    resolved = this._resolveRef(ref);

    this.refStack.pop();

    if (schema === this.rootSchema) {
        // cache the resolved root schema
        this.resolvedRootSchema = resolved;
    }

    return resolved;
};

SchemaResolver.resolvePointer = function (obj, pointer) {
    var descriptor = refToObj(pointer),
        path = descriptor.path;

    if (descriptor.base) {
        path = [descriptor.base].concat(path);
    }

    return get(obj, path);
};

module.exports = SchemaResolver;
},{"./metaschema.json":6,"url":14}],8:[function(require,module,exports){
'use strict';

// Reference: https://github.com/bestiejs/punycode.js/blob/master/punycode.js#L101`
// Info: https://mathiasbynens.be/notes/javascript-unicode
function ucs2length(string) {
    var ucs2len = 0,
        counter = 0,
        length = string.length,
        value, extra;

    while (counter < length) {
        ucs2len++;
        value = string.charCodeAt(counter++);

        if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
            // It's a high surrogate, and there is a next character.
            extra = string.charCodeAt(counter++);

            if ((extra & 0xFC00) !== 0xDC00) { /* Low surrogate. */                 // jshint ignore: line
                counter--;
            }
        }
    }

    return ucs2len;
}

module.exports = ucs2length;
},{}],9:[function(require,module,exports){
'use strict';

var equal = require('./equal.js');

function findIndex(arr, value, comparator) {
    for (var i = 0, len = arr.length; i < len; i++) {
        if (comparator(arr[i], value)) {
            return i;
        }
    }

    return -1;
}

module.exports = function unique(arr) {
    return arr.filter(function uniqueOnly(value, index, self) {
        return findIndex(self, value, equal) === index;
    });
};

module.exports.findIndex = findIndex;
},{"./equal.js":2}],10:[function(require,module,exports){
(function (global){
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],11:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],12:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],13:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":11,"./encode":12}],14:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var punycode = require('punycode');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a puny coded representation of "domain".
      // It only converts the part of the domain name that
      // has non ASCII characters. I.e. it dosent matter if
      // you call it with a domain that already is in ASCII.
      var domainArray = this.hostname.split('.');
      var newOut = [];
      for (var i = 0; i < domainArray.length; ++i) {
        var s = domainArray[i];
        newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
            'xn--' + punycode.encode(s) : s);
      }
      this.hostname = newOut.join('.');
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  Object.keys(this).forEach(function(k) {
    result[k] = this[k];
  }, this);

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    Object.keys(relative).forEach(function(k) {
      if (k !== 'protocol')
        result[k] = relative[k];
    });

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      Object.keys(relative).forEach(function(k) {
        result[k] = relative[k];
      });
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especialy happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!isNull(result.pathname) || !isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host) && (last === '.' || last === '..') ||
      last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last == '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especialy happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!isNull(result.pathname) || !isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

function isString(arg) {
  return typeof arg === "string";
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isNull(arg) {
  return arg === null;
}
function isNullOrUndefined(arg) {
  return  arg == null;
}

},{"punycode":10,"querystring":13}]},{},[1])(1)
});