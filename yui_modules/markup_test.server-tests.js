/*
 * Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*jslint nomen:true, indent: 4, plusplus: true */
/*global YUITest */

YUI.add('mojito-markup-test', function (Y, NAME) {
    'use strict';

    var pathlib = require('path'),
        rs = require('mojito/lib/store'),
        cwd = process.cwd(),

        utils,
        store,

        O = Y.Object,
        A = Y.Array,

        CORE_YUI_MODULES = ['get', 'features', 'intl-base', 'mojito'],
        DEFAULT_LANG = 'en-US',
        DEFAULT_ENV = 'server',

        Dispatcher = Y.mojito.Dispatcher,

        /**
         * Mock logger
         */
        logger = {
            log: Y.bind(Y.log, Y)
        },

        /**
         * Mock base instance config
         */
        baseSpec = {
            req: {},
            res: {},
            headers: {},
            appConfig: {}
        },

        fullMerge = function (receiver, supplier) {
            Y.mix(receiver, supplier, false, null, 0, true);
        },

        foo = 1,

        preloadStore = function (cfg) {
            if (!store || !cfg.reuse) {
                store = rs.createStore(cfg);
                store._staticDetails = {};
                store._appY = Y;
                store.preload();
            }
        },

        configureYUI = function () {
            var modules,
                load,
                lang;

            modules = store.yui.getModulesConfig('server', false);
            Y.applyConfig(modules);

            load = Object.keys(modules.modules);

            // NOTE:  Not all of these module names are guaranteed to be valid,
            // but the loader tolerates them anyways.
            for (lang in store.yui.langs) {
                if (store.yui.langs.hasOwnProperty(lang) && lang) {
                    load.push('lang/datatype-date-format_' + lang);
                }
            }

            // attaching all modules available for this application for the server side
            Y.applyConfig({ useSync: true });
            Y.use.apply(Y, load);
            Y.applyConfig({ useSync: false });
        },

        isMojitDefined = function (env, type) {
            var found = Y.Array.find(store.listAllMojits(env), function (name) {
                return name === type;
            });
            return !Y.Lang.isNull(found);
        },

        getMojitTypeDetails = function (env, ctx, type, callback) {
            var mojitType;
            try {
                mojitType = store.getMojitTypeDetails(env, ctx, type);
            } catch (e) {
                return callback(e);
            }
            callback(null, mojitType);
        },

        render = function (spec, callback) {

            var env = spec.env || DEFAULT_ENV,
                root = spec.root || cwd,
                ctx = spec.context || {},
                type = spec.type,
                appConfig = spec.appConfig || {},
                viewSpec;

            preloadStore({
                root: root,
                context: ctx,
                appConfig: appConfig,
                reuse: spec.reuseStore
            });

            if (!isMojitDefined(env, type)) {
                callback(new Error(
                    Y.Lang.sub('Mojit {type} is not defined.', {type: type})
                ));
                return;
            }

            configureYUI();

            getMojitTypeDetails(env, ctx, type, function (err, instance) {

                if (err) {
                    callback(err);
                    return;
                }

                //configure spec
                viewSpec = Y.merge(baseSpec, instance, spec);

                // dispatcher instantiation
                var dispatcher = Dispatcher.init(store),

                    markup = '',
                    finalMeta = {},

                    append = function (data, meta) {
                        markup += data;
                        fullMerge(finalMeta, meta);
                    },

                    //we get data through this
                    outputAdapter = {
                        /**
                         * Mock request data
                         */
                        req: viewSpec.req,
                        res: viewSpec.res,
                        headers: viewSpec.headers,

                        flush: function (data, meta) {
                            append(data, meta);
                        },

                        /**
                         * Reset doc, build a node with markup and attach it
                         * to Y.Browser.document.body
                         */
                        done: function (data, meta) {
                            var body = Y.one('body'),
                                node;
                            //merge view data/meta
                            append(data, meta);

                            node = Y.Node.create(markup);
                            body.get('children').remove();
                            body.append(node);

                            callback(null, markup, finalMeta, node);
                        },

                        error: function (err) {
                            callback(err);
                        },

                        page: {
                            appConfig: appConfig,
                            staticAppConfig: appConfig
                        }
                    },

                    /**
                     * Mock command
                     */
                    command = {
                        instance: viewSpec,
                        action: spec.action,
                        context: {
                            lang: spec.lang || DEFAULT_LANG
                        },
                        params: spec.params
                    };

                //dispatch mojit
                dispatcher.dispatch(command, outputAdapter);
            });
        },

        formatError = function (err) {
            var msg;
            if (err.stack) {
                msg = err.stack.toString();
            } else {
                msg = err.toString();
            }
            return msg;
        };

    Y.namespace('mojito').MarkupTest = {
        render: render,
        formatError: formatError
    };

}, '0.0.1', {
    requires: [
        'mojito-dispatcher',
        'jsdom-node'
    ]
});
