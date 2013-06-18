/**
 * Additional rules and ruleset to be considered for addition to YSlow
 *
 */

/*
YSLOW.registerRule({
    id: 'xtemplate',
    url: 'http://developer.yahoo.com/performance/rules.html#csslink',
    category: ['css'],
    info: 'hey',
    config: {
        points: 2
    },

    lint: function(doc, components, config) {
        return {
            score: 100,
            message: "Did you just say never?",
            components: []
        };
    }
});
*/

/**
 * xpngsnotgifs:
 *
 * for any gif images that would be better compressed as pngs, subtract x * 3 from score of 90. (a single offender merits a "B" with this test)
 * gifs must be a significant size (> 512 bytes) to bother about pointing them out
 */

YSLOW.registerRule({
    id: 'xpngsnotgifs',
    name: 'Serve PNGs instead of GIFs',
    url: 'http://frontendtest.com/pngs-are-used-instead-of-gifs/',
    info: 'The PNG image format was created to improve upon and replace GIF images; they compress better in most cases. Additionally, there are patent issues around using GIFs.',
    category: ['images'],

    config: {
        points: 3
    },

    lint: function (doc, cset, config) {
        var i, prop, score, score_shift,
            offenders = [],
            comps = cset.getComponentsByType('image');
		
        for (i = 0; i < comps.length; i += 1) {
            if (typeof comps[i].url !== 'undefined' && comps[i].url.match(/\.gif$/) != null) {	
				//broken gifs will not pass this test -- they will have a smaller file size than 512.
                if(comps[i].size !== 'undefined' && comps[i].size > 512 ) {
					offenders.push(comps[i]);
				}
            }
        }

        score = 100 - offenders.length * parseInt(config.points, 10);

        return {
            score: score,
            message: (offenders.length > 0) ? YSLOW.util.plural(
                '%num% GIF%s% should be converted to PNG%s% for file size savings',
                offenders.length
            ) : '',
            components: offenders
        };
    }
});

/**
 * xhtml5doctype:
 *
 * it's either true or not. If not, give them a meh score like C.
 * THIS TEST IS A HACK AND IT NEEDS TO BE RE-WRITTEN. I NEED TO FIGURE OUT HOW TO GET THE DOCTYPE FROM THE ENVIRONMENT
 */

YSLOW.registerRule({
    id: 'xhtml5doctype',
    name: 'Use the HTML5 doctype',
    url: 'http://frontendtest.com/site-is-html5-the-evolving-standard/',
    info: 'If this is a site under development and not a retired page of content, you probably want to make it an HTML5 document. This transition should be as easy as changing the doctype to &lt;!doctype html&gt;. And if you make this change, you may also make the character encoding meta tag shorter. What had looked something like &lt;meta http-equiv="Content-Type" content="text/html;charset=utf-8" /&gt; replaced with &lt;meta charset="utf-8"&gt;.',
    category: ['content'],
    config: {
        //points: 3
    },

    lint: function (doc, cset, config) {
        var regex, stripped_data, score = 100, data, stripped_data;

		data = cset.doc_comp.body;
		
		stripped_data = data.replace(/<!--.*-->/g, "").substring(0,1000).toLowerCase().trim();

        if(!stripped_data.match(/^<!doctype html>/)) score = 75;		

        return {
            score: score,
            message: (score != 100) ? 'Site should be updated to HTML5, the evolving standard' : ''
        };
    }
 });


/**
 * xdoctypenotfirst:
 *
 * it's either true or not. If not...
 * THIS TEST IS A HACK AND IT NEEDS TO BE RE-WRITTEN. I NEED TO FIGURE OUT HOW TO GET THE DOCTYPE FROM THE ENVIRONMENT
 */

YSLOW.registerRule({
     id: 'xdoctypefirst',
    name: 'Put doctype declaration first',
    //url: '',
    info: 'The doctype declaration\'s purpose is to tell browsers (and validation tools) what type of HTML document it is receiving. If you do not provide a doctype, or the doctype is not the first instruction in your document, browsers will render in <a href="http://en.wikipedia.org/wiki/Quirks_mode">quirks mode</a>. If you don\'t want to think about what that means, or maintain a site in quirks mode, we recommend using the HTML5 doctype: &lt;!DOCTYPE html&gt; This doctype will render pages in "standards mode" for most browsers, and "almost standards mode" for older versions of Internet Explorer (6 and 7).',
    category: ['content'],
    config: {
        //points: 3
    },

    lint: function (doc, cset, config) {
        var regex, stripped_data, score = 100, data, stripped_data;

		data = cset.doc_comp.body;

		stripped_data = data.replace(/<!--.*-->/g, "").substring(0,1000).toLowerCase().trim();

        if(!stripped_data.match(/^<!doctype /)) score = 68;		

        return {
            score: score,
            message: (score != 100) ? 'A doctype declaration should appear first in the HTML document' : ''
        };
    }
 });

YSLOW.registerRuleset({
    id: 'yrulesdev',
    name: 'Rules in development',
    rules: {
        'xpngsnotgifs': {},
        'xhtml5doctype': {},
        'xdoctypefirst': {}
    },
    weights: {
        'xpngsnotgifs': 3,
        'xhtml5doctype': 6,
        'xdoctypefirst': 8
    }
});

