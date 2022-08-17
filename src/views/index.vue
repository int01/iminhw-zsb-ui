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
            <el-col :span="6" class="item">待办</el-col>
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
              <span>外省近三年录取人数</span>
            </template>
            <div v-hasPermi="['analysis:index:smnp']">
              <div ref="matYearBar" style="height: 460px; width: 100%" />
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :span="8">
          <el-row>
            <el-col>
              <el-card
                class="box-card shortcut"
                :body-style="{ padding: '0px !important' }"
              >
                <template #header>
                  <span>快捷导航</span>
                </template>
                <el-row>
                  <el-col :span="8" class="item">
                    <el-card shadow="hover"> Hover </el-card>
                  </el-col>
                  <el-col :span="8" class="item"
                    ><el-card shadow="hover"> Hover </el-card>
                  </el-col>
                  <el-col :span="8" class="item"
                    ><el-card shadow="hover"> Hover </el-card>
                  </el-col>
                  <el-col :span="8" class="item">
                    <el-card shadow="hover"> Hover </el-card>
                  </el-col>
                  <el-col :span="8" class="item"
                    ><el-card shadow="hover"> Hover </el-card>
                  </el-col>
                  <el-col :span="8" class="item"
                    ><el-card shadow="hover"> Hover </el-card>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
            <el-col v-hasPermi="['analysis:index:hpv']">
              <el-card class="box-card">
                <div>
                  <div ref="hpvCount" style="height: 300px" />
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup name="Index">
import useUserStore from "@/store/modules/user";
import * as echarts from "echarts";

import {
  getHongPageCount,
  getStuMatBythreeYearNumP,
} from "@/api/analysis/index";

const userStore = useUserStore();

const hpvCount = ref(null);
const matYearBar = ref(null);

function goTarget(url) {
  window.open(url, "__blank");
}


function matYearBarFun(data = []) {
  const matYearBarEchartInstance = echarts.init(matYearBar.value);
  /** 数据处理 start  */
  const dimensions = ["dq"]; // 近三年的年份
  const nowYear = new Date().getFullYear();
  dimensions.push(nowYear - 2);
  dimensions.push(nowYear - 1);
  dimensions.push(nowYear);

  /** 数据处理 end  */
  matYearBarEchartInstance.setOption({
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {},
    dataset: {
      dimensions, // 近三年的年份
      source: data,
    },
    xAxis: { type: "category" },
    yAxis: {}, // name: "录取人数"
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }],
  });
}

getHongPageCount().then((response) => {
  const commandstatsIntance = echarts.init(hpvCount.value, "macarons");
  commandstatsIntance.setOption({
    title: {
      text: "前台查询次数",
      // subtext: "Fake Data",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      bottom: "bottom",
    },
    series: [
      {
        name: "查询次数",
        type: "pie",
        radius: "55%",
        data: response.data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  });
});
getStuMatBythreeYearNumP().then((response) => {
  const resArr = [];
  response.data.forEach((item) => {
    const resIndex = resArr.findIndex((v) => {
      return v.dq == item.dq;
    });
    let itemObj = {};
    if (resIndex != -1) {
      itemObj = resArr[resIndex];
      resArr.splice(resIndex, 1)
      itemObj[item.year] = item.value;
    } else {
      itemObj["dq"] = item.dq;
      itemObj[item.year] = item.value;
    }
    resArr.push(itemObj);
  });
  matYearBarFun(resArr);
});
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
  .shortcut {
    margin: 0;
    padding: 0;
    .item {
      text-align: center;
      margin-bottom: 0;
      padding: 0;
    }
  }
}
</style>
