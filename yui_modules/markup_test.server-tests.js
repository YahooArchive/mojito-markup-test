/*
 * Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*jslint nomen:true, indent: 4, plusplus: true */
/*global YUITest */

YUI.add('mojito-markup-test', function (Y, NAME) {
    'use strict';

    var cwd = process.cwd(),
        express = require('express'),
        Mojito = require('mojito'),
        MAX_CACHED_APPS = 5,
        cachedApps = {},

        createApp = function (options) {

            var key = JSON.stringify(
                    // Stringified options, with sorted properties
                    Y.mix({}, options, true, Y.Object.keys(options).sort())
                ),
                app = cachedApps[key];

            if (app) {
                return app;
            }

            // TODO mojito should accept options.root
            process.chdir(options.root || cwd);

            app = cachedApps[key] = express();

            // We clone the options since mojito actually modifies the object,
            // and if the modified options object is reused, then the generated key would
            // differ. Cloning ensures that the same options object can be used, while
            // maintaining the same cache key.
            Mojito.extend(app, Y.clone(options, true));

            if (Y.Object.size(cachedApps) > MAX_CACHED_APPS) {
                delete cachedApps[Y.Object.keys(cachedApps)[0]];
            }

            // TODO mojito should accept options.root
            process.chdir(cwd);
            return app;
        },

        render = function (spec, callback) {

            var app = spec.app || createApp(spec.options || {}),
                context = spec.context || {},
                store = app.mojito.store,
                dispatcher = store.Y.mojito.Dispatcher.init(app.mojito.store),
                command = {
                    instance: spec,
                    context: context,
                    params: spec.params
                },
                adapter = new Y.mojito.OutputBuffer(null, function (error, data, meta) {
                    if (error) {
                        return callback(error);
                    }

                    var body = Y.one('body'),
                        node;

                    node = Y.Node.create(data);
                    body.get('children').remove();
                    body.append(node);

                    callback(null, data, meta, node);
                });

            Y.mix(adapter, {
                req: spec.req || {},
                res: spec.res || {},
                page: {
                    staticAppConfig: spec.appConfig || store.getStaticAppConfig(),
                    appConfig: spec.appConfig || store.getAppConfig(context),
                    routes: app.getRouteMap()
                }
            });

            dispatcher.dispatch(command, adapter);
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
        'mojito-output-buffer',
        'mojito-dispatcher',
        'jsdom-node'
    ]
});
