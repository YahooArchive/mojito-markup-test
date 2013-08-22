/*
 * Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*jslint nomen:true, indent: 4, plusplus: true, browser: true */
/*global YUITest*/

YUI.add('SimpleMojit.view-tests', function (Y) {
    'use strict';

    var suite = new YUITest.TestSuite('SimpleMojit'),
        A = YUITest.Assert,
        MarkupTest = Y.mojito.MarkupTest,
        formatError = MarkupTest.formatError,

        //Timeout for async testing
        TIMEOUT = 1000;

    suite.add(new YUITest.TestCase({

        name: 'view',

        'test index': function () {

            var test = this,

                //describe the mojit to render
                spec = {
                    //mojit type (dir name)
                    type: 'SimpleMojit',

                    //action to test
                    action: 'index',

                    //mojit params
                    params: {
                        url: {
                            p: 'Really!'
                        }
                    },

                    //mojit config (to use with ac.config.get() )
                    config: {
                        foo: 'bar'
                    }
                };

            MarkupTest.render(spec, function (err, markup, meta, node) {

                if (err) {
                    test.fail(formatError(err));
                }

                //rendering done, resume paused test and verify
                test.resume(function () {
                    var div, em, i, a, text;

                    A.isNull(err);
                    //we have markup
                    A.areNotEqual('', markup, 'Markup');
                    //we have meta
                    A.isNotNull(meta, 'Meta');

                    //we have a node
                    A.isNotUndefined(node, 'Parent node');
                    A.isNotNull(node, 'Parent node');

                    div = node.one('.msg');
                    A.isNotUndefined(div, 'msg <div>');
                    A.isNotNull(div, 'msg <div>');

                    em = div.one('em');
                    A.isNotUndefined(em, '<em>');
                    A.isNotNull(em, '<em>');

                    text = em.getContent();
                    A.areEqual('Mojito is working.', text, 'Rendered message <em>');

                    i = div.one('i');
                    A.isNotUndefined(i, '<i>');
                    A.isNotNull(i, '<i>');

                    text = i.getContent();
                    A.areEqual(spec.params.url.p, text, 'Rendered message <i>');

                    a = div.one('a');
                    A.isNotUndefined(a, '<a>');
                    A.isNotNull(a, '<a>');

                    text = a.getContent();
                    A.areEqual(spec.config.foo, text, 'Rendered message <a>');
                });
            });

            //we need this for async tests, wait till rendering done or timeout
            test.wait(TIMEOUT);
        }

    }));

    YUITest.TestRunner.add(suite);

}, '0.0.1', {requires: [
    'mojito-test',
    'mojito-markup-test',
    'SimpleMojit'
]});
