<template>
  <sign submitText="注册" tipText="已经有账号了？立即登录" linkPath="/login" @submit="submit"/>
</template>

<script>
import Sign from 'components/Sign';
import { register } from 'apis/user';
// eslint-disable-next-line import/extensions
import $projectConfig from '$projectConfig';

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
      console.log($projectConfig);
      if (!form.username) {
        this.$message.warning('请输入用户名');
        return;
      }
      if (!form.password) {
        this.$message.warning('请输入密码');
        return;
      }
      if (!this.$regExp(this.form.password, 'pw')) {
        this.$message.warning('请输入6-16位数字、英文、下划线密码');
        return;
      }
      this.loading = true;
      register(form).then((res) => {
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
