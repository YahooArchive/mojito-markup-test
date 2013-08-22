/*
 * Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

YUI.add('SimpleMojit', function (Y, NAME) {
    'use strict';
/**
 * The layout module.
 *
 * @module layout
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
            var p = ac.params.url('p');
            ac.done({
                msg: 'Mojito is working.',
                conf: ac.config.get('foo'),
                p: p
            });
        }

    };

}, '0.0.1', {requires: [
    'mojito-params-addon',
    'mojito-config-addon'
]});
