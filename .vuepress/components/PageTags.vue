<template>
  <div class="page-tags__container">
    Tags:
    <router-link v-for="tag in tags" :key="tag" :to="`/tag/#${tag}`">
      <div class="tag__badge">
        {{ tag }}
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  computed: {
    tags() {
      return this.$page.frontmatter.tags;
    }
  }
};
</script>

<style scoped>
.page-tags__container {
  margin-top: 2.5em;
}

.tag__badge {
  background-color: #3eaf7c;
  border-radius: 2px;
  color: #fff;
  display: inline;
  font-size: 0.9em;
  font-weight: 300;
  margin: 0 0.5em;
  padding: 0.3em 0.5em;
}
</style>
