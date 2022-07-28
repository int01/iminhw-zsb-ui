<template>
  <div class="app-container home">
    <h1>等待开发中。。。</h1>
    <!-- <el-row :gutter="20">
      <el-col :sm="24" :lg="24">
        <blockquote class="text-warning" style="font-size: 14px">
          1、
          2、
        </blockquote>

        <hr />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>招生办</h2>
        <p>
            项目
        </p>
        <p>
          <b>当前版本:</b> <span>v{{ version }}</span>
        </p>
        <p>
          <el-button
            type="primary"
            icon="Cloudy"
            plain
            @click="goTarget('http://121.5.52.248/')"
            >访问</el-button
          >
          <el-button
            icon="HomeFilled"
            plain
            @click="goTarget('localhost/')"
            >访问</el-button
          >
        </p>
      </el-col>
      <el-col :sm="24" :lg="12" style="padding-left: 50px">
        <el-row>
          <el-col :span="12">
            <h2>技术选型</h2>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <h4>后端技术</h4>
            <ul>
              <li>SpringBoot</li>
              <li>Spring Security</li>
              <li>JWT</li>
              <li>MyBatis</li>
              <li>Druid</li>
              <li>Fastjson</li>
              <li>...</li>
            </ul>
          </el-col>
          <el-col :span="6">
            <h4>前端技术</h4>
            <ul>
              <li>Vue</li>
              <li>Vuex</li>
              <li>Element-plus</li>
              <li>Axios</li>
              <li>Sass</li>
              <li>Quill</li>
              <li>...</li>
            </ul>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>title</span>
            </div>
          </template>
          <div class="body">
            body
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <el-collapse>
             <el-collapse-item title="v2.0 - 2022-07-23">
              <ol>
                <li>完善档案收集->拆袋录入</li>
                <li>修复个性化设置（布局设置）主题色不能控制页面颜色的问题</li>
                <li>调整登陆页样式</li>
                <li>修正录取数据和通知书邮寄记录导入数据的返回方式；新增邮寄档案验证更新方法
,修改默认查询排序问题</li>
              </ol>
              </el-collapse-item>
            <el-collapse-item title="v2.0 - 2022-07-20">
              <ol>
                <li>新增学院专业映射配置</li>
                <li>录取数据新增考生学籍地区</li>
                <li>新增按录取数据专业匹配学院导出通知书打印数据</li>
                <li>修改邮寄档案快速验证方式为按年验证</li>
                <li>修改邮寄档案快速验证里面自定义序号，不指定序号更加快捷</li>
                <li>新增前台用户查询数据日志记录管理</li>
                <li>修改读取用户IP地址方式</li>
                <li>去掉后台用户手机号和邮箱不能重复验证</li>
                <li>修改通知书快递单号打印方式，按打印机模版提供不同导入数据入口</li>
                <li>修正用户权限验证问题</li>
                <li>修正以考生号为主键，修改添加问题。</li>
              </ol>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>title</span>
            </div>
          </template>
          <div class="body">
            <br/>
            <span style="display: inline-block; height: 30px; line-height: 30px"
              >body</span
            >
          </div>
        </el-card>
      </el-col>
    </el-row> -->
  </div>
</template>

<script setup name="Index">
const version = ref('2.0')

function goTarget(url) {
  window.open(url, '__blank')
}
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

