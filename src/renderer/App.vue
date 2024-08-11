<script setup lang="ts">
import { constant } from '@lib/constant'
import { IpcRendererEvent } from 'electron'
import { onMounted, ref } from 'vue'
import { events } from './events'
import { ElMessageBox, ElScrollbar } from 'element-plus'
import { RenderRequest } from './renderRequest'

/****  data  ******/
type LogData = { msg: string; level: constant.LogLevel }
const loading = ref(false)
const projectPath = ref('')
const logText = ref(new Array<LogData>())
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
const isShowButton = ref(false)

const modules: string[] = []

function selectDir() {
  loading.value = true
  RenderRequest.start('/selectDir').then((rs) => {
    loading.value = false
    if (rs.code == constant.ResponseCode.SUCCESS) {
      projectPath.value = rs.data
      getAllSubmodule()
    }
  })
}
function getAllSubmodule() {
  loading.value = true
  RenderRequest.start('/getAllSubmodule', projectPath.value).then((rs) => {
    loading.value = false
    if (rs.code == constant.ResponseCode.SUCCESS) {
      modules.push(...rs.data)
      console.log('modules', modules)
      isShowButton.value = true
    } else {
      projectPath.value = "";
    }
  })
}
function updateLevel() {
  loading.value = true
  RenderRequest.start('/updateModules', projectPath.value, modules, 'dev').then((rs) => {
    loading.value = false
    console.log(rs)
  })
}
function compile() {
  loading.value = true
  RenderRequest.start('/compile', projectPath.value).then((rs) => {
    loading.value = false
    console.log(rs)
  })
}
function createVersionBranch() {
  ElMessageBox.prompt('输入发版版本', 'Tip', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel'
  }).then(({ value }) => {
    loading.value = true
    RenderRequest.start(
      '/createVersionBranchs',
      `version/${value}`,
      projectPath.value,
      modules
    ).then((rs) => {
      loading.value = false
      console.log(rs)
    })
  })
}
function scrollToBottom() {
  const scrollDom = scrollbarRef.value!.wrapRef as HTMLElement
  scrollDom.scrollTop = scrollDom.scrollHeight
}
function cleanLog() {
  logText.value = []
}

onMounted(() => {
  //监听日志输出
  events.addMainListener(
    constant.LOG,
    (event: IpcRendererEvent, data: { msg: string; level: constant.LogLevel }) => {
      console.log('日志输出', data)

      switch (data.level) {
        case constant.LogLevel.LOG:
          console.log(data.msg)
          break
        case constant.LogLevel.ERROR:
          console.error(data.msg)
          break
        case constant.LogLevel.WARN:
          console.warn(data.msg)
          break
      }
      logText.value.push({ msg: data.msg, level: data.level })
      // 滚动到底部
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    }
  )
})
</script>

<template>
  <div class="App">
    <el-container v-loading="loading">
      <el-header>
        <el-text>项目地址：</el-text>
        <el-text v-text="projectPath" type="danger"></el-text>
        <el-button type="primary" @click="selectDir">项目地址</el-button>
      </el-header>
      <el-container>
        <el-main v-show="isShowButton">
          <el-button type="primary" @click="updateLevel">更新关卡</el-button>
          <el-button type="primary" @click="compile">编译</el-button>
          <el-button type="primary" @click="createVersionBranch">建立版本分支</el-button>
          <el-button type="primary" @click="cleanLog">清空日志</el-button>
        </el-main>
      </el-container>
    </el-container>

    <el-footer style="background-color: #000000" height="600px">
      <el-scrollbar ref="scrollbarRef" height="600px">
        <p v-for="log in logText">
          <el-text height="40px" v-if="log.level == constant.LogLevel.LOG" type="info">{{
            log.msg
          }}</el-text>
          <el-text height="40px" v-if="log.level == constant.LogLevel.ERROR" type="danger">{{
            log.msg
          }}</el-text>
          <el-text height="40px" v-if="log.level == constant.LogLevel.WARN" type="warning">{{
            log.msg
          }}</el-text>
        </p>
      </el-scrollbar>
    </el-footer>
  </div>
</template>
