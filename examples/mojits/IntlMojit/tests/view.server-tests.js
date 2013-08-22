/*
 * Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*jslint nomen:true, indent: 4, plusplus: true, browser: true */
/*global YUITest*/

YUI.add('IntlMojit.view-tests', function (Y) {
    'use strict';

    var suite = new YUITest.TestSuite('IntlMojit'),
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
                    type: 'IntlMojit',

                    //action to test
                    action: 'index'
                };

            MarkupTest.render(spec, function (err, markup, meta, node) {

                if (err) {
                    test.fail(formatError(err));
                }

                //rendering done, resume paused test and verify
                test.resume(function () {
                    var str, em, text;

                    A.isNull(err);
                    //we have markup
                    A.areNotEqual('', markup, 'Markup');
                    //we have meta
                    A.isNotNull(meta, 'Meta');

                    //we have a node
                    A.isNotUndefined(node, 'Parent <div> node');
                    A.isNotNull(node, 'Parent <div> node');

                    A.isTrue(node.hasClass('intl'), 'Parent <div> has class "intl"');

                    str = node.one('strong');
                    A.isNotUndefined(str, '<strong> node');
                    A.isNotNull(str, '<strong> node');

                    em = node.one('em');
                    A.isNotUndefined(em, '<em> node');
                    A.isNotNull(em, '<em> node');

                    text = em.getContent();
                    A.areEqual('Mojito is working.', text, 'Rendered message <em>');
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
    'IntlMojit'
]});
