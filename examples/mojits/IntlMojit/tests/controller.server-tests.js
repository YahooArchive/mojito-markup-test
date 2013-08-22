/*
 * Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*jslint nomen: true, indent: 4, plusplus: true, browser: true */
/*global YUITest*/

YUI.add('yahoo.mojits.search.intl_mojit.controller-tests', function (Y) {
    'use strict';

    var suite = new YUITest.TestSuite('IntlMojit'),
        controller = null,
        A = YUITest.Assert,
        Value = YUITest.Mock.Value;

    suite.add(new YUITest.TestCase({

        name: 'controller',

        setUp: function () {
            controller = Y.mojito.controllers.IntlMojit;
        },
        tearDown: function () {
            controller = null;
        },

        'test index': function () {

            var ac, msg = 'Mojito is working.';

            A.isNotNull(controller);
            A.isFunction(controller.index);

            ac = new Y.mojito.MockActionContext({
                addons: ['intl']
            });

            ac.expect({
                method: 'done',
                args: [Value.Object],
                run: function (data) {
                    A.areEqual(msg, data.msg);
                }
            });

            ac.intl.expect({
                method: 'lang',
                callCount: 1,
                args: [Value.String],
                returns: msg
            });

            controller.index(ac);
            ac.verify();
        }

    }));

    YUITest.TestRunner.add(suite);

}, '0.0.1', {requires: [
    'mojito-test',
    'IntlMojit'
]});
