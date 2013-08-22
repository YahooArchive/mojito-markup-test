/*
 * Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*jslint nomen:true, indent: 4, plusplus: true, browser: true */

/*
 * Based on: http://yuilibrary.com/yui/docs/yui/nodejs-dom.html
 */
YUI.add('jsdom-node', function (Y) {
    'use strict';

    var jsdom = require('jsdom'),
        dom,
        doc,
        win;

    jsdom.defaultDocumentFeatures = {
        FetchExternalResources: false,
        ProcessExternalResources: false,
        MutationEvents: false,
        QuerySelector: false
    };

    dom = jsdom.defaultLevel;

    // Hack in focus and blur methods so they don't fail
    dom.Element.prototype.blur = function () {};
    dom.Element.prototype.focus = function () {};

    // Create the document and window
    doc = jsdom.jsdom('<html><head><title></title></head><body></body></html>');
    win = doc.createWindow();

    Y.applyConfig({
        doc: doc,
        win: win,
        useSync: true
    });

    // The module "event-base-ie" will get loaded, at least with jsdom@0.2.1,
    // and that module refers to YUI.doc, so the following is necessary.
    // Without it, an app that declares yahoo-utils-markup-test as a dependency
    // (so it can successfully execute client-side unit tests) will not be able
    // to start.

    YUI.applyConfig({
        doc: doc,
        win: win
    });

    Y.use('node', 'node-event-simulate', 'selector-css3');

}, '0.0.1');
