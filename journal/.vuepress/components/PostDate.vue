<template>
  <div class="post-date">Posted on: {{ postDate }}</div>
</template>

<script>
export default {
  computed: {
    postDate() {
      return new Date(this.$page.frontmatter.timestamp).toUTCString();
    }
  }
};
</script>

<style scoped>
.post-date {
  margin-top: 4em;
  font-weight: 300;
}
</style>
