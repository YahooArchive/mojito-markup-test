/*
 * Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*jslint nomen:true, indent: 4, plusplus: true, browser: true */
/*global YUITest*/

YUI.add('CompositeMojit.view-tests', function (Y) {
    "use strict";

    var suite = new YUITest.TestSuite('CompositeMojit'),
        path = require('path'),
        A = YUITest.Assert,
        MarkupTest = Y.mojito.MarkupTest,
        formatError = MarkupTest.formatError,

        TIMEOUT = 1000;

    suite.add(new YUITest.TestCase({

        name: 'view',

        'test index': function () {

            var test = this,

                items = ['use', 'the', 'force'],

                spec = {
                    options: {
                        root: path.join(__dirname, 'fixtures/app'),
                        appConfig: {
                            resourceStore: {
                                lazyMojits: true,
                                lazyLangs: true
                            }
                        }
                    },
                    type: 'CompositeMojit',
                    action: 'index',
                    context: {
                        lang: 'en-US'
                    }
                };

            MarkupTest.render(spec, function (err, markup, meta, node) {

                if (err) {
                    test.fail(formatError(err));
                }

                test.resume(function () {
                    var str, text, child, intl, em;

                    A.isNull(err, 'error');
                    //we have markup
                    A.areNotEqual('', markup, 'Markup string');
                    //we have meta
                    A.isNotNull(meta, 'Meta object');

                    //we have a node
                    A.isNotUndefined(node, 'Node object');
                    A.isNotNull(node);

                    A.isTrue(node.hasClass('composite'),
                             'Parent <div> has class "composite"');

                    //parent msg
                    str = node.one('p strong');
                    A.isNotUndefined(str, 'Parent <strong> msg');
                    A.isNotNull(str, 'Parent <strong> msg');

                    text = str.getContent();
                    A.areEqual('Parent mojit', text, 'Rendered message, parent <strong>');

                    // first child
                    child = node.one('div.child');
                    A.isNotUndefined(child, 'child <div> node');
                    A.isNotNull(child, 'child <div> node');

                    // second child
                    intl = node.one('div.intl');
                    A.isNotUndefined(child, 'intl <div> node');
                    A.isNotNull(child, 'intl <div> node');

                    em = intl.one('em');
                    A.isNotUndefined(em, 'intl <em> node');
                    A.isNotNull(em, 'intl <em> node');

                    text = em.getContent();
                    A.areEqual('Mojito is working.', text, 'Rendered message <em>');
                });
            });

            test.wait(TIMEOUT);
        },

        'invalid mojit': function () {

            var test = this,

                items = ['use', 'the', 'force'],

                spec = {
                    options: {
                        root: path.join(__dirname, 'fixtures/app'),
                        appConfig: {
                            resourceStore: {
                                lazyMojits: true,
                                lazyLangs: true
                            }
                        }
                    },
                    type: 'InvalidMojit',
                    action: 'index'
                };

            MarkupTest.render(spec, function (err, markup, meta, node) {
                if (err) {
                    A.fail(formatError(err));
                }
                A.isTrue(true);
            });
        },

        _should: {
            fail: {
                'invalid mojit': true
            }
        }

    }));

    YUITest.TestRunner.add(suite);

}, '0.0.1', {requires: [
    'mojito-test',
    'mojito-markup-test'
]});
