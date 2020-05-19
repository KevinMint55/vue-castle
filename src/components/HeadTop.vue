<template>
  <div>
    <header class="header">
      <div class="left" v-clickoutside="hideProject" :class="{ active: showProject}">
        <div class="bar" @click="showProject = !showProject">
          <span>切换项目</span>
          <i class="iconfont km-down"></i>
        </div>
        <ul class="dropdown-menu">
          <li v-for="group in $store.state.groups" :key="group._id">
            <h3>{{ group.name }}</h3>
            <ul class="project-wrapper">
              <li class="project" v-for="project in group.projects" :key="project._id" @click="switchProject(project._id)">{{ project.name }}</li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="center">
        <router-link to="/list">
          <img src="/static/img/castle.png" alt="">
        </router-link>
      </div>
      <div class="right">
        <div class="user" v-clickoutside="hideMenu" :class="{ active: showMenu}" @click="showMenu = !showMenu">
          <img :src="setCdn($store.state.userinfo.avatar)" alt="">
          <span>{{ $store.state.userinfo.nickname }}</span>
          <i class="iconfont km-down"></i>
          <ul class="dropdown-menu">
            <li @click="openInfoModal">修改资料</li>
            <li @click="pwdModal = true;">修改密码</li>
            <li @click="quit">退出</li>
          </ul>
        </div>
      </div>
    </header>
    <el-dialog title="修改资料" :visible.sync="infoModal" width="440px">
      <el-form ref="info" :model="infoForm" :rules="infoRules" label-width="100px">
        <el-form-item label="账号" prop="username">
          <el-input v-model="infoForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model.trim="infoForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <p class="avatar-notice">支持jpg、png格式大小1M以内的图片</p>
          <div class="avatar-wrap">
            <img :src="infoForm.avatar" alt="avatar">
            <span>
              <i class="iconfont km-zhaopian"></i>
              <input type="file" @change="handleChange" accept="image/gif,image/jpeg,image/jpg,image/png" ref="avatar">
            </span>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="infoModal = false">取 消</el-button>
        <el-button type="primary" @click="infoSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改密码" :visible.sync="pwdModal" width="440px" @close="$refs.pwd.resetFields()">
      <el-form ref="pwd" :model="pwdForm" :rules="pwdRules" label-width="100px">
        <el-form-item label="原始密码" prop="oldPwd">
          <el-input type="password" v-model.trim="pwdForm.oldPwd" placeholder="请输入原密码" maxlength="16"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input type="password" v-model.trim="pwdForm.newPwd" placeholder="请输入6-16位数字、英文、下划线密码" maxlength="16"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input type="password" v-model.trim="pwdForm.confirmPwd" placeholder="请再次输入密码" maxlength="16"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="pwdModal = false">取 消</el-button>
        <el-button type="primary" @click="pwdSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Io from 'socket.io-client';
import { setCdn } from 'utils';
import { updatePassword, updateInfo } from 'apis/user';
import $projectConfig from '$projectConfig';

const socket = new Io(`${$projectConfig.apiBaseURL}/`, {
  path: '/api/ws',
  query: {
    userId: JSON.parse(localStorage.userinfo)._id,
  },
});

export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (!this.$regExp(value, 'pw')) {
        callback(new Error('请输入正确格式密码'));
      } else {
        if (this.pwdForm.confirmPwd !== '') {
          this.$refs.pwd.validateField('confirmPwd');
        }
        callback();
      }
    };

    const validatePassConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.pwdForm.newPwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      showProject: false,
      showMenu: false,
      infoModal: false,
      infoForm: {
        file: null,
        avatar: '',
      },
      infoRules: {
        username: { required: true, message: '请输入账号', trigger: 'blur' },
        nickname: { required: true, message: '请输入昵称', trigger: 'blur' },
      },

      pwdModal: false,
      pwdForm: {
        oldPwd: '',
        newPwd: '',
        confirmPwd: '',
      },
      pwdRules: {
        oldPwd: [
          { validator: validatePass, trigger: 'blur' },
        ],
        newPwd: [
          { validator: validatePass, trigger: 'blur' },
        ],
        confirmPwd: [
          { validator: validatePassConfirm, trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    if (localStorage.userinfo) {
      this.$store.commit('setUserinfo', JSON.parse(localStorage.userinfo));
      this.$store.commit('setSocket', socket);
    }
    this.getGroups();
  },
  mixins: [setCdn],
  methods: {
    switchProject(id) {
      this.showProject = false;
      this.$router.replace({ path: `/tables/${id}` });
    },
    getGroups() {
      this.$store.dispatch('getGroups');
    },
    hideProject() {
      this.showProject = false;
    },
    hideMenu() {
      this.showMenu = false;
    },
    openInfoModal() {
      this.infoForm.username = this.$store.state.userinfo.username;
      this.infoForm.nickname = this.$store.state.userinfo.nickname;
      this.infoForm.avatar = this.setCdn(this.$store.state.userinfo.avatar);
      this.infoModal = true;
    },
    // 出来图片的改变
    handleChange(e) {
      const file = e.target.files[0] || e.dataTransfer.files[0];
      if (!file) return;
      // 筛选文件格式
      const types = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
      if (file && !types.includes(file.type)) {
        this.$Message.warning('只支持jpg、jpeg、gif和png格式');
        e.target.value = '';
        return;
      }
      const size = file.size / 1024 / 1024;
      if (size > 1) {
        this.$message.warning('图片不能大于1M');
        return;
      }
      this.infoForm.file = file;
      this.$refs.avatar.value = '';
      window.URL = window.URL || window.webkitURL;
      const img = new Image();
      const url = window.URL.createObjectURL(file);
      img.src = url;
      img.onload = () => {
        this.infoForm.avatar = url;
        // window.URL.revokeObjectURL(img.src);
      };
    },
    infoSubmit() {
      this.$refs.info.validate((valid) => {
        if (valid) {
          updateInfo(this.infoForm).then((res) => {
            localStorage.userinfo = JSON.stringify(res);
            this.$store.commit('setUserinfo', res);
            this.infoModal = false;
            this.$message.success('修改成功！');
          }).catch(() => {
          });
        } else {
          this.$message.warning('请输入完整信息');
        }
      });
    },
    pwdSubmit() {
      this.$refs.pwd.validate((valid) => {
        if (valid) {
          updatePassword(this.pwdForm).then(() => {
            this.pwdModal = false;
            this.$message.success('修改成功！');
          }).catch(() => {
          });
        } else {
          this.$message.warning('请输入完整信息');
        }
      });
    },
    quit() {
      localStorage.clear();
      this.$router.push({ path: '/login' });
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  .flex(space-between);
  width: 100%;
  height: 40px;
  padding: 0 30px;
  background: #161c21;
  border-bottom: 2px solid;
  border-image: linear-gradient(to right, #13303a, #a5bf50) 30 30;
  > div {
    height: 100%;
  }
}

.left {
  .bar {
    display: flex;
    align-items: center;
    height: 40px;
    color: #fff;
    cursor: pointer;
    i {
      font-size: 18px;
      transition: all 0.3s;
      margin-left: 4px;
    }
  }
  .dropdown-menu {
    top: 36px;
    left: 30px;
    width: 200px;
    padding: 6px 0;
    h3 {
      color: #919ba7;
      padding: 6px 12px;
      font-size: 12px;
    }
    .project {
      color: #667689;
      cursor: pointer;
      padding: 4px 24px;
      &:hover {
        color: #fff;
        background-color: @text-blue;
      }
    }
  }
  &.active {
    .dropdown-menu {
      transform: rotateX(0);
    }
    .bar {
      i {
        transform: rotate(180deg);
      }
    }
  }
}

.center {
  display: flex;
  align-items: center;
  font-size: 0;
  img {
    width: 28px;
    height: 28px;
  }
}

.right {
  display: flex;
  align-items: center;
  .user {
    display: flex;
    align-items: center;
    color: #919ba7;
    height: 100%;
    cursor: pointer;
    img {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      margin-right: 10px;
    }
    i {
      font-size: 18px;
      margin-left: 4px;
      transition: all 0.3s;
    }
    .dropdown-menu {
      top: 36px;
      right: 30px;
      li {
        padding: 8px 16px;
        &:hover {
          background-color: #f3f4f5;
          cursor: pointer;
        }
      }
    }
    &.active {
      color: #fff;
      .dropdown-menu {
        transform: rotateX(0);
      }
      i {
        transform: rotate(180deg);
      }
    }
  }
}

.dropdown-menu {
  position: absolute;
  z-index: 10;
  width: 120px;
  color: #333;
  background: #fff;
  box-shadow: @shadow;
  transform: rotateX(90deg);
  transition: all 0.3s;
  transform-origin: top center;
}

.avatar-wrap {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  &:hover {
    span {
      opacity: 1;
    }
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  span {
    .flex();
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    opacity: 0;
    transition: all 0.3s;
    i {
      font-size: 28px;
    }
  }
  input {
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0;
    left: 0;
    top: 0;
    cursor: pointer;
  }
}

.avatar-notice {
  color: #aaa;
  font-size: 12px;
}
</style>
