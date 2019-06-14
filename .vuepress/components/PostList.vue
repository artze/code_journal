<template>
  <div>
    <router-link
      v-for="post in posts"
      :key="post.key"
      :to="post.path"
      class="post-list-item__link"
    >
      <div class="post-list-item__container">
        <h3>{{ post.frontmatter.title }}</h3>
        <p>{{ post.frontmatter.description }}</p>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  computed: {
    posts() {
      return this.$site.pages.filter((page) => /^\/posts\/./.test(page.path));
    }
  }
};
</script>

<style scoped>
a.post-list-item__link {
  color: #2c3e50;
}

a.post-list-item__link:hover {
  text-decoration: none;
}

.post-list-item__container {
  border: 1px solid lightgray;
  margin: 1em 0;
  padding: 0 1em;
}

.post-list-item__container:hover {
  border-color: #3eaf7c;
}

.post-list-item__container > p {
  font-weight: 300;
}

.post-list-item__container > h3 {
  font-weight: 500;
}
</style>
