<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="序号" prop="xh">
        <el-input
          v-model="queryParams.xh"
          placeholder="请输入序号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="考生号" prop="ksh">
        <el-input
          v-model="queryParams.ksh"
          placeholder="请输入考生号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证号" prop="sfzh">
        <el-input
          v-model="queryParams.sfzh"
          placeholder="请输入身份证号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="xm">
        <el-input
          v-model="queryParams.xm"
          placeholder="请输入姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="录取专业" prop="zy">
        <el-input
          v-model="queryParams.zy"
          placeholder="请输入录取专业"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学院" prop="xy">
        <el-input
          v-model="queryParams.xy"
          placeholder="请输入学院"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学籍地区" prop="xy">
        <el-input
          v-model="queryParams.dq"
          placeholder="请输入学籍地区"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" style="width: 308px">
        <!-- <el-date-picker
          v-model="daterangeCreateTime"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker> -->
        <el-date-picker
          v-model="daterangeCreateTime"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
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
          v-hasPermi="['stu:matview:export']"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button plain icon="Close" @click="handleClose">关闭</el-button>
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="matviewList" @sort-change="handleSortChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column
        label="序号"
        fixed
        min-width="105"
        sortable='custom'
        align="center"
        prop="xh"
      />
      <el-table-column
        label="姓名"
        min-width="100"
        fixed
        sortable='custom'
        align="center"
        prop="xm"
      />
      <el-table-column
        label="考生号"
        min-width="135"
        align="center"
        prop="ksh"
      />
      <el-table-column
        label="身份证号"
        min-width="165"
        align="center"
        prop="sfzh"
      />
      <el-table-column
        label="录取专业"
        min-width="160"
        sortable='custom'
        align="center"
        prop="zy"
      />
      <el-table-column
        label="学院"
        min-width="130"
        sortable='custom'
        align="center"
        prop="xy"
      />
      <el-table-column
        label="地区"
        min-width="90"
        sortable='custom'
        align="center"
        prop="dq"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        sortable='custom'
        min-width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
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

<script setup name="Matview">
import { listMatview } from "@/api/stu/matview";

const { proxy } = getCurrentInstance();

const matviewList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);
const daterangeCreateTime = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    orderByColumn: "create_time",
    isAsc: "desc",
    xh: null,
    ksh: null,
    sfzh: null,
    xm: null,
    zy: null,
    xy: null,
    dq: null,
    createTime: null,
  },
  rules: {},
});

const { queryParams, form, rules } = toRefs(data);

/** 查询通知书数据列表 */
function getList() {
  loading.value = true;
  queryParams.value.params = {};
  if (null != daterangeCreateTime && "" != daterangeCreateTime) {
    queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0];
    queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1];
  }
  listMatview(queryParams.value).then((response) => {
    matviewList.value = response.rows;
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
  daterangeCreateTime.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    "stu/matview/export",
    {
      ...queryParams.value,
    },
    `matview_${new Date().getTime()}.xlsx`
  );
}

/** 返回按钮操作 */
function handleClose() {
  const obj = { path: "/stu/matriculate" };
  proxy.$tab.closeOpenPage(obj);
}

/** 排序触发事件 */
function handleSortChange(column, prop, order) {
  queryParams.value.orderByColumn = column.prop;
  queryParams.value.isAsc = column.order;
  getList();
}

getList();
</script>
