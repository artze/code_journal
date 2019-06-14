<template>
  <div>
    <router-link v-for="tag in tags" :key="tag" :to="`/tag/#${tag}`">
      <p>#&nbsp;{{ tag }}</p>
    </router-link>
  </div>
</template>

<script>
export default {
  computed: {
    tags() {
      let tags = [];
      this.$site.pages
        .filter((page) => page.frontmatter.tags)
        .forEach((page) => {
          tags = tags.concat(page.frontmatter.tags);
        });
      tags = [...new Set(tags)];
      tags = tags.sort();
      return tags;
    }
  }
};
</script>
