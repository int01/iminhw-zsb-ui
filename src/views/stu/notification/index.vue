<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="70px"
    >
      <el-form-item label="考生号" prop="ksh">
        <el-input
          v-model="queryParams.ksh"
          placeholder="请输入考生号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="快递单号" prop="kddh">
        <el-input
          v-model="queryParams.kddh"
          placeholder="请输入快递单号"
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
      <el-form-item label="联系电话" prop="lxdh">
        <el-input
          v-model="queryParams.lxdh"
          placeholder="请输入联系电话"
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
      <el-form-item label="创建时间" style="width: 308px">
        <el-date-picker
          v-model="daterangeCreateTime"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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
          v-hasPermi="['stu:notification:add']"
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
          v-hasPermi="['stu:notification:edit']"
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
          v-hasPermi="['stu:notification:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['stu:notification:export']"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Upload"
          @click="handleImport"
          v-hasPermi="['stu:notification:import']"
          >导入(热敏)
        </el-button>
      </el-col>
      <!--  -->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Upload"
          @click="handleStylusPrintingImport"
          v-hasPermi="['stu:notification:import']"
          >导入(针式)
        </el-button>
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="notificationList"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="考生号" fixed
        min-width="135" align="center" prop="ksh" />
      <el-table-column label="姓名" min-width="100" fixed sortable='custom' align="center" prop="xm" />
      <el-table-column label="快递单号" min-width="130"  align="center" prop="kddh" />
      <el-table-column label="联系电话" min-width="110" align="center" prop="lxdh" />
      <!-- <el-table-column label="邮政编码" align="center" prop="yzbh" /> -->
      <!-- <el-table-column label="邮寄地址" align="center" prop="yjdz" /> -->
      <el-table-column label="数据状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="data_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        sortable='custom'
        min-width="120"
        :show-overflow-tooltip="true"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        min-width="150"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['stu:notification:edit']"
            >修改</el-button
          >
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['stu:notification:remove']"
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

    <!-- 添加或修改通知书邮寄记录对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form
        ref="notificationRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="考生号" prop="ksh">
          <el-input
            v-model="form.ksh"
            v-bind:disabled="!addFlag"
            placeholder="请输入考生号"
          />
        </el-form-item>
        <el-form-item label="快递单号" prop="kddh">
          <el-input v-model="form.kddh" placeholder="请输入快递单号" />
        </el-form-item>
        <el-form-item label="姓名" prop="xm">
          <el-input v-model="form.xm" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="lxdh">
          <el-input v-model="form.lxdh" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮寄地址" prop="yjdz">
          <el-input v-model="form.yjdz" placeholder="请输入邮寄地址" />
        </el-form-item>
        <el-form-item label="邮政编码" prop="yzbh">
          <el-input v-model="form.yzbh" placeholder="请输入邮政编码" />
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
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
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
    <!-- 热敏数据导入对话框 -->
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

    <!-- StylusPrinting -->
    <el-dialog
      :title="uploadStylusPrinting.title"
      v-model="uploadStylusPrinting.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="uploadStylusPrintingRef"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="uploadStylusPrinting.headers"
        :action="uploadStylusPrinting.url + '?updateSupport=' + uploadStylusPrinting.updateSupport"
        :disabled="uploadStylusPrinting.isUploading"
        :on-progress="handleStylusPrintingFileUploadProgress"
        :on-success="handleStylusPrintingFileSuccess"
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
              <el-checkbox v-model="uploadStylusPrinting.updateSupport" />
              是否更新已经存在的数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link
              type="primary"
              :underline="false"
              style="font-size: 12px; vertical-align: baseline"
              @click="importStylusPrintingTemplate"
              >下载模板
            </el-link>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitStylusPrintingFileForm">确 定</el-button>
          <el-button @click="uploadStylusPrinting.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Notification">
import {
  listNotification,
  getNotification,
  delNotification,
  addNotification,
  updateNotification,
} from "@/api/stu/notification";

import { getToken } from "@/utils/auth";

const { proxy } = getCurrentInstance();
const { data_status } = proxy.useDict("data_status");

const notificationList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const rowIds = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const daterangeCreateTime = ref([]);

const addFlag = ref(false);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    orderByColumn: "create_time",
    isAsc: "desc",
    ksh: null,
    kddh: null,
    xm: null,
    lxdh: null,
    status: null,
    createTime: null,
  },
  rules: {
    ksh: [{ required: true, message: "考生号不能为空", trigger: "blur" }],
    kddh: [{ required: true, message: "快递单号不能为空", trigger: "blur" }],
    xm: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
    lxdh: [{ required: true, message: "联系电话不能为空", trigger: "blur" }],
    yjdz: [{ required: true, message: "邮寄地址不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);
/*** 热敏导入参数 */
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
  url: import.meta.env.VITE_APP_BASE_API + "/stu/notification/importData",
});
const uploadStylusPrinting = reactive({
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
  url: import.meta.env.VITE_APP_BASE_API + "/stu/notification/importStylusPrintingData",
});

/** 查询通知书邮寄记录列表 */
function getList() {
  loading.value = true;
  queryParams.value.params = {};
  if (null != daterangeCreateTime && "" != daterangeCreateTime) {
    queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0];
    queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1];
  }
  listNotification(queryParams.value).then((response) => {
    notificationList.value = response.rows;
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
    ksh: null,
    kddh: null,
    xm: null,
    yzbh: null,
    lxdh: null,
    yjdz: null,
    status: 0,
    createBy: null,
    updateBy: null,
    remark: null,
    updateTime: null,
    createTime: null,
  };
  proxy.resetForm("notificationRef");
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

// 多选框选中数据
function handleSelectionChange(selection) {
  rowIds.value = selection.map((item) => item.ksh);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 排序触发事件 */
function handleSortChange(column, prop, order) {
  queryParams.value.orderByColumn = column.prop;
  queryParams.value.isAsc = column.order;
  getList();
}

/** 新增按钮操作 */
function handleAdd() {
  addFlag.value = true;
  reset();
  open.value = true;
  title.value = "添加通知书邮寄记录";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  addFlag.value = false;
  reset();
  const ksh = row.ksh || rowIds.value;
  getNotification(ksh).then((response) => {
    form.value = response.data;
    open.value = true;
    title.value = "修改通知书邮寄记录";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["notificationRef"].validate((valid) => {
    if (valid) {
      if (!addFlag.value) {
        updateNotification(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addNotification(form.value).then((response) => {
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
  const kshs = row.ksh || rowIds.value;
  proxy.$modal
    .confirm('是否确认删除通知书邮寄记录编号为"' + kshs + '"的数据项？')
    .then(function () {
      return delNotification(kshs);
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
    "stu/notification/export",
    {
      ...queryParams.value,
    },
    `notification_${new Date().getTime()}.xlsx`
  );
}

/** 导入按钮操作 */
function handleImport() {
  upload.title = "通知书发放数据导入（热敏打印）";
  upload.open = true;
}
function handleStylusPrintingImport() {
  uploadStylusPrinting.title = "通知书发放数据导入（针式打印）";
  uploadStylusPrinting.open = true;
}

/** 下载模板操作 */
function importTemplate() {
  proxy.download(
    "stu/notification/importTemplate",
    {},
    `notification_ThermalPrinting_${new Date().getTime()}.xlsx`
  );
}
function importStylusPrintingTemplate() {
  proxy.download(
    "stu/notification/importStylusPrintingTemplate",
    {},
    `notification_StylusPrinting_${new Date().getTime()}.xlsx`
  );
}

/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
const handleStylusPrintingFileUploadProgress = (event, file, fileList) => {
  uploadStylusPrinting.isUploading = true;
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
const handleStylusPrintingFileSuccess = (response, file, fileList) => {
  uploadStylusPrinting.open = false;
  uploadStylusPrinting.isUploading = false;
  proxy.$refs["uploadStylusPrintingRef"].handleRemove(file);
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
function submitStylusPrintingFileForm(){
  proxy.$refs["uploadStylusPrintingRef"].submit();
}

getList();
</script>
