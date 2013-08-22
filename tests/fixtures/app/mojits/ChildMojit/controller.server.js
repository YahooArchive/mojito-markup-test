/*
 * Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

YUI.add('ChildMojit', function (Y, NAME) {
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
            var items = [];
            Y.Array.each(ac.params.body('items'), function (item) {
                items.push({text: item});
            });
            ac.done({msg: 'Child mojit', items: items});
        }

    };

}, '0.0.1', {requires: [
    'mojito-params-addon'
]});
