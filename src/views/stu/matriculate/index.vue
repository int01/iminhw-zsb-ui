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
      <el-form-item label="性别" prop="xb">
        <el-select v-model="queryParams.xb" placeholder="请选择性别" clearable>
          <el-option
            v-for="dict in sys_user_sex"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="录取专业" prop="zy">
        <el-input
          v-model="queryParams.zy"
          placeholder="请输入录取专业"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="省份" prop="dq">
        <el-input
          v-model="queryParams.dq"
          placeholder="请输入省份"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="批次" prop="pc">
        <el-select v-model="queryParams.pc" placeholder="请选择批次" clearable>
          <el-option
            v-for="dict in matriculate_pc"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="科类" prop="kl">
        <el-select v-model="queryParams.kl" placeholder="请选择科类" clearable>
          <el-option
            v-for="dict in matriculate_kl"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="中学名称" prop="zxmc">
        <el-input
          v-model="queryParams.zxmc"
          placeholder="请输入中学名称"
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
          v-hasPermi="['stu:matriculate:add']"
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
          v-hasPermi="['stu:matriculate:edit']"
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
          v-hasPermi="['stu:matriculate:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['stu:matriculate:export']"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Upload"
          @click="handleImport"
          v-hasPermi="['stu:matriculate:import']"
          >导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          plain
          @click="handleDwoMatExcl"
          v-hasPermi="['stu:matview:list']"
          >导出通知书数据
        </el-button>
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="matriculateList"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="考生号"
        fixed
        min-width="135"
        align="center"
        prop="ksh"
      />
      <el-table-column
        label="姓名"
        fixed
        min-width="100"
        sortable="custom"
        align="center"
        prop="xm"
      />
      <el-table-column
        label="身份证号"
        min-width="165"
        align="center"
        prop="sfzh"
      />
      <el-table-column
        label="录取专业"
        min-width="200"
        sortable="custom"
        align="center"
        prop="zy"
      />
      <el-table-column
        label="录取电话"
        min-width="110"
        align="center"
        prop="lxdh"
      />
      <el-table-column
        label="学籍省份"
        align="center"
        min-width="100"
        sortable="custom"
        prop="dq"
      />
      <!-- <el-table-column label="批次" align="center" prop="pc">
        <template #default="scope">
          <dict-tag :options="matriculate_pc" :value="scope.row.pc" />
        </template>
      </el-table-column>
      <el-table-column label="科类" align="center" prop="kl">
        <template #default="scope">
          <dict-tag :options="matriculate_kl" :value="scope.row.kl" />
        </template>
      </el-table-column>
      <el-table-column label="中学名称" align="center" prop="zxmc" />
      <el-table-column label="投档成绩" align="center" prop="tdcj" /> -->
      <el-table-column label="数据状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="data_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        sortable="custom"
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
        v-hasPermi="['stu:matriculate:edit','stu:matriculate:remove']"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['stu:matriculate:edit']"
            >修改</el-button
          >
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['stu:matriculate:remove']"
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

    <!-- 添加或修改录取数据对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form
        ref="matriculateRef"
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
        <el-form-item label="身份证号" prop="sfzh">
          <el-input v-model="form.sfzh" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="姓名" prop="xm">
          <el-input v-model="form.xm" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="xb">
          <el-radio-group v-model="form.xb">
            <el-radio
              v-for="dict in sys_user_sex"
              :key="dict.value"
              :label="parseInt(dict.value)"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="录取专业" prop="zy">
          <el-input v-model="form.zy" placeholder="请输入录取专业" />
        </el-form-item>
        <el-form-item label="录取电话" prop="lxdh">
          <el-input v-model="form.lxdh" placeholder="请输入录取电话" />
        </el-form-item>
        <el-form-item label="省份" prop="dq">
          <el-input v-model="form.dq" placeholder="请输入考生学籍省份" />
        </el-form-item>
        <el-form-item label="批次" prop="pc">
          <el-select v-model="form.pc" placeholder="请选择批次">
            <el-option
              v-for="dict in matriculate_pc"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科类" prop="kl">
          <el-select v-model="form.kl" placeholder="请选择科类">
            <el-option
              v-for="dict in matriculate_kl"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="中学名称" prop="zxmc">
          <el-input v-model="form.zxmc" placeholder="请输入中学名称" />
        </el-form-item>
        <el-form-item label="投档成绩" prop="tdcj">
          <el-input
            type="number"
            v-model="form.tdcj"
            placeholder="请输入投档成绩"
          />
        </el-form-item>
        <el-form-item label="邮寄地址" prop="dz">
          <el-input v-model="form.dz" placeholder="请输入邮寄地址" />
        </el-form-item>
        <el-form-item label="序号" prop="xh">
          <el-input v-model="form.xh" placeholder="请输入录取流水号" />
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
  </div>
</template>

<script setup name="Matriculate">
import {
  listMatriculate,
  getMatriculate,
  delMatriculate,
  addMatriculate,
  updateMatriculate,
} from "@/api/stu/matriculate";
import { ElMessage, ElMessageBox } from "element-plus";
import router from "@/router";
import { getToken } from "@/utils/auth";

const { proxy } = getCurrentInstance();
const { data_status, sys_user_sex, matriculate_pc, matriculate_kl } =
  proxy.useDict(
    "data_status",
    "sys_user_sex",
    "matriculate_pc",
    "matriculate_kl"
  );

const matriculateList = ref([]);
const open = ref(false);
const addFlag = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const daterangeCreateTime = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    orderByColumn: "create_time",
    isAsc: "desc",
    ksh: null,
    sfzh: null,
    xm: null,
    xb: null,
    zy: null,
    dq: null,
    pc: null,
    kl: null,
    zxmc: null,
    status: null,
    createTime: null,
  },
  rules: {
    ksh: [{ required: true, message: "考生号不能为空", trigger: "blur" }],
    sfzh: [{ required: true, message: "身份证号不能为空", trigger: "blur" }],
    xm: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
    zy: [{ required: true, message: "录取专业不能为空", trigger: "blur" }],
    lxdh: [{ required: true, message: "录取电话不能为空", trigger: "blur" }],
    xb: { required: true, trigger: "change", message: "请选择性别" },
    dq: [{ required: true, message: "省份不能为空", trigger: "blur" }],
    pc: [{ required: true, message: "批次不能为空", trigger: "change" }],
    kl: [{ required: true, message: "科类不能为空", trigger: "change" }],
    zxmc: [{ required: true, message: "中学名称不能为空", trigger: "blur" }],
    tdcj: [{ required: true, message: "录取分数不能为空", trigger: "blur" }],
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
  url: import.meta.env.VITE_APP_BASE_API + "/stu/matriculate/importData",
});

/** 查询录取数据列表 */
function getList() {
  loading.value = true;
  queryParams.value.params = {};
  if (null != daterangeCreateTime && "" != daterangeCreateTime) {
    queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0];
    queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1];
  }
  listMatriculate(queryParams.value).then((response) => {
    matriculateList.value = response.rows;
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
    sfzh: null,
    xm: null,
    xb: 0,
    zy: null,
    lxdh: null,
    dz: null,
    xh: null,
    dq: null,
    pc: null,
    kl: null,
    zxmc: null,
    tdcj: null,
    status: 0,
    createBy: null,
    updateBy: null,
    remark: null,
    updateTime: null,
    createTime: null,
  };
  proxy.resetForm("matriculateRef");
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
  ids.value = selection.map((item) => item.ksh);
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
  title.value = "添加录取数据";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  addFlag.value = false;
  reset();
  const ksh = row.ksh || ids.value;
  getMatriculate(ksh).then((response) => {
    form.value = response.data;
    open.value = true;
    title.value = "修改录取数据";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["matriculateRef"].validate((valid) => {
    if (valid) {
      if (!addFlag.value) {
        updateMatriculate(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addMatriculate(form.value).then((response) => {
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
  const kshs = row.ksh || ids.value;
  proxy.$modal
    .confirm('是否确认删除录取数据考生号为"' + kshs + '"的数据项？')
    .then(function () {
      return delMatriculate(kshs);
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
    "stu/matriculate/export",
    {
      ...queryParams.value,
    },
    `matriculate_${new Date().getTime()}.xlsx`
  );
}

/** 导入按钮操作 */
function handleImport() {
  upload.title = "录取数据导入";
  upload.open = true;
}

/** 下载模板操作 */
function importTemplate() {
  proxy.download(
    "stu/matriculate/importTemplate",
    {},
    `stu_matriculate_${new Date().getTime()}.xlsx`
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

function handleDwoMatExcl() {
  const obj = { path: "/stu/matview" };
  ElMessageBox.confirm(
    "即将进入“通知书数据”。输入查询条件点击查询，点击导出即可导出指定数据（默认导出全部数据）。",
    "温馨提示",
    {
      confirmButtonText: "知道了",
      cancelButtonText: "我不行",
      type: "info",
    }
  )
    .then(() => {
      router.push(obj);
    })
    .catch(() => {
      // ElMessage({
      //   type: 'info',
      //   message: 'Delete canceled',
      // })
    });
}

getList();
</script>
