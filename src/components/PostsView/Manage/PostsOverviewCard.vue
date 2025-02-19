<template>
  <a-card title="Posts Overview">
    <a-collapse v-model:activeKey="activeKey">
      <a-collapse-panel
        v-for="(item, uuid) in lablogDataStore.lablogDataState.posts"
        :key="item.created_timestamp"
        :header="item.title"
      >
        <b>Title:</b>
        <p>{{ item.title }}</p>
        <b>Post ID:</b>
        <p>{{ uuid }}</p>
        <b>Time:</b>
        <p>{{ new Date(item.created_timestamp * 1000).toLocaleString() }}</p>
        <b>Abstract:</b>
        <p>{{ item.abstract }}</p>
        <b>Catagory:</b>
        <p>{{ item.catagory }}</p>
        <b>Tags:</b>
        <p>{{ item.tags }}</p>
        <b>Link:</b>
        <p>{{ item.link }}</p>
      </a-collapse-panel>
    </a-collapse>
  </a-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLablogDataStore } from '@/store/management'

const lablogDataStore = useLablogDataStore()

const activeKey = ref(['1'])
</script>
