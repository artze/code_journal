module.exports = {
  title: 'Code Journal',
  themeConfig: {
    nav: [{ text: 'Tags', link: '/tags/' }],
  },
  head: [
    [
      'script',
      {},
      `
        // Record 'hits' at any changes to URL path
        //
        // This is needed because subsequent navigation in the site
        // does not trigger a fresh load of HTML document and will
        // be missed in goatcounter's default setup.
        //
        // The default setup only detects 'hits' when there is
        // a fresh HTML document load.
        var oldHref = document.location.href;

        window.onload = function () {
          var bodyList = document.querySelector('body');

          var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
              if (oldHref != document.location.href) {
                oldHref = document.location.href;
                window.goatcounter.count({
                  path: location.pathname
                });
              }
            });
          });

          var config = {
            childList: true,
            subtree: true
          };

          observer.observe(bodyList, config);
        }; 
      `,
    ],
    [
      'script',
      {
        'data-goatcounter': 'https://artzecodejournal.goatcounter.com/count',
        async: true,
        src: '//gc.zgo.at/count.js',
      },
    ],
  ],
  plugins: [['vuepress-plugin-seo', {}]],
};
