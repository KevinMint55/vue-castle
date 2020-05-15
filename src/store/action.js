import { getGroups } from 'apis/groups';

export default {
  getGroups({ state }) {
    getGroups().then((res) => {
      state.groups = res;
    }).catch(() => {
    });
  },
};
