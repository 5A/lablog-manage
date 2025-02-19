<template>
  <a-page-header
    class="dashboard-page-header"
    style="border: 1px solid rgb(235, 237, 240)"
    title="Dashboard"
    sub-title="Overview"
  >
    <template #extra>
      <a-button key="1" type="primary" @click="lablogDataStore.fetchLablogData">
        <SyncOutlined />
        Sync
      </a-button>
    </template>
    <a-descriptions size="small" :column="{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }">
      <a-descriptions-item label="Total Posts">
        {{ number_of_posts }}
      </a-descriptions-item>
      <a-descriptions-item label="Total Comments">
        {{ number_of_comments }}
      </a-descriptions-item>
    </a-descriptions>
  </a-page-header>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { SyncOutlined } from '@ant-design/icons-vue'
import { useLablogDataStore } from '@/store/management'

const lablogDataStore = useLablogDataStore()

const number_of_posts = computed(() => {
  return Object.keys(lablogDataStore.lablogDataState.posts).length
})

const number_of_comments = computed(() => {
  return Object.keys(lablogDataStore.lablogDataState.comments).length
})

onMounted(() => {
  // When user loads this page, automatically refresh data
  lablogDataStore.fetchLablogData()
})
</script>

<style scoped>
.dashboard-page-header :deep(tr:last-child td) {
  padding-bottom: 0;
}
</style>
