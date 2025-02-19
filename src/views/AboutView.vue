<template>
  <a-layout style="padding: 0 24px 24px">
    <a-layout-content
      :style="{
        background: '#fff',
        padding: '24px',
        margin: '16px 0',
        minHeight: '280px',
      }"
    >
      <a-typography>
        <a-typography-title :level="1">About</a-typography-title>
        <a-typography-paragraph>
          This application is part of the Lablog project. Visit
          <a-typography-link href="https://lablog.zzi.io"> lablog.zzi.io </a-typography-link>
          for more information.
        </a-typography-paragraph>
        <a-typography-paragraph>
          The Lablog project is an open source, minimalist blogging software suite.
        </a-typography-paragraph>
        <a-typography-paragraph>
          lablog-manage is a submodule of Lablog that provides Web UI for management of the lablog
          backend.
        </a-typography-paragraph>
      </a-typography>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Lablog Management Web UI ©2025 lablog.zzi.io
    </a-layout-footer>
  </a-layout>
</template>
