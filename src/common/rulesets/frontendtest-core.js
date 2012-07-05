/**
 * FrontendTest Core rules and ruleset
 *
 */

YSLOW.registerRule({
    id: 'ftpngsnotgifs',
    name: 'Use PNGs instead of GIFs',
    url: 'http://frontendtest.com/pngs-are-used-instead-of-gifs/',
    info: 'PNG image format was created to improve upon and replace GIF images; they compress better in most cases. Additionally, there are patent issues around using GIFs.',

    config: {
         when: 'ever'
    },

    lint: function(doc, components, config) {
        return {
            score: 100,
            message: "There are x gifs...",
            components: []
        };
    }
});

 YSLOW.registerRuleset({
     id: 'ftcore',
     name: 'FrontendTest Core',
     rules: {
         'ftpngsnotgifs': {}
     },
     weights: {
         'ftpngsnotgifs': 3
     }
 });

