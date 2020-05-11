export default {
  setUserinfo(state, userinfo) {
    state.userinfo = userinfo;
  },
  setTableHeight(state, height) {
    state.tableHeight = height - 200;
  },
  setSocket(state, socket) {
    state.socket = socket;
  },
};
