<template>
  <div>
    <el-card class="box-card top">
      <el-row :gutter="20">
        <el-col :xs="6" :sm="3" :md="3" :lg="2" :xl="1">
          <el-avatar :size="86" :src="userStore.avatar" />
        </el-col>
        <el-col :xs="18" :sm="13" :md="13" :lg="12" :xl="13">
          <div class="title">你好，{{ userStore.nickName }}</div>
          <div>
            最后登陆ip
            {{ userStore.loginIp }}
          </div>
          <div>
            最后登陆时间
            {{ parseTime(userStore.loginDate) }}
          </div>
        </el-col>
        <el-col :xs="24" :sm="8" :lg="10" :xl="10">
          <el-row justify="end">
            <el-col :span="6" class="item">1</el-col>
            <el-col :span="6" class="item">2</el-col>
            <el-col :span="6" class="item">3</el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
    <div class="app-container home">
      <el-row :gutter="20">
        <el-col :xs="24" :span="16">
          <el-card class="box-card">
            <template #header>
              <span>Card name</span>
            </template>
            <h1>等待开发中。。。</h1>
          </el-card>
        </el-col>
        <el-col :xs="24" :span="8">
          <el-card class="box-card">
            <template #header>
              <span>快捷导航</span>
            </template>
            <h1>等待开发中。。。</h1>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup name="Index">
import useUserStore from "@/store/modules/user";

const userStore = useUserStore();

function goTarget(url) {
  window.open(url, "__blank");
}
</script>

<style scoped lang="scss">
.top {
  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;
  .title {
    font-size: large;
    line-height: 32px;
    margin: 6px 0;
    color: black;
    font-weight: bold;
  }
  .item {
    text-align: center;
  }
}

.home {
  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #676a6c;
  overflow-x: hidden;

  .el-col {
    margin-bottom: 20px;
  }
}
</style>
