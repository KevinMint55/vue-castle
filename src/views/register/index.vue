<template>
  <sign
    submitText="注册"
    tipText="已经有账号了？立即登录"
    linkPath="/login"
    @submit="submit"
  />
</template>

<script>
import Sign from 'components/Sign';
import { register } from 'apis/user';
import { ObjEncrypt } from 'utils';

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
      if (!this.$regExp(form.password, 'pw')) {
        this.$message.warning('请输入6-16位数字、英文、下划线密码');
        return;
      }
      this.loading = true;
      register(form).then((res) => {
        localStorage.userinfo = ObjEncrypt(res);
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
