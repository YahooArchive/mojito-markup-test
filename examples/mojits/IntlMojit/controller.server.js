/*
 * Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

YUI.add('IntlMojit', function (Y, NAME) {
    'use strict';
/**
 * The IntlMojit module.
 *
 * @module IntlMojit
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
            ac.done({
                msg: ac.intl.lang('MSG')
            });
        }

    };

}, '0.0.1', {requires: [
    'mojito-intl-addon'
]});
