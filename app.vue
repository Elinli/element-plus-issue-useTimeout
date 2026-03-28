<script setup>
const { locale } = useI18n()
const switchLanguage = (code) => {
  // 必须使用外部跳转来触发全量 SSR 渲染（Document 请求）
  window.location.href = '/' + code
}
</script>

<template>
  <div style="padding: 50px;">
    <h1>Nuxt i18n 500 Repro (Fixed Build)</h1>
    <p>当前语言: {{ locale }}</p>
    <button @click="switchLanguage('en')">English</button>
    <button @click="switchLanguage('de')">Deutsch</button>

    <div style="margin-top: 20px;">
      <el-tooltip content="触发 Bug 的组件">
        <el-button>Hover me</el-button>
      </el-tooltip>
    </div>
  </div>
</template>
