<template>
  <a-layout>
    <a-layout-sider
      width="220"
      style="background: #fff"
      v-model:collapsed="collapsed"
      collapsedWidth="60"
      collapsible
    >
      <a-menu
        v-model:selectedKeys="postsMenuSelectedKeys"
        v-model:openKeys="postsMenuOpenKeys"
        mode="inline"
        :style="{ height: '100%', borderRight: 0 }"
      >
        <a-menu-item key="posts-manage">
          <AppstoreAddOutlined />
          <span>
            <router-link to="/posts/manage">Manage</router-link>
          </span>
        </a-menu-item>
        <a-sub-menu key="posts-all">
          <template #title>
            <ProjectOutlined />
            <span>Posts</span>
          </template>
          <template v-for="(item, uuid) in lablogDataStore.lablogDataState.posts" :key="uuid">
            <a-menu-item>
              <ExperimentOutlined />
              <span>
                <router-link :to="{ name: 'post_id', params: { post_uuid: uuid } }">
                  {{ item.title }}
                </router-link>
              </span>
            </a-menu-item>
          </template>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout style="padding: 0 24px 24px">
      <router-view />
      <a-layout-footer style="text-align: center">
        Lablog Management Web UI ©2025 lablog.zzi.io
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ProjectOutlined, ExperimentOutlined, AppstoreAddOutlined } from '@ant-design/icons-vue'

import { useLablogDataStore } from '@/store/management'
const lablogDataStore = useLablogDataStore()

const collapsed = ref<boolean>(false)
const postsMenuSelectedKeys = ref<string[]>(['posts-manage'])
const postsMenuOpenKeys = ref<string[]>(['posts-all'])
</script>
