<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="专业" prop="zy">
        <el-input
          v-model="queryParams.zy"
          placeholder="请输入专业"
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
      <el-form-item label="数据状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择数据状态"
          clearable
        >
          <el-option
            v-for="dict in data_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['stu:stuxyzy:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['stu:stuxyzy:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['stu:stuxyzy:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['stu:stuxyzy:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="stuxyzyList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="专业" min-width="160" align="center" prop="zy" />
      <el-table-column label="学院" min-width="130" sortable align="center" prop="xy" />
      <el-table-column label="数据状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="data_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        sortable
        min-width="120"
        :show-overflow-tooltip="true"
      >
        <template #default="scope">
          <span>{{
            parseTime(scope.row.createTime)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        min-width="140"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['stu:stuxyzy:edit']"
            >修改</el-button
          >
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['stu:stuxyzy:remove']"
            >删除</el-button
          >
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

    <!-- 添加或修改专业学院配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="stuxyzyRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="专业" prop="zy">
          <el-input
            v-model="form.zy"
            v-bind:disabled="!addFlag"
            placeholder="请输入考生号"
          />
        </el-form-item>
        <el-form-item label="学院" prop="xy">
          <el-input v-model="form.xy" placeholder="请输入学院" />
        </el-form-item>
        <el-form-item label="数据状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择数据状态">
            <el-option
              v-for="dict in data_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Stuxyzy">
import {
  listStuxyzy,
  getStuxyzy,
  delStuxyzy,
  addStuxyzy,
  updateStuxyzy,
} from "@/api/stu/stuxyzy";

const { proxy } = getCurrentInstance();
const { data_status } = proxy.useDict("data_status");

const stuxyzyList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const rowIds = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const addFlag = ref(false);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    zy: null,
    xy: null,
    status: null,
  },
  rules: {
    zy: [{ required: true, message: "专业不能为空", trigger: "blur" }],
    xy: [{ required: true, message: "学院不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询专业学院配置列表 */
function getList() {
  loading.value = true;
  listStuxyzy(queryParams.value).then((response) => {
    stuxyzyList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    zy: null,
    xy: null,
    status: 0,
    createBy: null,
    updateBy: null,
    remark: null,
    updateTime: null,
    createTime: null,
  };
  proxy.resetForm("stuxyzyRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  rowIds.value = selection.map((item) => item.zy);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  addFlag.value = true;
  reset();
  open.value = true;
  title.value = "添加专业学院配置";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  addFlag.value = false;
  reset();
  const zy = row.zy || rowIds.value;
  getStuxyzy(zy).then((response) => {
    form.value = response.data;
    open.value = true;
    title.value = "修改专业学院配置";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["stuxyzyRef"].validate((valid) => {
    if (valid) {
      if (!addFlag.value) {
        updateStuxyzy(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addStuxyzy(form.value).then((response) => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const zys = row.zy || rowIds.value;
  proxy.$modal
    .confirm('是否确认删除专业学院配置编号为"' + zys + '"的数据项？')
    .then(function () {
      return delStuxyzy(zys);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    "stu/stuxyzy/export",
    {
      ...queryParams.value,
    },
    `stuxyzy_${new Date().getTime()}.xlsx`
  );
}

getList();
</script>
