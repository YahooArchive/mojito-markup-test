/*
 * Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*jslint nomen:true, indent: 4, plusplus: true, browser: true */
/*global YUITest*/

YUI.add('CompositeMojit.controller-tests', function (Y) {
    'use strict';

    var suite = new YUITest.TestSuite('CompositeMojit'),
        controller = null,
        A = YUITest.Assert,
        Value = YUITest.Mock.Value;

    suite.add(new YUITest.TestCase({

        name: 'controller',

        setUp: function () {
            controller = Y.mojito.controllers.CompositeMojit;
        },
        tearDown: function () {
            controller = null;
        },

        'test index': function () {
            var ac,
                msg = 'Parent mojit',
                items = ['use', 'the', 'force'],
                childrenData = {
                    'child_mojit': '<i>some markup</i>'
                },
                meta = {};

            A.isNotNull(controller);
            A.isFunction(controller.index);

            ac = new Y.mojito.MockActionContext({
                addons: ['params', 'composite']
            });

            ac.expect({
                method: 'done',
                args: [Value.Object, Value.Object],
                run: function (data, meta) {
                    A.isObject(data, 'Mojit data');
                    A.areEqual(msg, data.msg, 'Parent msg');
                    A.isString(data.child_mojit);
                }
            });

            ac.composite.expect({
                method: 'execute',
                args: [Value.Object, Value.Function],
                run: function (config, callback) {
                    callback(childrenData, meta);
                }
            });

            controller.index(ac);
            ac.verify();
        }

    }));

    YUITest.TestRunner.add(suite);

}, '0.0.1', {requires: [
    'mojito-test',
    'CompositeMojit'
]});
