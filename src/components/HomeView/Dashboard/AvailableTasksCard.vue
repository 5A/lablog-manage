<template>
  <a-card title="Comments Pending Review">
    <a-table :columns="columns" :data-source="data_source">
      <template #action="{ record }">
        <a-space>
          <a-button type="primary" @click="handleApproveComment(record)">
            <CheckCircleOutlined />
          </a-button>
          <a-button danger @click="handleDeleteComment(record)">
            <DeleteOutlined />
          </a-button>
        </a-space>
      </template>
    </a-table>
  </a-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useLablogDataStore } from '@/store/management'
import { CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
import { callRESTfulAPI } from '@/common/connection'

const lablogDataStore = useLablogDataStore()

const columns = [
  { title: 'Post Title', dataIndex: 'post_title', key: 'post_title' },
  { title: 'Comment Content', dataIndex: 'content', key: 'content' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Contact Address', dataIndex: 'contact_address', key: 'contact_address' },
  { title: 'IP Address', dataIndex: 'ip_address', key: 'ip_address' },
  { title: 'Time', dataIndex: 'created_timestamp', key: 'created_timestamp' },
  {
    title: 'Action',
    key: 'action',
    slots: { customRender: 'action' },
  },
]

interface CommentToReview {
  comment_id: string
  post_id: string
  post_title: string
  content: string
  name: string
  contact_address: string
  ip_address: string
  created_timestamp: string
}

const data_source = computed(() => {
  return Object.keys(lablogDataStore.lablogDataState.comments)
    .filter((comment) => {
      return !lablogDataStore.lablogDataState.comments[comment].display
    })
    .map((comment) => {
      const comment_data = lablogDataStore.lablogDataState.comments[comment]
      const data_item: CommentToReview = {
        comment_id: comment,
        post_id: comment_data.post_id,
        post_title: lablogDataStore.lablogDataState.posts[comment_data.post_id].title,
        content: comment_data.content,
        name: comment_data.name,
        contact_address: comment_data.contact_address,
        ip_address: comment_data.ip_address,
        created_timestamp: dayjs(comment_data.created_timestamp * 1000).format(
          'YYYY-MM-DD HH:mm:ss',
        ),
      }
      return data_item
    })
})

async function handleApproveComment(record: CommentToReview) {
  console.log('Approve Comment', record)
  await callRESTfulAPI(
    `comments`,
    'POST',
    JSON.stringify({
      comment_id: record.comment_id,
      post_id: record.post_id,
      display: true,
    }),
  ).then((response) => {
    if (response?.result == 'success') {
      message.info('Comment approved successfully')
    } else {
      message.error('Failed to approve comment')
    }
  })
  // reload lablog data
  await lablogDataStore.fetchLablogData()
}

async function handleDeleteComment(record: CommentToReview) {
  console.log('Delete Comment', record)
  await callRESTfulAPI(`comments/${record.comment_id}`, 'DELETE').then((response) => {
    if (response?.result == 'success') {
      message.info('Comment deleted successfully')
    } else {
      message.error('Failed to delete comment')
    }
  })
  // reload lablog data
  await lablogDataStore.fetchLablogData()
}
</script>

<style scoped>
th {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #666666;
  background-color: #dedede;
}

td {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #666666;
  background-color: #ffffff;
}
</style>
