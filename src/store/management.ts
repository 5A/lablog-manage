import { defineStore } from 'pinia'
import { type RemovableRef, useStorage } from '@vueuse/core'
import { callRESTfulAPI } from '@/common/connection'

export interface PostDataItem {
  post_id: string
  title: string
  abstract: string
  link: string
  created_timestamp: number
  catagory: string
  tags: Array<string>
  comments: Array<string>
}

export interface CommentDataItem {
  comment_id: string
  post_id: string
  name: string
  content: string
  contact_address: string
  created_timestamp: number
  ip_address: string
  display: boolean
}

export interface LablogDataState {
  posts: Record<string, PostDataItem>
  comments: Record<string, CommentDataItem>
}

// Store for the database of posts and comments.
export const useLablogDataStore = defineStore('lablog-data', () => {
  const lablogDataState: RemovableRef<LablogDataState> = useStorage('lablog-data-local-storage', {
    posts: {},
    comments: {},
  })
  const fetchLablogData = async () => {
    // retrive a list of posts by GET
    await callRESTfulAPI('management/data', 'GET').then((response) => {
      if (response?.posts) {
        // purge and reconstruct local buffer
        lablogDataState.value.posts = {}
        for (const item in response.posts) {
          lablogDataState.value.posts[item] = response.posts[item]
        }
        lablogDataState.value.comments = {}
        for (const item in response.comments) {
          lablogDataState.value.comments[item] = response.comments[item]
        }
      }
    })
  }
  return {
    lablogDataState,
    fetchLablogData,
  }
})
