/**
 * FrontendTest Core rules and ruleset
 *
 */

/**
 * ft_pngsnotgifs:
 *
 * for any gif images that would be better compressed as pngs, subtract x * 3 from score of 90. (a single offender merits a "B" with this test)
 * gifs must be a significant size (> 512 bytes) to bother about pointing them out
 */

YSLOW.registerRule({
    id: 'ft_pngsnotgifs',
    name: 'Serve PNGs instead of GIFs',
    url: 'http://frontendtest.com/pngs-are-used-instead-of-gifs/',
    info: 'PNG image format was created to improve upon and replace GIF images; they compress better in most cases. Additionally, there are patent issues around using GIFs.',
    category: ['images'],

    config: {
        points: 3
    },

    lint: function (doc, cset, config) {
        var i, prop, score,
            offenders = [],
            comps = cset.getComponentsByType('image');
		
        for (i = 0; i < comps.length; i += 1) {
            if (typeof comps[i].url !== 'undefined' && comps[i].url.match(/\.gif$/) != null) {	
                if(comps[i].size !== 'undefined' && comps[i].size > 512 ) {
					offenders.push(comps[i]);
				}
            }
        }

        score = 90 - offenders.length * parseInt(config.points, 10);

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

 YSLOW.registerRuleset({
     id: 'ftcore',
     name: 'FrontendTest Core',
     rules: {
         'ft_pngsnotgifs': {}
     },
     weights: {
         'ft_pngsnotgifs': 3
     }
 });