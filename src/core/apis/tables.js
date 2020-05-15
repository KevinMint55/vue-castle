import ajax from '../ajax';

const prefix = '/tables';

// 4.1 创建表格
export const createTable = (args) => ajax.post(`${prefix}`, args);
// 4.2 删除表格
export const delTable = (args) => ajax.del(`${prefix}`, args);
// 4.3 表格重命名
export const renameTable = (args) => ajax.put(`${prefix}`, args);
// 4.4 获取表格列表
export const getTables = (args) => ajax.get(`${prefix}`, args);
// 4.5 获取表格详情
export const getTableDetails = (args) => ajax.get(`${prefix}/details`, args);
// 4.6 编辑表头
export const editColumns = (args) => ajax.post(`${prefix}/columns`, args);
// 4.7 复制表格
export const copyTable = (args) => ajax.post(`${prefix}/copy`, args);
