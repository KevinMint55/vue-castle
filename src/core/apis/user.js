import ajax from '../ajax';

const prefix = '/user';

// 1.1 用户登录
export const login = (args) => ajax.post(`${prefix}/login`, args);

// 1.2 用户注册
export const register = (args) => ajax.post(`${prefix}/register`, args);

// 1.3 修改资料
export const updateInfo = (args) => ajax.putForm(`${prefix}`, args);

// 1.4 修改密码
export const updatePassword = (args) => ajax.put(`${prefix}/password`, args);
