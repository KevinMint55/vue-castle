import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './action';
import getters from './getters';

Vue.use(Vuex);

const state = {
  userinfo: {}, // 用户信息
  tableHeight: null,
  groups: [],
  socket: null,
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});
