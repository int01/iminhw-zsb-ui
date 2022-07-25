<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="学号" prop="xuehao">
        <el-input
          v-model="queryParams.xuehao"
          placeholder="请输入学号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="班级" prop="bj">
        <el-input
          v-model="queryParams.bj"
          placeholder="请输入班级"
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
      <el-form-item label="档案状态" prop="dazt">
        <el-select
          v-model="queryParams.dazt"
          placeholder="请选择档案状态"
          clearable
        >
          <el-option
            v-for="dict in archives_class_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['archives:class:add']"
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
          v-hasPermi="['archives:class:edit']"
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
          v-hasPermi="['archives:class:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['archives:class:export']"
          >导出</el-button
        >
      </el-col>
      <!-- 导入数据（主要导入分班数据） -->
      <el-col :span="1.5">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="主要使用场景是导入分班数据"
          placement="top"
        >
          <el-button
            type="danger"
            plain
            icon="Upload"
            @click="handleImport"
            v-hasPermi="['archives:class:import']"
            >导入
          </el-button>
        </el-tooltip>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Postcard"
          @click="handleCollect"
          v-hasPermi="['archives:class:']"
          >现场收集</el-button
        >
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="classList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="学号" align="center" prop="xuehao" />
      <el-table-column label="档案序号" sortable align="center" prop="xh" />
      <el-table-column label="班级" align="center" prop="bj" />
      <el-table-column label="姓名" align="center" prop="xm" />
      <el-table-column label="档案状态" align="center" prop="dazt">
        <template #default="scope">
          <dict-tag :options="archives_class_status" :value="scope.row.dazt" />
        </template>
      </el-table-column>
      <el-table-column label="考生号" align="center" prop="ksh" />
      <!-- <el-table-column label="身份证号" align="center" prop="sfzh" /> -->
      <el-table-column label="数据状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="data_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['archives:class:edit']"
            >修改</el-button
          >
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['archives:class:remove']"
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

    <!-- 添加或修改档案收集对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="classRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学号" prop="xuehao">
          <el-input
            v-model="form.xuehao"
            v-bind:disabled="!addFlag"
            placeholder="请输入学号"
          />
        </el-form-item>
        <el-form-item label="档案序号" prop="xh">
          <el-input v-model="form.xh" placeholder="请输入档案序号" />
        </el-form-item>
        <el-form-item label="班级" prop="bj">
          <el-input v-model="form.bj" placeholder="请输入班级" />
        </el-form-item>
        <el-form-item label="姓名" prop="xm">
          <el-input v-model="form.xm" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="考生号" prop="ksh">
          <el-input v-model="form.ksh" placeholder="请输入考生号" />
        </el-form-item>
        <el-form-item label="档案状态" prop="dazt">
          <el-radio-group v-model="form.dazt">
            <el-radio
              v-for="dict in archives_class_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号" prop="sfzh">
          <el-input v-model="form.sfzh" placeholder="请输入身份证号" />
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
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 数据导入对话框 -->
    <el-dialog
      :title="upload.title"
      v-model="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip">
              <el-checkbox v-model="upload.updateSupport" />
              是否更新已经存在的数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link
              type="primary"
              :underline="false"
              style="font-size: 12px; vertical-align: baseline"
              @click="importTemplate"
              >下载模板
            </el-link>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      :title="collect.title"
      v-model="collect.open"
      width="40%"
      fullscreen
      append-to-body
      show-close
      center
    >
    
      学号：
      <el-button type="primary" @click="innerVisible = true"
          >open the inner Dialog</el-button
        >
       <el-dialog
        draggable
        v-model="innerVisible"
        width="30%"
        title="Inner Dialog"
        append-to-body
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="">确 定</el-button>
          <el-button type="warning" @click="">暂 缓</el-button>
          <el-button @click="collect.open = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="Class">
import {
  listClass,
  getClass,
  delClass,
  addClass,
  updateClass,
} from "@/api/archives/class";

import { getToken } from "@/utils/auth";

const { proxy } = getCurrentInstance();
const { data_status, archives_class_status } = proxy.useDict(
  "data_status",
  "archives_class_status"
);

const classList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const addFlag = ref(false);

const innerVisible = ref(false)

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    xuehao: null,
    bj: null,
    xm: null,
    dazt: null,
    ksh: null,
    sfzh: null,
    status: null,
  },
  rules: {
    xuehao: [{ required: true, message: "学号不能为空", trigger: "blur" }],
    xh: [{ required: true, message: "档案序号不能为空", trigger: "blur" }],
    xm: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
    bj: [{ required: true, message: "班级不能为空", trigger: "blur" }],
    ksh: [{ required: true, message: "考生号不能为空", trigger: "blur" }],
    dazt: { required: true, trigger: "change", message: "请选择档案状态" },
  },
});

const { queryParams, form, rules } = toRefs(data);

/*** 导入参数 */
const upload = reactive({
  // 是否显示弹出层（导入）
  open: false,
  // 弹出层标题（导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/archives/class/importData",
});

const collect = reactive({
  open: false,
  title: "",
});

/** 查询档案收集列表 */
function getList() {
  loading.value = true;
  listClass(queryParams.value).then((response) => {
    classList.value = response.rows;
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
    xuehao: null,
    xh: null,
    bj: null,
    xm: null,
    dazt: null,
    ksh: null,
    sfzh: null,
    status: 0,
    createBy: null,
    updateBy: null,
    remark: null,
    updateTime: null,
    createTime: null,
  };
  proxy.resetForm("classRef");
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
  ids.value = selection.map((item) => item.xuehao);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  addFlag.value = true;
  title.value = "添加档案收集";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  addFlag.value = false;
  const xuehao = row.xuehao || ids.value;
  getClass(xuehao).then((response) => {
    form.value = response.data;
    open.value = true;
    title.value = "修改档案收集";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["classRef"].validate((valid) => {
    if (valid) {
      if (!addFlag.value) {
        updateClass(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addClass(form.value).then((response) => {
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
  const xuehaos = row.xuehao || ids.value;
  proxy.$modal
    .confirm('是否确认删除档案学号为"' + xuehaos + '"的数据项？')
    .then(function () {
      return delClass(xuehaos);
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
    "archives/class/export",
    {
      ...queryParams.value,
    },
    `class_${new Date().getTime()}.xlsx`
  );
}


/** 导入按钮操作 */
function handleImport() {
  upload.title = "档案收集情况导入";
  upload.open = true;
}

/** 下载模板操作 */
function importTemplate() {
  proxy.download(
    "/archives/class/importTemplate",
    {},
    `class_${new Date().getTime()}.xlsx`
  );
}

/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].handleRemove(file);
  proxy.$alert(
    "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
      response.msg +
      "</div>",
    "导入结果",
    { dangerouslyUseHTMLString: true }
  );
  getList();
};

/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
}

/** 打开档案收集框 */
function handleCollect(){
  collect.open = true;
}


getList();
</script>
