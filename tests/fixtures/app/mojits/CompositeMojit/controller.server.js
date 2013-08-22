/*
 * Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

YUI.add('CompositeMojit', function (Y, NAME) {
    'use strict';
/**
 * The CompositeMojit module.
 *
 * @module CompositeMojit
 */

    /**
     * Constructor for the Controller class.
     *
     * @class Controller
     * @constructor
     */
    Y.mojito.controllers[NAME] = {

        /**
         * Method corresponding to the 'index' action.
         *
         * @param ac {Object} The ActionContext that provides access
         *        to the Mojito API.
         */
        index: function (ac) {

            var config = {
                children: {
                    "child_mojit": {
                        type: "ChildMojit",
                        params: {
                            body: {
                                items: ['use', 'the', 'force']
                            }
                        }
                    },
                    "intl_mojit": {
                        type: "IntlMojit"
                    }
                }
            };

            ac.composite.execute(config, function (data, meta) {
                Y.mix(data, {
                    msg: 'Parent mojit'
                });
                ac.done(data, meta);
            });
        }

    };

}, '0.0.1', {requires: [
    'mojito-composite-addon'
]});
