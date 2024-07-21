import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Code Journal',
  themeConfig: {
    outline: 'deep',
    search: {
      provider: 'local',
    },
    lastUpdated: {
      formatOptions: { dateStyle: 'medium' },
    },
  },
  appearance: {
    // @ts-expect-error not fully supported yet
    initialValue: 'light',
  },
  markdown: {
    theme: 'github-dark',
  },
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    [
      'link',
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Fira+Mono:wght@400;500;700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
    ],
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
        async: '',
        src: '//gc.zgo.at/count.js',
      },
    ],
  ],
});
