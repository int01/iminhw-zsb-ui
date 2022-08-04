<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="70px"
    >
      <el-form-item label="统计字段" prop="analysisType">
        <el-checkbox-group v-model="analysisType" @keyup.enter="handleQuery">
          <!--@change="handleAnalysisTypeChange"  :min="1" -->
          <el-checkbox label="年度" name="analysisType" />
          <el-checkbox label="省份" name="analysisType" />
          <el-checkbox label="批次" name="analysisType" />
          <el-checkbox label="科类" name="analysisType" />
          <el-checkbox label="录取专业" name="analysisType" />
          <el-checkbox label="中学名称" name="analysisType" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="省份"
        prop="dq"
        :style="`display: ${analysisType.indexOf('省份') > -1 ? '' : 'none'};`"
      >
        <el-input
          v-model="queryParams.dq"
          placeholder="请输入省份"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="批次"
        prop="pc"
        :style="`display: ${analysisType.indexOf('批次') > -1 ? '' : 'none'};`"
      >
        <el-select v-model="queryParams.pc" placeholder="请选择批次" clearable>
          <el-option
            v-for="dict in matriculate_pc"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="科类"
        prop="kl"
        :style="`display: ${analysisType.indexOf('科类') > -1 ? '' : 'none'};`"
      >
        <el-select v-model="queryParams.kl" placeholder="请选择科类" clearable>
          <el-option
            v-for="dict in matriculate_kl"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="中学名称"
        prop="zxmc"
        :style="`display: ${
          analysisType.indexOf('中学名称') > -1 ? '' : 'none'
        };`"
      >
        <el-input
          v-model="queryParams.zxmc"
          placeholder="请输入中学名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="录取专业"
        prop="zy"
        :style="`display: ${
          analysisType.indexOf('录取专业') > -1 ? '' : 'none'
        };`"
      >
        <el-input
          v-model="queryParams.zy"
          placeholder="请输入录取专业"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['analysis:matriculate:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="matriculateList">
      <el-table-column
        label="年度"
        align="center"
        min-width="100"
        prop="nd"
        v-if="analysisType.indexOf('年度') > -1"
      />
      <el-table-column
        label="省份"
        align="center"
        min-width="100"
        prop="dq"
        v-if="analysisType.indexOf('省份') > -1"
      />
      <el-table-column
        label="批次"
        align="center"
        prop="pc"
        v-if="analysisType.indexOf('批次') > -1"
      >
        <template #default="scope">
          <dict-tag :options="matriculate_pc" :value="scope.row.pc" />
        </template>
      </el-table-column>
      <el-table-column
        label="科类"
        align="center"
        prop="kl"
        v-if="analysisType.indexOf('科类') > -1"
      >
        <template #default="scope">
          <dict-tag :options="matriculate_kl" :value="scope.row.kl" />
        </template>
      </el-table-column>
      <el-table-column
        label="中学名称"
        align="center"
        prop="zxmc"
        v-if="analysisType.indexOf('中学名称') > -1"
      />
      <el-table-column
        label="录取专业"
        min-width="100"
        align="center"
        prop="zy"
        v-if="analysisType.indexOf('录取专业') > -1"
      />
      <el-table-column label="最高分" align="center" prop="maxTdcj" />
      <el-table-column label="最低分" align="center" prop="minTdcj" />
      <el-table-column label="平均分" align="center" prop="avgTdcj" />
      <el-table-column label="人数" align="center" prop="countNum" />
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script setup name="AnalysisMatriculate">
import { listMatriculate } from "@/api/analysis/matriculate";
import { ElMessage, ElMessageBox } from "element-plus";

const { proxy } = getCurrentInstance();
const { matriculate_pc, matriculate_kl } = proxy.useDict(
  "matriculate_pc",
  "matriculate_kl"
);

const matriculateList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);
const analysisType = ref([]);

const data = reactive({
  queryParams: {},
});

const { queryParams } = toRefs(data);

function avgTdcjFormatter(row) {
  return row.avgTdcj.toFixed(2);
}

/** 查询录取数据列表 */
function getList() {
  loading.value = true;
  // const type = analysisType.value.map((item) => {
  //   if(item == "年度") {
  //     return "nd";
  //   }
  //   if (item == "省份") {
  //     return "dq";
  //   }
  //   if (item == "批次") {
  //     return "pc";
  //   }
  //    if (item == "科类") {
  //     return "kl";
  //   }
  //    if (item == "中学名称") {
  //     return "zxmc";
  //   }
  //    if (item == "录取专业") {
  //     return "zy";
  //   }
  // });

  queryParams.value.params = {};
  analysisType.value.forEach((item) => {
    if (item == "年度") {
      queryParams.value.params["nd"] = 1;
    }
    if (item == "省份") {
      queryParams.value.params["dq"] = 1;
    }
    if (item == "批次") {
      queryParams.value.params["pc"] = 1;
    }
    if (item == "科类") {
      queryParams.value.params["kl"] = 1;
    }
    if (item == "中学名称") {
      queryParams.value.params["zxmc"] = 1;
    }
    if (item == "录取专业") {
      queryParams.value.params["zy"] = 1;
    }
  });
  listMatriculate(queryParams.value).then((response) => {
    matriculateList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  analysisType.value = [];
  handleQuery();
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    "analysis/matriculate/export",
    {
      ...queryParams.value,
    },
    `analysis_matriculate_${new Date().getTime()}.xlsx`
  );
}

getList();
</script>
