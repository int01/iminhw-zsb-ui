<template>
  <div class="app-container">
    <el-form
        :model="queryParams"
        ref="queryRef"
        :inline="true"
        v-show="showSearch"
        label-width="70px"
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
      <el-form-item label="档案袋" prop="dadqk">
        <el-select v-model="queryParams.dadqk" placeholder="请选择档案袋" clearable>
          <el-option
              v-for="dict in class_file_cover_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
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
        </el-button
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
        >新增
        </el-button
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
        >修改
        </el-button
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
        >删除
        </el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['archives:class:export']"
        >导出
        </el-button
        >
      </el-col>
      <!-- 导入数据（主要导入分班数据） -->
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Upload"
            @click="handleImport"
            v-hasPermi="['archives:class:import']"
        >
          <el-tooltip
              class="box-item"
              effect="dark"
              content="主要使用场景是导入分班数据"
              placement="top"
          >导入
          </el-tooltip>
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Postcard"
            @click="handleCollect"
            v-hasPermi="['archives:class:collect']"
        >现场收集
        </el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="info"
            plain
            icon="Printer"
            v-hasPermi="['archives:class:print']"
            @click="handlePrintDialog"
        >
          <el-tooltip
              class="box-item"
              effect="dark"
              content="当变成两页时请更换其他浏览器，原因：谷歌浏览器最小字体为12px"
              placement="top"
          >打印
          </el-tooltip>
        </el-button
        >
      </el-col>
      <!-- <div id="printTable"></div> -->

      <right-toolbar
          v-model:showSearch="showSearch"
          @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
        v-loading="loading"
        :data="classList"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column
          label="学号"
          min-width="100"
          fixed
          align="center"
          sortable="custom"
          prop="xuehao"
      />
      <el-table-column
          label="档案序号"
          min-width="90"
          fixed
          align="center"
          prop="xh"
      />
      <el-table-column
          label="班级"
          sortable="custom"
          min-width="100"
          align="center"
          prop="bj"
      />
      <el-table-column
          label="姓名"
          sortable="custom"
          min-width="100"
          align="center"
          prop="xm"
      />
      <el-table-column label="档案状态" align="center" prop="dazt">
        <template #default="scope">
          <dict-tag :options="archives_class_status" :value="scope.row.dazt"/>
        </template>
      </el-table-column>
      <el-table-column
          label="考生号"
          min-width="135"
          align="center"
          prop="ksh"
      />
      <!-- <el-table-column label="身份证号" align="center" prop="sfzh" /> -->
      <el-table-column label="数据状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="data_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      <el-table-column
          label="操作"
          fixed="right"
          min-width="150"
          align="center"
          v-hasPermi="['archives:class:edit', 'archives:class:remove']"
          class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['archives:class:edit']"
          >修改
          </el-button
          >
          <el-button
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['archives:class:remove']"
          >删除
          </el-button
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
          <el-input v-model="form.xh" placeholder="请输入档案序号"/>
        </el-form-item>
        <el-form-item label="班级" prop="bj">
          <el-input v-model="form.bj" placeholder="请输入班级"/>
        </el-form-item>
        <el-form-item label="姓名" prop="xm">
          <el-input v-model="form.xm" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item label="考生号" prop="ksh">
          <el-input v-model="form.ksh" placeholder="请输入考生号"/>
        </el-form-item>
        <el-form-item label="档案状态" prop="dazt">
          <el-radio-group v-model="form.dazt">
            <el-radio
                v-for="dict in archives_class_status"
                :key="dict.value"
                :label="parseInt(dict.value)"
            >{{ dict.label }}
            </el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号" prop="sfzh">
          <el-input v-model="form.sfzh" placeholder="请输入身份证号"/>
        </el-form-item>
        <el-form-item label="档案袋" prop="dadqk">
          <el-select v-model="form.dadqk" placeholder="请选择档案袋情况">
            <el-option
                v-for="dict in class_file_cover_status"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
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
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip">
              <el-checkbox v-model="upload.updateSupport"/>
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

    <!-- 打印小工具 -->
    <el-dialog
        :title="print.title"
        v-model="print.open"
        width="300px"
        append-to-body
        draggable
    >
      <el-form ref="printRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="班级" prop="bj">
          <el-input v-model="form.bj" placeholder="请输入班级"/>
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
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handlePrint">确 定</el-button>
          <el-button @click="print.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
        :title="collect.title"
        v-model="collect.open"
        fullscreen
        append-to-body
    >
      <!-- 
       width="60%" -->
      <el-form
          ref="collectQueryRef"
          :model="queryParams"
          :inline="true"
          label-width="70px"
      >
        <el-form-item label="学号" prop="xuehao">
          <el-input
              v-model="queryParams.xuehao"
              placeholder="请输入学号"
              clearable
              @keyup.enter="handleGetInfoBycollect"
          />
        </el-form-item>
        <el-form-item label="考生号" prop="ksh">
          <el-input
              v-model="queryParams.ksh"
              placeholder="请输入考生号"
              clearable
              @keyup.enter="handleGetInfoBycollect"
          />
        </el-form-item>
        <el-form-item label="身份证号" prop="sfzh">
          <el-input
              v-model="queryParams.sfzh"
              placeholder="请输入身份证号"
              clearable
              @keyup.enter="handleGetInfoBycollect"
          />
        </el-form-item>
        <el-form-item>
          <el-button
              type="primary"
              icon="Search"
              @click="handleGetInfoBycollect"
          >搜索
          </el-button
          >
          <!-- <el-button icon="Refresh" @click="proxy.resetForm('collectQueryRef')">一键清空</el-button> -->
        </el-form-item>
      </el-form>
      <el-button @click="collect.innerOpen = true"
      >打开最近的一个查询
      </el-button
      >
      <el-dialog
          v-model="collect.innerOpen"
          width="600px"
          append-to-body
          draggable
          title="基本信息"
      >
        <el-form :model="form" ref="sceneRef" :rules="rules" label-width="100px">
          <el-row>
            <!-- <el-col :span="8">
              <img
                :src="defAva"
                alt=""
                style="height: 32mm; width: 26mm; margin-left: 60px"
              />
            </el-col> -->
            <el-col :span="8">
              <el-form-item label="姓名:">{{ form.xm }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="班级:"
              >
                <el-tag>{{ form.bj }}</el-tag>
              </el-form-item
              >
            </el-col>
            <el-col :span="8">
              <el-form-item label="档案序号:"
              >
                <el-tag>{{ form.xh }}</el-tag>
              </el-form-item
              >
            </el-col>
            <el-col :span="12">
              <el-form-item label="学号:">{{ form.xuehao }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="考生号:">{{ form.ksh }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证号:">{{ form.sfzh }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="档案袋" prop="dadqk">
                <el-select v-model="form.dadqk" placeholder="请选择档案袋情况">
                  <el-option
                      v-for="dict in class_file_cover_status"
                      :key="dict.value"
                      :label="dict.label"
                      :value="parseInt(dict.value)"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input
                    v-model="form.remark"
                    type="textarea"
                    placeholder="请输入备注"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-tooltip
                class="box-item"
                effect="dark"
                content="仅修改班级档案里面的档案状态为“已提交”"
                placement="top"
            >
              <el-button type="primary" @click="updateClassDazt"
              >确 定
              </el-button
              >
            </el-tooltip>
            <el-tooltip
                class="box-item"
                effect="dark"
                content="修改班级档案里面的档案状态为“已提交”，并放入缓存供查阅"
                placement="top"
            >
              <el-button type="warning" @click="addClassTemp">暂 缓</el-button>
            </el-tooltip>
            <el-button @click="collect.innerOpen = false">关 闭</el-button>
          </div>
        </template
        >
      </el-dialog>
      <template #footer>
        <div class="dialog-footer">
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
  getClassListByBj,
  getClassBycollect,
} from "@/api/archives/class";
import {addClasstemp} from "@/api/archives/classtemp";
// import defAva from "@/assets/images/profile.jpg";
import {getToken} from "@/utils/auth";
import printJS from "@/utils/print";
import {ElMessage} from "element-plus";

const {proxy} = getCurrentInstance();
const {data_status, archives_class_status, class_file_cover_status} = proxy.useDict(
    "data_status",
    "archives_class_status",
    "class_file_cover_status"
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

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    orderByColumn: "create_time",
    isAsc: "desc",
    xuehao: null,
    bj: null,
    xm: null,
    dazt: null,
    ksh: null,
    sfzh: null,
    dadqk: null,
    status: null,
  },
  rules: {
    xuehao: [{required: true, message: "学号不能为空", trigger: "blur"}],
    xh: [{required: true, message: "档案序号不能为空", trigger: "blur"}],
    xm: [{required: true, message: "姓名不能为空", trigger: "blur"}],
    bj: [{required: true, message: "班级不能为空", trigger: "blur"}],
    ksh: [{required: true, message: "考生号不能为空", trigger: "blur"}],
    dazt: {required: true, trigger: "change", message: "请选择档案状态"},
    dadqk: {required: true, trigger: "change", message: "请选择档案袋情况"},
  },
});

const {queryParams, form, rules} = toRefs(data);

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
  headers: {Authorization: "Bearer " + getToken()},
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/archives/class/importData",
});

const collect = reactive({
  open: false,
  innerOpen: false,
  title: "",
});

const print = reactive({
  open: false,
  title: "打印辅助小工具",
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
    dadqk: 1,
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

/** 排序触发事件 */
function handleSortChange(column, prop, order) {
  queryParams.value.orderByColumn = column.prop;
  queryParams.value.isAsc = column.order;
  getList();
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
      .catch(() => {
      });
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
      {dangerouslyUseHTMLString: true}
  );
  getList();
};

/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
}

/** 打开档案收集框 */
function handleCollect() {
  collect.open = true;
}

function handlePrintDialog() {
  reset();
  print.open = true;
}

function handlePrint() {
  proxy.$refs["printRef"].validate((valid) => {
    if (valid) {
      getClassListByBj(form.value).then((response) => {
        const someJSONdata = response.data || [];
        // 如果不用翻译和不在意打印出来的是null，可直接使用 JSONdata
        // const someJSONdata = [];
        // for (const index in JSONdata) {
        //   someJSONdata.push({
        //     xh: JSONdata[index].xh,
        //     xm: JSONdata[index].xm,
        //     dazt: 0,//archives_class_status
        //     // sfzh: JSONdata[index].sfzhm,
        //     remark: JSONdata[index].remark,
        //   })
        // }
        const bj = form.value.bj;

        printJS({
          printable: someJSONdata,
          // columnSize: '10%'
          properties: [
            {field: "xh", displayName: "序号", columnSize: "5%"},
            {field: "xm", displayName: "姓名", columnSize: "20%"},
            {field: "xuehao", displayName: "学号"},
            {
              field: "dazt",
              displayName: "档案提交情况",
              columnSize: "15%",
              dictOptions: archives_class_status,
            },
            // { field: "sfzh", displayName: "身份证号" },
            {field: "remark", displayName: "备注"},
          ],
          type: "json",
          header: `<div style="width: 100%; text-align: center;">
                        <div style="font-size:14px">${bj}班入学档案提交情况</div>
                        <div style="float: right; font-size: 12px; margin-bottom: 2px; margin-top: -6px">总份数: _______________</div>
                    </div>`,
          documentTitle: `${bj}班入学档案提交情况`,
          gridHeaderStyle:
              "border: 1px solid #A8ABB2;text-align:center; font-family: '宋体'; font-size: 12px;",
          gridStyle:
              "border: 1px solid #A8ABB2;text-align:center; font-family: '宋体'; font-size: 12px;",
          style: "@page {margin:5mm 10mm}",
          font_size: "5px",
        });
      });
    }
  });
  // 谷歌浏览器的最小字体是12px，目前没有好的方案，禁止使用 -webkit-transform:scale(0.8); 或类似方案。
  // 如果变成两张纸的情况，更换浏览器即可。
  // 直接打印html的方法
  // printJS({
  //   printable: "printTable",
  //   type: "html",
  //   header: null,
  //   targetStyles: ["*"],
  //   style: "@page {margin:0 10mm}",
  // });
}

function handleGetInfoBycollect() {
  proxy.$refs["collectQueryRef"].validate(() => {
    const serchFrom = queryParams.value;
    if (
        serchFrom.ksh != null ||
        serchFrom.xuehao != null ||
        serchFrom.sfzh != null
    ) {
      getClassBycollect(serchFrom).then((response) => {
        form.value = response.data;
        collect.innerOpen = true;
        proxy.resetForm("collectQueryRef");
      });
    } else {
      ElMessage.error("没有任何输入");
    }
  });
}

function updateClassDazt() {
  proxy.$refs["sceneRef"].validate((valid) => {
    if (valid) {
      const updateForm = form.value;
      updateForm.dazt = 1;
      const remkTemp = updateForm.remark;
      updateForm.remark = `${remkTemp}，现场收集`;
      updateClass(updateForm).then((response) => {
        proxy.$modal.msgSuccess("修改档案状态成功");
        collect.innerOpen = false
      });
    }
  });
}

function addClassTemp() {
  updateClassDazt();
  const updateForm = form.value;
  updateForm.dazt = 1;
  addClasstemp(updateForm).then((response) => {
    proxy.$modal.msgSuccess("新增到缓存成功");
  });
}

getList();
</script>
