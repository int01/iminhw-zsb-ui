<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="快递单号" prop="kddh">
        <el-input
          v-model="queryParams.kddh"
          placeholder="请输入快递单号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="签收验证" prop="qsyz">
        <el-select
          v-model="queryParams.qsyz"
          placeholder="请选择签收验证"
          clearable
        >
          <el-option
            v-for="dict in ems_validated"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否档案" prop="sfda">
        <el-select
          v-model="queryParams.sfda"
          placeholder="请选择是否档案"
          clearable
        >
          <el-option
            v-for="dict in in_archives_ems_danan"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" prop="xm">
        <el-input
          v-model="queryParams.xm"
          placeholder="请输入姓名"
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
          >搜索
        </el-button>
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
          v-hasPermi="['archives:ems:add']"
          >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['archives:ems:edit']"
          >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['archives:ems:remove']"
          >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['archives:ems:export']"
          >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Upload"
          @click="handleImport"
          v-hasPermi="['archives:ems:import']"
          >导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          plain
          icon="Flag"
          @click="handleVerify"
          v-hasPermi="['archives:ems:verify']"
          >签收验证
        </el-button>
      </el-col>
      <!-- handleUnpack -->
      <el-col :span="1.5">
        <el-button
          plain
          icon="Orange"
          @click="handleUnpack"
          v-hasPermi="['archives:ems:unpack']"
          >拆袋录入
        </el-button>
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="emsList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="快递单号" align="center" prop="kddh" />
      <el-table-column label="签收验证" align="center" prop="qsyz">
        <template #default="scope">
          <dict-tag :options="ems_validated" :value="scope.row.qsyz" />
        </template>
      </el-table-column>
      <el-table-column label="是否档案" align="center" prop="sfda">
        <template #default="scope">
          <dict-tag :options="in_archives_ems_danan" :value="scope.row.sfda" />
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" prop="xm" />
      <el-table-column label="考生号" align="center" prop="ksh" />
      <!-- <el-table-column label="身份证号" align="center" prop="sfzh" /> -->
      <el-table-column label="数据状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="data_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        sortable
        width="120"
        :show-overflow-tooltip="true"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        sortable
        width="120"
        :show-overflow-tooltip="true"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
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
            v-hasPermi="['archives:ems:edit']"
            >修改
          </el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['archives:ems:remove']"
            >删除
          </el-button>
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

    <!-- 添加或修改邮寄档案对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="emsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="快递单号" prop="kddh">
          <el-input v-model="form.kddh" placeholder="请输入快递单号" />
        </el-form-item>
        <el-form-item label="签收验证">
          <el-radio-group v-model="form.qsyz">
            <el-radio
              v-for="dict in ems_validated"
              :key="dict.value"
              :label="parseInt(dict.value)"
              >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否档案">
          <el-radio-group v-model="form.sfda">
            <el-radio
              v-for="dict in in_archives_ems_danan"
              :key="dict.value"
              :label="parseInt(dict.value)"
              >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="姓名" prop="xm">
          <el-input v-model="form.xm" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="考生号" prop="ksh">
          <el-input v-model="form.ksh" placeholder="请输入考生号" />
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
        <el-form-item label="备注" prop="remark">
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

    <!-- ems单号导入对话框 -->
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
    <!-- 签收单号验证 -->
    <el-dialog
      :title="verify.title"
      v-model="verify.open"
      width="400px"
      @close="handleModelClass"
      append-to-body
      draggable
    >
      <el-form
        ref="verifyRef"
        :inline="true"
        :model="verifyFrom"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="签收验证" prop="qsyz">
          <el-select
            v-model="verifyFrom.qsyz"
            placeholder="请选择签收验证"
            clearable
          >
            <el-option
              v-for="dict in ems_validated"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="kddh">
          <el-input
            placeholder="请输入快递单号"
            v-model="verifyFrom.kddh"
            clearable
            @keyup.enter="submitVerifyForm"
          />
        </el-form-item>
        <!--        单个输入框防止回车刷新-->
        <!--        <el-form-item style="display: none">-->
        <!--          <el-input-->
        <!--              v-model="verifyFrom.kddh"-->
        <!--          />-->
        <!--        </el-form-item>-->
      </el-form>
      <!--      <el-divider />-->
      <el-alert
        :closable="false"
        :title="verify.msg"
        :type="verify.msgType"
        center
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitVerifyForm">确 定</el-button>
          <el-button @click="verify.open = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 快速拆袋 -->
    <el-dialog
      :title="unpack.title"
      v-model="unpack.open"
      width="400px"
      @close="handleModelClass"
      append-to-body
      draggable
    >
      1.要求必填考生号(不填没法和考生关联)<br />
      2.是否同时查询班级数据<br />
      3.是否同时更新班级上档案的状态<br />
      4.是否补全其他基本数据<br />
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitUnpackForm">确 定</el-button>
          <el-button @click="unpack.open = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Ems">
import {
  listEms,
  getEms,
  delEms,
  addEms,
  updateEms,
  verifyKddh,
} from "@/api/archives/ems";
import { getToken } from "@/utils/auth";

const { proxy } = getCurrentInstance();
const { data_status, in_archives_ems_danan, ems_validated } = proxy.useDict(
  "data_status",
  "in_archives_ems_danan",
  "ems_validated"
);

const emsList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

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
  url: import.meta.env.VITE_APP_BASE_API + "/archives/ems/importData",
});

const verify = reactive({
  // 是否显示弹出层
  open: false,
  // 弹出层标题
  title: "",
  msg: "等待操作...",
  msgType: "info",
  // 设置请求头部
  // headers: {Authorization: "Bearer " + getToken()},
});

const unpack = reactive({
  // 是否显示弹出层
  open: false,
  // 弹出层标题
  title: "",
  // 设置请求头部
  // headers: {Authorization: "Bearer " + getToken()},
});

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    kddh: null,
    qsyz: null,
    sfda: null,
    xm: null,
    ksh: null,
    sfzh: null,
    status: null,
  },
  rules: {
    kddh: { required: true, trigger: "blur", message: "请输入快递单号" },
    qsyz: { required: true, trigger: "blur", message: "请选择签收验证" },
  },
  verifyFrom: {},
});

const { queryParams, form, rules, verifyFrom } = toRefs(data);

/** 查询邮寄档案列表 */
function getList() {
  loading.value = true;
  listEms(queryParams.value).then((response) => {
    emsList.value = response.rows;
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
    id: null,
    kddh: null,
    qsyz: 0,
    sfda: 0,
    xm: null,
    ksh: null,
    sfzh: null,
    status: 0,
    createBy: null,
    updateBy: null,
    remark: null,
    updateTime: null,
    createTime: null,
  };
  proxy.resetForm("emsRef");
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
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加邮寄档案";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value;
  getEms(id).then((response) => {
    form.value = response.data;
    open.value = true;
    title.value = "修改邮寄档案";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["emsRef"].validate((valid) => {
    if (valid) {
      if (form.value.id != null) {
        updateEms(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEms(form.value).then((response) => {
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
  const emsIds = row.id || ids.value;
  proxy.$modal
    .confirm('是否确认删除邮寄档案ID为"' + emsIds + '"的数据项？')
    .then(function () {
      return delEms(emsIds);
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
    "archives/ems/export",
    {
      ...queryParams.value,
    },
    `ems_${new Date().getTime()}.xlsx`
  );
}

function handleVerify() {
  verify.title = "签收验证辅助";
  verify.open = true;
}

function handleUnpack() {
  unpack.title = "拆袋录入辅助";
  unpack.open = true;
}

/** 导入按钮操作 */
function handleImport() {
  upload.title = "快递单号导入";
  upload.open = true;
}

/** 下载模板操作 */
function importTemplate() {
  proxy.download(
    "archives/ems/importTemplate",
    {},
    `archives_ems_${new Date().getTime()}.xlsx`
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

/** 根据快递单号修改状态，小概率事件，快递单号被重复使用会出现多数据情况  */
function submitVerifyForm() {
  proxy.$refs["verifyRef"].validate((valid) => {
    if (valid) {
      console.log(verifyFrom.value);
      // updateEms({...verifyFrom.value, id: 19}).then((response) => {
      verifyKddh(verifyFrom.value).then((response) => {
        console.log(response);
        if (response.data.id != null) {
          verify.msgType = "success";
          verify.msg =
            "单号 " +
            response.data.kddh +
            " 操作成功, 序号ID " +
            response.data.id;
        } else {
          verify.msgType = "error";
          verify.msg = "单号 " + response.data.kddh + " 不存在";
        }
        verifyFrom.value.kddh = null;
      });
    }
  });
}

/** 辅助操作 关闭model回调 */
function handleModelClass() {
  getList();
}

getList();
</script>
