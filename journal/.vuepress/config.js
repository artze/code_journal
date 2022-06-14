module.exports = {
  title: 'Code Journal',
  themeConfig: {
    nav: [{ text: 'Tags', link: '/tags/' }],
  },
  head: [
    [
      'script',
      {
        'data-goatcounter': 'https://artzecodejournal.goatcounter.com/count',
        async: true,
        src: '//gc.zgo.at/count.js',
      },
    ],
  ],
  plugins: [
    [
      '@vuepress/google-analytics',
      {
        ga: ' UA-106933848-3',
      },
    ],
  ],
};
