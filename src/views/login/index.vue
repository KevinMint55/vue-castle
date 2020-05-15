<template>
  <sign submitText="登录" tipText="还没有账号？立即注册" linkPath="/register" @submit="submit"/>
</template>

<script>
import Sign from 'components/Sign';
import { login } from 'apis/user';

export default {
  components: {
    Sign,
  },
  data() {
    return {
    };
  },
  methods: {
    submit(form) {
      if (!form.username) {
        this.$message.warning('请输入用户名');
        return;
      }
      if (!form.password) {
        this.$message.warning('请输入密码');
        return;
      }
      this.loading = true;
      login(form).then((res) => {
        this.$log(res);
        localStorage.userinfo = JSON.stringify(res);
        this.$router.push({ path: '/list' });
      }).catch(() => {
      }).finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="less" module="s">
</style>
