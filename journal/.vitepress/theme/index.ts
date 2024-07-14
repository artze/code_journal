import { h } from 'vue';
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme-without-fonts';
import './style.css';
import PostList from '../components/PostList.vue';

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {});
  },
  enhanceApp({ app, router, siteData }) {
    app.component('PostList', PostList);
  },
} satisfies Theme;
