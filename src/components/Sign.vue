<template>
  <div id="app">
    <div class="login-wrap">
      <div class="logo-title">
        <i></i>
        <span>Castle</span>
      </div>
      <div class="login-content">
        <div class="form">
          <div class="form-item">
            <input type="text" v-model="form.username" placeholder="请输入账号" maxlength="16" @keyup.enter="submit">
          </div>
          <div class="form-item">
            <input type="password" v-model="form.password" placeholder="请输入6-16位数字、英文、下划线密码" maxlength="16" @keyup.enter="submit">
          </div>
          <el-button type="primary" size="medium" style="width: 100%;" @click="submit" :loading="loading">{{ submitText }}</el-button>
        </div>
        <div class="tips">
          <router-link :to="linkPath">{{ tipText }}</router-link>
        </div>
      </div>
    </div>
    <footer class="copyright">
      <span>版权所有</span>
      &nbsp;&nbsp;
      <a href="http://www.miitbeian.gov.cn" target="_blank">粤ICP备17065042号</a>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    submitText: {
      type: String,
    },
    tipText: {
      type: String,
    },
    linkPath: {
      type: String,
      default: '/login',
    },
  },
  data() {
    return {
      form: {
      },
      loading: false,
    };
  },
  methods: {
    submit() {
      this.$emit('submit', this.form);
    },
  },
};
</script>

<style lang="less" scoped>
.login-wrap {
  width: 100%;
  height: 100%;
  .flex();
  flex-direction: column;
  .bg("/static/img/bg1.png");
}

.logo-title {
  text-align: center;
  font-size: 32px;
  margin-bottom: 20px;
  color: @text-blue;
  i {
    display: inline-block;
    width: 48px;
    height: 48px;
    .bg("/static/img/castle.png");
    vertical-align: middle;
    margin-right: 10px;
  }
}

.login-content {
  width: 400px;
  padding: 20px 30px;
  background-color: rgba(255, 255, 255, 0.4);
  box-shadow: @shadow;
  border-radius: 5px;
  .form-item {
    margin-bottom: 20px;
    input {
      width: 100%;
      height: 36px;
      text-indent: 8px;
      border-radius: 4px;
      border: 1px solid @bd;
      transition: all 1s;
      &:focus {
        border-color: @text-blue;
      }
    }
  }
}

.tips {
  margin-top: 20px;
  color: #606266;
  transition: all 0.5s;
  text-align: center;
  &:hover {
    color: #000;
  }
}

.copyright {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 100;
  .flex();
  width: 100%;
  height: 40px;
  font-size: 12px;
  color: #fff;
  background: @bg;
  a {
    color: #fff;
    &:hover {
      color: @text-blue;
    }
  }
}
</style>
