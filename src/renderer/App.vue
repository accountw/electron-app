<script setup lang="ts">
import { Const } from '@common/Const';
import { IpcRendererEvent } from 'electron';
import { onMounted, ref } from 'vue'
import { Events } from './Events';
import { ElScrollbar } from 'element-plus';
/****  data  ******/
const input = ref('C:\\MetaWorldGames\\MetaApp\\Editor_Win64\\MetaWorldSaved\\Saved\\MetaWorld\\Project\\Edit\\jellyrun')
const logText = ref(new Array<string>());
const levels = ref(new Array<string>());
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
levels.value.push('lv1', 'lv2', 'obby');



function updateLevel() {
  console.log('更新关卡');
  Events.dispatchToMain("test");
};
function compile() {
  console.log('编译');
};
function syncCode() {
  console.log('关卡同步common代码');
};
function selectFile() {
  Events.dispatchToMain("selectFile");
}
function scrollToBottom() {
  const scrollDom = scrollbarRef.value!.wrapRef as HTMLElement;
  scrollDom.scrollTop = scrollDom.scrollHeight;
}




onMounted(() => {
  //监听日志输出
  Events.addMainListener(Const.LOG, (event: IpcRendererEvent, data: { msg: string, level: Const.LogLevel }) => {
    console.log('日志输出', data);

    switch (data.level) {
      case Const.LogLevel.LOG:
        console.log(data.msg);
        break;
      case Const.LogLevel.ERROR:
        console.error(data.msg);
        break;
      case Const.LogLevel.WARN:
        console.warn(data.msg);
        break;
    }
    logText.value.push(data.msg)
    // 滚动到底部
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  })
})
</script>

<template>
  <div class="App">
    <el-container>
      <el-main>
        <el-text>项目地址：</el-text>
        <el-text v-text="input" type="danger"></el-text>
        <el-button type="primary" @click="syncCode">项目地址</el-button>
      </el-main>
    </el-container>
    <el-container>
      <el-main>
        <el-button type="primary" @click="updateLevel">更新关卡</el-button>
        <el-button type="primary" @click="compile">编译</el-button>
        <el-button type="primary" @click="syncCode">关卡同步common代码</el-button>
      </el-main>
    </el-container>

    <el-container>
      <el-scrollbar ref="scrollbarRef" height="400px">
        <p v-for="log in logText" :key="log">
          <el-text height="40px">{{ log }}</el-text>
        </p>
      </el-scrollbar>
    </el-container>

  </div>
</template>
