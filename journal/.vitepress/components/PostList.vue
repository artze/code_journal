<script setup>
import { data } from '../../posts.data.mts';
</script>

<template>
  <div class="post-list__container">
    <!-- TODO -->
    <!-- <h1 v-if="tagTitle">{{ tagTitle }}</h1> -->
    <template v-for="post in posts">
      <a :href="post.url" class="post-list-item__link">
        <div class="post-list-item__container">
          <h3>{{ post.frontmatter.title }}</h3>
          <p>{{ post.frontmatter.description }}</p>
        </div>
      </a>
    </template>
  </div>
</template>

<script>
export default {
  computed: {
    posts() {
      // TODO
      // const tag = this.$route.hash ? this.$route.hash.slice(1) : null;
      // if (tag) {
      //   return this.$site.pages
      //     .filter((page) => /^\/posts\/./.test(page.path))
      //     .filter((page) => page.frontmatter.tags.includes(tag))
      //     .sort((a, b) => b.frontmatter.timestamp - a.frontmatter.timestamp);
      // }
      return data.sort(
        (a, b) => b.frontmatter.timestamp - a.frontmatter.timestamp
      );
    },
    // TODO
    // tagTitle() {
    //   return this.$route.hash;
    // }
  },
};
</script>

<style scoped>
.post-list__container {
  margin: auto;
  max-width: 740px;
}

a.post-list-item__link {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.post-list-item__container {
  border: 1px solid var(--vp-c-border);
  margin: 1em 0;
  padding: 0 1em;
}

.post-list-item__container:hover {
  border-color: var(--vp-c-brand-1);
}

.post-list-item__container > p {
  font-weight: 300;
}

.post-list-item__container > h3 {
  font-weight: 500;
}
</style>
