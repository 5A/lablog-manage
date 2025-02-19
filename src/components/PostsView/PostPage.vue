<template>
  <a-breadcrumb style="margin: 16px 0">
    <a-breadcrumb-item>Posts</a-breadcrumb-item>
    <a-breadcrumb-item>Post Detail</a-breadcrumb-item>
  </a-breadcrumb>
  <a-page-header
    class="post-page-header"
    style="border: 1px solid rgb(235, 237, 240)"
    :title="post_title"
    :sub-title="post_uuid"
  >
    <template #extra>
      <a-button key="1" type="primary" @click="lablogDataStore.fetchLablogData">
        <SyncOutlined />
        Sync
      </a-button>
    </template>
    <a-descriptions size="small" :column="{ xxl: 8, xl: 6, lg: 6, md: 4, sm: 2, xs: 2 }">
      <a-descriptions-item label="Comments"> {{ number_of_comments }} </a-descriptions-item>
    </a-descriptions>
  </a-page-header>
  <a-layout-content
    :style="{
      background: '#fff',
      padding: '24px',
      margin: '24px 0 24px 0',
      minHeight: '280px',
    }"
  >
    <a-card title="Comments">
      <template #extra>
        <a-button type="primary" @click="showAddCommentModal">Add Comment</a-button>
      </template>
      <a-table :columns="columns" :data-source="comments_data_source">
        <template #bodyCell="{ column, record }">
          <span
            v-if="
              column.key !== 'actions' &&
              column.key !== 'created_timestamp' &&
              column.key !== 'display' &&
              column.key !== 'comment_id'
            "
          >
            <template v-if="editingKey === record.comment_id && editingField === column.key">
              <div style="display: flex; align-items: center">
                <a-input v-model:value="editValue" @keyup.enter="saveEdit(record, column.key)" />
                <CheckOutlined
                  @click="saveEdit(record, column.key)"
                  style="margin-left: 8px; cursor: pointer"
                />
                <CloseOutlined @click="cancelEdit" style="margin-left: 8px; cursor: pointer" />
              </div>
            </template>
            <template v-else>
              <span @click="startEdit(record, column.key)" title="Click to edit">
                {{ record[column.key] }}
              </span>
            </template>
          </span>
          <span v-else>
            <template v-if="column.key === 'comment_id'">
              {{ record.comment_id }}
            </template>
            <template v-else-if="column.key === 'display'">
              <a-switch
                v-model:checked="record.display"
                @change="onToggleCommentDisplay(record, column.key)"
              />
            </template>
            <template v-else-if="column.key === 'actions'">
              <a-space>
                <a-button type="primary" @click="startEdit(record, 'content')">
                  <EditOutlined />
                </a-button>
                <a-button danger @click="deleteComment(record.comment_id)">
                  <DeleteOutlined />
                </a-button>
              </a-space>
            </template>
            <template v-else-if="column.key === 'created_timestamp'">
              <template v-if="editingKey === record.comment_id && editingField === column.key">
                <a-date-picker
                  v-model:value="editValue"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
                  @ok="saveEdit(record, column.key)"
                />
                <CheckOutlined
                  @click="saveEdit(record, column.key)"
                  style="margin-left: 8px; cursor: pointer"
                />
                <CloseOutlined @click="cancelEdit" style="margin-left: 8px; cursor: pointer" />
              </template>
              <template v-else>
                <span @click="startEdit(record, column.key)" title="Click to edit">
                  {{ record[column.key] }}
                </span>
              </template>
            </template>
          </span>
        </template>
      </a-table>
    </a-card>
    <a-modal
      v-model:open="isAddCommentModalVisible"
      title="Add Comment"
      @ok="handleAddComment"
      @cancel="handleCancelAddComment"
    >
      <a-form>
        <a-form-item label="Author">
          <a-input v-model:value="newComment.author" />
        </a-form-item>
        <a-form-item label="Content">
          <a-input v-model:value="newComment.content" />
        </a-form-item>
        <a-form-item label="Contact Address">
          <a-input v-model:value="newComment.contact_address" />
        </a-form-item>
        <a-form-item label="IP Address">
          <a-input v-model:value="newComment.ip_address" />
        </a-form-item>
        <a-form-item label="Display">
          <a-switch v-model:checked="newComment.display" />
        </a-form-item>
        <a-form-item label="Created Timestamp">
          <a-date-picker
            v-model:value="newComment.created_timestamp"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-layout-content>
</template>

<script lang="ts" setup>
import { useLablogDataStore } from '@/store/management'
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  CheckOutlined,
  CloseOutlined,
  SyncOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { callRESTfulAPI } from '@/common/connection'

const route = useRoute()
const lablogDataStore = useLablogDataStore()

const post_uuid = ref<string>()

// ======== React to router parameter changes when loading post page

onMounted(() => {
  if (typeof route.params.post_uuid === 'string') {
    post_uuid.value = route.params.post_uuid
  }
})

watch(
  () => route.params.post_uuid,
  (newId, _oldId) => {
    if (typeof newId === 'string') {
      post_uuid.value = newId
    }
  },
)

if (typeof route.params.post_uuid === 'string') {
  post_uuid.value = route.params.post_uuid
}

const current_post = computed(() =>
  post_uuid.value ? lablogDataStore.lablogDataState.posts[post_uuid.value] : null,
)
const post_title = computed(() => (current_post.value ? current_post.value.title : 'Loading...'))

const number_of_comments = computed(() =>
  current_post.value ? current_post.value.comments.length : 0,
)

const columns = [
  {
    title: 'Comment ID',
    dataIndex: 'comment_id',
    key: 'comment_id',
    sorter: (a, b) => a.comment_id.localeCompare(b.comment_id),
  },
  {
    title: 'Author',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Time',
    dataIndex: 'created_timestamp',
    key: 'created_timestamp',
    sorter: (a, b) => new Date(a.created_timestamp) - new Date(b.created_timestamp),
  },
  {
    title: 'Content',
    dataIndex: 'content',
    key: 'content',
    sorter: (a, b) => a.content.localeCompare(b.content),
  },
  {
    title: 'Contact Address',
    dataIndex: 'contact_address',
    key: 'contact_address',
    sorter: (a, b) => a.contact_address.localeCompare(b.contact_address),
  },
  {
    title: 'IP Address',
    dataIndex: 'ip_address',
    key: 'ip_address',
    sorter: (a, b) => a.ip_address.localeCompare(b.ip_address),
  },
  {
    title: 'Display',
    dataIndex: 'display',
    key: 'display',
    sorter: (a, b) => a.display - b.display,
  },
  {
    title: 'Actions',
    key: 'actions',
  },
]

const comments_data_source = computed(() => {
  if (current_post.value) {
    return current_post.value.comments.map((comment) => {
      return {
        comment_id: lablogDataStore.lablogDataState.comments[comment].comment_id,
        name: lablogDataStore.lablogDataState.comments[comment].name,
        created_timestamp: dayjs(
          lablogDataStore.lablogDataState.comments[comment].created_timestamp * 1000,
        ).format('YYYY-MM-DD HH:mm:ss'),
        content: lablogDataStore.lablogDataState.comments[comment].content,
        contact_address: lablogDataStore.lablogDataState.comments[comment].contact_address,
        ip_address: lablogDataStore.lablogDataState.comments[comment].ip_address,
        display: lablogDataStore.lablogDataState.comments[comment].display,
      }
    })
  } else {
    return []
  }
})

const editingKey = ref<string | null>(null)
const editingField = ref<string | null>(null)
const editValue = ref<string>('')

const startEdit = (record, key) => {
  editingKey.value = record.comment_id
  editingField.value = key
  editValue.value = key === 'created_timestamp' ? dayjs(record[key]) : record[key]
}

const onToggleCommentDisplay = async (record, key) => {
  // Implement the logic to toggle the display of the comment
  console.log(`Toggle ${key} for record`, record)
  await callRESTfulAPI(
    `comments`,
    'POST',
    JSON.stringify({
      comment_id: record.comment_id,
      post_id: post_uuid.value,
      [key]: record.display,
    }),
  ).then((response) => {
    if (response?.result == 'success') {
      message.info('Comment display status changed successfully')
    } else {
      message.error('Failed to change comment display status')
    }
  })
  // reload lablog data
  await lablogDataStore.fetchLablogData()
}

const saveEdit = async (record, key) => {
  // Implement the logic to save the edited field
  console.log(`Save ${key} for record`, record, 'with value', editValue.value)
  const value = key === 'created_timestamp' ? editValue.value.unix() : editValue.value
  await callRESTfulAPI(
    `comments`,
    'POST',
    JSON.stringify({
      comment_id: record.comment_id,
      post_id: post_uuid.value,
      [key]: value,
    }),
  ).then((response) => {
    if (response?.result == 'success') {
      message.info('Comment modified successfully')
    } else {
      message.error('Failed to modify comment')
    }
  })
  // reload lablog data
  await lablogDataStore.fetchLablogData()
  // Reset editing state
  editingKey.value = null
  editingField.value = null
}

const cancelEdit = () => {
  editingKey.value = null
  editingField.value = null
}

const deleteComment = async (comment_id) => {
  console.log(`Deleting comment ${comment_id}`)
  await callRESTfulAPI(`comments/${comment_id}`, 'DELETE').then((response) => {
    if (response?.result == 'success') {
      message.info('Comment deleted successfully')
    } else {
      message.error('Failed to delete comment')
    }
  })
  // reload lablog data
  await lablogDataStore.fetchLablogData()
}

const isAddCommentModalVisible = ref(false)
const newComment = ref<{
  author: string
  content: string
  contact_address: string
  ip_address: string
  display: boolean
  created_timestamp: Dayjs | null
}>({
  author: '',
  content: '',
  contact_address: '',
  ip_address: '',
  display: false,
  created_timestamp: null,
})

const showAddCommentModal = () => {
  isAddCommentModalVisible.value = true
}

const handleAddComment = async () => {
  console.log('Add new comment', newComment.value)
  const timestamp = newComment.value.created_timestamp
    ? newComment.value.created_timestamp.unix()
    : null
  await callRESTfulAPI(
    `comments`,
    'POST',
    JSON.stringify({
      post_id: post_uuid.value,
      name: newComment.value.author,
      content: newComment.value.content,
      contact_address: newComment.value.contact_address,
      ip_address: newComment.value.ip_address,
      display: newComment.value.display,
      created_timestamp: timestamp,
    }),
  ).then((response) => {
    if (response?.result == 'success') {
      message.info('New comment added successfully')
    } else {
      message.error('Failed to add new comment')
    }
  })
  // reload lablog data
  await lablogDataStore.fetchLablogData()
  isAddCommentModalVisible.value = false
}

const handleCancelAddComment = () => {
  isAddCommentModalVisible.value = false
}
</script>

<style scoped>
.post-page-header :deep(tr:last-child td) {
  padding-bottom: 0;
}
.post-page-header :deep(tr:last-child td) {
  padding-bottom: 0;
}
.cytoscape-container {
  width: 100%;
  height: 500px;
}
</style>
