<script setup lang="ts">
import { ref } from 'vue'

const ipcHandle = () => window.electron.ipcRenderer.send('ping')
const updateLevel = () => {
  console.log('更新关卡');
  ipcHandle();
};
const compile = () => {
  console.log('编译');
};
const syncCode = () => {
  console.log('关卡同步common代码');
};
const input = ref('C:\\MetaWorldGames\\MetaApp\\Editor_Win64\\MetaWorldSaved\\Saved\\MetaWorld\\Project\\Edit\\jellyrun')

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

  </div>
</template>
