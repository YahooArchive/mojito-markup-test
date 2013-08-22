/*
 * Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*jslint nomen:true, indent: 4, plusplus: true, browser: true */
/*global YUITest*/

YUI.add('SimpleMojit.controller-tests', function (Y) {
    'use strict';

    var suite = new YUITest.TestSuite('SimpleMojit'),
        controller = null,
        A = YUITest.Assert,
        Value = YUITest.Mock.Value;


    suite.add(new YUITest.TestCase({

        name: 'controller',

        setUp: function () {
            controller = Y.mojito.controllers.SimpleMojit;
        },
        tearDown: function () {
            controller = null;
        },

        'test index': function () {
            var ac, query = 'flowers', conf = 'foo';

            A.isNotNull(controller);
            A.isFunction(controller.index);

            ac = new Y.mojito.MockActionContext({
                addons: ['params', 'assets', 'config']
            });

            ac.expect({
                method: 'done',
                args: [Value.Object],
                run: function (data) {
                    A.areEqual('Mojito is working.', data.msg);
                    A.areEqual(query, data.p);
                    A.areEqual(conf, data.conf);
                }
            });

            ac.params.expect({
                method: 'url',
                callCount: 1,
                args: [Value.String],
                returns: query
            });

            ac.config.expect({
                method: 'get',
                callCount: 1,
                args: [Value.String],
                returns: conf
            });

            controller.index(ac);
            ac.verify();

        }

    }));

    YUITest.TestRunner.add(suite);

}, '0.0.1', {requires: [
    'mojito-test',
    'SimpleMojit'
]});
