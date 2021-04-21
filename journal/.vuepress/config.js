module.exports = {
  title: 'Code Journal',
  themeConfig: {
    nav: [{ text: 'Tags', link: '/tags/' }]
  },
  plugins: [
    [
      '@vuepress/google-analytics',
      {
        ga: ' UA-106933848-3'
      }
    ]
  ]
};
