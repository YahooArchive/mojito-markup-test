/*
 * Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*jslint nomen:true, indent: 4, plusplus: true, browser: true */
/*global YUITest*/

YUI.add('ChildMojit.controller-tests', function (Y) {
    'use strict';

    var suite = new YUITest.TestSuite('ChildMojit'),
        controller = null,
        A = YUITest.Assert,
        AA = YUITest.ArrayAssert,
        Value = YUITest.Mock.Value;

    suite.add(new YUITest.TestCase({

        name: 'controller',

        setUp: function () {
            controller = Y.mojito.controllers.ChildMojit;
        },
        tearDown: function () {
            controller = null;
        },

        'test index': function () {
            var ac,
                msg = 'Child mojit',
                items = ['use', 'the', 'force'];

            A.isNotNull(controller);
            A.isFunction(controller.index);

            ac = new Y.mojito.MockActionContext({
                addons: ['params']
            });

            ac.expect({
                method: 'done',
                args: [Value.Object],
                run: function (data) {
                    var values = Y.Array.map(data.items, function (item) {
                        return item.text;
                    });
                    A.areEqual(msg, data.msg);
                    AA.itemsAreSame(items, values);
                }
            });

            ac.params.expect({
                method: 'body',
                callCount: 1,
                args: [Value.String],
                returns: items
            });

            controller.index(ac);
            ac.verify();
        }

    }));

    YUITest.TestRunner.add(suite);

}, '0.0.1', {requires: [
    'mojito-test',
    'ChildMojit',
    'array-extras'
]});
