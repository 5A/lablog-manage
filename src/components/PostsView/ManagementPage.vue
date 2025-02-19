<template>
  <a-breadcrumb style="margin: 16px 0">
    <a-breadcrumb-item>Posts</a-breadcrumb-item>
    <a-breadcrumb-item>Posts Management</a-breadcrumb-item>
  </a-breadcrumb>
  <ManagementHeader />
  <br />
  <a-layout-content
    :style="{
      background: '#fff',
      padding: '24px',
      margin: 0,
      minHeight: '280px',
    }"
  >
    <PostsOverviewCard />
  </a-layout-content>
</template>

<script lang="ts" setup>
import ManagementHeader from './Manage/ManagementHeader.vue'
import PostsOverviewCard from './Manage/PostsOverviewCard.vue'
</script>

<style scoped></style>
