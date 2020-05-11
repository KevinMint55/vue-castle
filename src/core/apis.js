/**
 * [apis]
 * @author Kevin on 2018/05/16.
 */

import {
  get,
  post,
  put,
  putForm,
  del,
} from 'ajax';

export default {
  // 1.1 用户登录
  login: (args) => post('user/login', args),
  // 1.2 用户注册
  register: (args) => post('user/register', args),
  // 1.3 修改资料
  updateInfo: (args) => putForm('user', args),
  // 1.4 修改密码
  updatePassword: (args) => put('user/password', args),

  // 2.1 创建团队
  createGroup: (args) => post('groups', args),
  // 2.2 删除团队
  delGroup: (args) => del('groups', args),
  // 2.3 团队列表
  getGroups: (args) => get('groups', args),
  // 2.4 团队重命名
  renameGroup: (args) => put('groups', args),
  // 2.5 获取团队详情
  groupDetails: (args) => get('groups/details', args),
  // 2.6 邀请加入团队
  groupInvite: (args) => post('groups/invite', args),
  // 2.7 离开团队
  leaveGroup: (args) => del('groups/leave', args),

  // 3.1 创建项目
  createProject: (args) => post('projects', args),
  // 3.2 删除项目
  delProject: (args) => del('projects', args),
  // 3.3 项目重命名
  renameProject: (args) => put('projects', args),

  // 4.1 创建表格
  createTable: (args) => post('tables', args),
  // 4.2 删除表格
  delTable: (args) => del('tables', args),
  // 4.3 表格重命名
  renameTable: (args) => put('tables', args),
  // 4.4 获取表格列表
  getTables: (args) => get('tables', args),
  // 4.5 获取表格详情
  getTableDetails: (args) => get('tables/details', args),
  // 4.6 编辑表头
  editColumns: (args) => post('tables/columns', args),
  // 4.7 复制表格
  copyTable: (args) => post('tables/copy', args),

  // 5.1 创建视图
  createView: (args) => post('views', args),
  // 5.2 删除视图
  delView: (args) => del('views', args),
  // 5.3 视图重命名
  renameView: (args) => put('views', args),
  // 5.4 获取视图数据
  getView: (args) => get('views', args),
  // 5.5 更新视图数据
  updateViewData: (args) => post('views/data', args),
};
