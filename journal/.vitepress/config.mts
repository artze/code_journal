import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Code Journal',
  themeConfig: {
    outline: 'deep',
    search: {
      provider: 'local',
    },
  },
});
