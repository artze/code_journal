<template>
  <div>
    <p v-for="tag in tags" :key="tag">#{{ tag }}</p>
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
