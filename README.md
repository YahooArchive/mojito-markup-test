# Markup test utility

## Overview

The markup layout test utility will render the mojit view with mock data and expose
the resulting markup to be validated using YUI Node module.

Markup tests written with this utility will be run as regular mojito unit tests
using `mojito test` command

## Usage

Three easy steps:
 1. Require `mojito-markup-test`.
 2. Add a mojit `spec`.
 3. Render view and validate markup.

### Mojit spec

You must specify the mojit and view to render, along with the mock data to use.

You can mock any data, including parameters, configuration, request and headers.
```javascript
//describe the mojit to render
spec = {
    //mojit type (dir name)
    type: 'SimpleMojit',

    //action to test
    action: 'index',

    //mojit params
    params: {
        url: {
            p: 'Really!'
        }
    },

    //mojit config (to use with ac.config.get() )
    appConfig: {
        foo: 'bar'
    },

    //mock request/response and headers data
    req: {
        p: 'flowers'
    },
    res: {},
    headers: {
         'Content-Type': 'text/html'
    }
};
```

### Rendering views

Once you have the mojit spec, you can render the view invoking the utility's `render` method.

#### **render** (spec, callback)

Receives the mojit spec and a callback function which will get the error (if any),
the rendered markup string, the mojit view meta object and the node (YUI Node)
for the resulting markup.
```javascript
MarkupTest.render(spec, function (err, markup, meta, node) {

    //rendering done, resume paused test and verify
    test.resume(function () {
        var div, em, i, a, text;

        A.isNull(err);
        //we have markup
        A.areNotEqual('', markup, 'Markup');
        //we have meta
        A.isNotNull(meta, 'Meta');

        //we have a node
        A.isNotUndefined(node, 'Parent node');
        A.isNotNull(node, 'Parent node');

        //use YUI Node methods to access rendered elements
        div = node.one('.msg');
        A.isNotUndefined(div, 'msg <div>');
        A.isNotNull(div, 'msg <div>');
    });
```

### Full example

```javascript
YUI.add('CompositeMojit_view-tests', function(Y) {

    var suite = new YUITest.TestSuite('CompositeMojit'),
        A = YUITest.Assert,
        MarkupTest = Y.mojito.MarkupTest,

        //Timeout for async testing
        TIMEOUT = 1000;

    suite.add(new YUITest.TestCase({

        name: 'view',

        'test index': function () {

            var test = this,

                //describe the mojit to render
                spec = {
                    //mojit type (dir name)
                    type: 'CompositeMojit',

                    //action to test
                    action: 'index',

                    //mojit params
                    params: {
                        url: {
                            p: 'Really!'
                        }
                    },

                    //mojit config (to use with ac.config.get() )
                    config: {
                        foo: 'bar'
                    },

                    //app level config (to use with ac.app)
                    appConfig: {
                        some: 'config param'
                    },

                    // We need to define the child mojits,
                    // modules should be in the requires: [] as well to be loaded (see below)
                    children: {
                        'child_mojit': {
                            type: 'ChildMojit'
                        }
                    }
                };

            MarkupTest.render(spec, function (err, markup, meta, node) {

                //rendering done, resume paused test and verify
                test.resume(function () {
                    var div, em, i, a, text;

                    A.isNull(err);
                    //we have markup
                    A.areNotEqual('', markup, 'Markup');
                    //we have meta
                    A.isNotNull(meta, 'Meta');

                    //we have a node
                    A.isNotUndefined(node, 'Parent node');
                    A.isNotNull(node, 'Parent node');

                    div = node.one('.msg');
                    A.isNotUndefined(div, 'msg <div>');
                    A.isNotNull(div, 'msg <div>');

                    em = div.one('em');
                    A.isNotUndefined(em, '<em>');
                    A.isNotNull(em, '<em>');

                    text = em.getContent();
                    A.areEqual('Mojito is working.', text, 'Rendered message <em>');

                    i = div.one('i');
                    A.isNotUndefined(i, '<i>');
                    A.isNotNull(i, '<i>');

                    text = i.getContent();
                    A.areEqual(spec.params.url.p, text, 'Rendered message <i>');

                    a = div.one('a');
                    A.isNotUndefined(a, '<a>');
                    A.isNotNull(a, '<a>');

                    text = a.getContent();
                    A.areEqual(spec.config.foo, text, 'Rendered message <a>');
                });
            });

            //we need this for async tests, wait till rendering done or timeout
            test.wait(TIMEOUT);
        }

    }));

    YUITest.TestRunner.add(suite);

}, '0.0.1', {requires: [
    'mojito-test',

    //test rendering utility
    'mojito-markup-test'

    //parent mojit
    'CompositeMojit',

    //child mojit
    'ChildMojit'
]});
```

See more [examples](examples).
