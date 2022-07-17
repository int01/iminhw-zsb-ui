import request from "@/utils/request";

// 查询专业学院配置列表
export function listStuxyzy(query) {
  return request({
    url: "/stu/stuxyzy/list",
    method: "get",
    params: query,
  });
}

// 查询专业学院配置详细
export function getStuxyzy(zy) {
  return request({
    url: "/stu/stuxyzy/" + zy,
    method: "get",
  });
}

// 新增专业学院配置
export function addStuxyzy(data) {
  return request({
    url: "/stu/stuxyzy",
    method: "post",
    data: data,
  });
}

// 修改专业学院配置
export function updateStuxyzy(data) {
  return request({
    url: "/stu/stuxyzy",
    method: "put",
    data: data,
  });
}

// 删除专业学院配置
export function delStuxyzy(zy) {
  return request({
    url: "/stu/stuxyzy/" + zy,
    method: "delete",
  });
}
