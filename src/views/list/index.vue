<template>
  <div class="page">
    <head-top></head-top>
    <div class="main">
      <ul class="group-wrapper">
        <li class="group" v-for="(item, index) in $store.state.groups" :key="index">
          <div class="title">
            <span>{{ item.name }}</span>
            <el-tooltip effect="dark" content="成员" placement="bottom">
              <i class="iconfont km-member" @click="groupDetails(item._id)"></i>
            </el-tooltip>
            <div class="setting" :class="{ active: setIndex === index }" v-clickoutside="hideMenu">
              <el-tooltip effect="dark" content="设置" placement="bottom">
                <i class="iconfont km-setting" @click.stop="setIndex = index"></i>
              </el-tooltip>
              <ul class="dropdown">
                <li @click.stop="renameGroup(item._id, item.name)">重命名</li>
                <li @click.stop="delGroup(item._id)" v-if="$store.state.userinfo._id === item.creator">删除</li>
                <li @click.stop="leaveGroup(item._id)" v-else>离开</li>
              </ul>
            </div>
          </div>
          <ul class="project-wrapper">
            <li class="project" v-for="project in item.projects" :key="project._id" @click="$router.push({ path: `tables/${project._id}`})">
              <h3 :title="project.name">{{ project.name }}</h3>
              <div class="bottom" :class="{ active: projectSetId === project._id }" v-clickoutside="hideProjectMenu">
                <p>{{ project.tables.length }}个表格</p>
                <el-tooltip effect="dark" content="设置" placement="bottom">
                  <i class="iconfont km-more" @click.stop="projectSetId = project._id"></i>
                </el-tooltip>
                <ul class="dropdown">
                  <li @click.stop="renameProject(item._id, project._id, project.name)">重命名</li>
                  <li @click.stop="delProject(item._id, project._id)">删除</li>
                </ul>
              </div>
            </li>
            <li class="add" @click="createProject(item._id)">
              <i class="iconfont km-plus"></i>
              <span>创建项目</span>
            </li>
          </ul>
        </li>
      </ul>
      <el-button type="success" @click="createGroup">创建团队</el-button>
    </div>
    <el-dialog
      title="团队成员"
      :visible.sync="memberModal"
      width="600px">
      <el-button type="success" size="small" style="margin-bottom: 10px;" v-if="!inviting" @click="inviting = true;">邀请新成员</el-button>
      <div class="inviting" v-else>
        <el-input v-model="inviteName" placeholder="请输入完整账号" size="small" style="width: 300px"></el-input>
        <div>
          <el-button type="text" size="small" @click="inviting = false;inviteName = '';" style="margin-right: 10px;">取消</el-button>
          <el-button type="success" size="small" @click="groupInvite">发起邀请</el-button>
        </div>
      </div>
      <div class="user-header">
        <div>名字</div>
        <div>身份</div>
      </div>
      <ul class="user-wrapper">
        <li class="user" v-for="user in curGroupUsers" :key="user._id">
          <div>
            <img :src="setCdn(user.user.avatar)" alt="">
            <span>{{ user.user.nickname }}</span>
            <span style="margin-left: 10px;color: #8aa891;font-size: 12px;" v-if="user.user._id === $store.state.userinfo._id">(这是你)</span>
          </div>
          <div>
            <span v-if="user.type === 'creator'">创建者</span>
            <span v-else-if="user.type === 'admin'">管理员</span>
            <span v-else>成员</span>
          </div>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>

<script>
import {
  createGroup, delGroup, leaveGroup, renameGroup, groupDetails, groupInvite,
} from 'apis/groups';
import { createProject, delProject, renameProject } from 'apis/projects';
import { setCdn } from 'utils';
import HeadTop from 'components/HeadTop';

export default {
  components: {
    HeadTop,
  },
  data() {
    return {
      setIndex: null,
      projectSetId: null,

      memberModal: false,
      curGroupUsers: [],

      inviting: false,
      inviteName: '',
      curGroupId: null,
    };
  },
  mixins: [setCdn],
  methods: {
    getGroups() {
      this.$store.dispatch('getGroups');
    },
    createGroup() {
      this.$prompt('创建团队', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '团队名称',
      }).then(({ value }) => {
        if (!value) {
          this.$message.error('请输入团队名称');
          return;
        }
        createGroup({
          name: value,
        }).then(() => {
          this.$message.success('创建成功！');
          this.getGroups();
        }).catch(() => {
        });
      }).catch(() => {
      });
    },
    hideMenu() {
      this.setIndex = null;
    },
    hideProjectMenu() {
      this.projectSetId = null;
    },
    delGroup(id) {
      this.$confirm('确定删除该团队?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        delGroup({
          id,
        }).then(() => {
          this.$message.success('删除成功！');
          this.getGroups();
        }).catch(() => { });
      }).catch(() => { });
    },
    leaveGroup(id) {
      this.$confirm('确定离开该团队?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        leaveGroup({
          id,
        }).then(() => {
          this.$message.success('离开成功！');
          this.getGroups();
        }).catch(() => { });
      }).catch(() => { });
    },
    renameGroup(id, name) {
      this.$prompt('重命名', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '团队名称',
        inputValue: name,
      }).then(({ value }) => {
        if (!value) {
          this.$message.error('请输入团队名称');
          return;
        }
        renameGroup({
          id,
          name: value,
        }).then(() => {
          this.$message.success('修改成功！');
          this.getGroups();
        }).catch(() => {
        });
      }).catch(() => {
      });
    },
    createProject(groupId) {
      this.$prompt('创建项目', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '项目名称',
      }).then(({ value }) => {
        if (!value) {
          this.$message.error('请输入项目名称');
          return;
        }
        createProject({
          groupId,
          name: value,
        }).then(() => {
          this.$message.success('创建成功！');
          this.getGroups();
        }).catch(() => {
        });
      }).catch(() => {
      });
    },
    delProject(groupId, projectId) {
      this.$confirm('确定删除该项目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        delProject({
          groupId,
          projectId,
        }).then(() => {
          this.$message.success('删除成功！');
          this.getGroups();
        }).catch(() => { });
      }).catch(() => { });
    },
    renameProject(groupId, projectId, name) {
      this.$prompt('重命名', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '项目名称',
        inputValue: name,
      }).then(({ value }) => {
        if (!value) {
          this.$message.error('请输入项目名称');
          return;
        }
        renameProject({
          groupId,
          projectId,
          name: value,
        }).then(() => {
          this.$message.success('修改成功！');
          this.getGroups();
        }).catch(() => {
        });
      }).catch(() => {
      });
    },
    groupDetails(groupId, addMember) {
      if (!addMember) {
        this.memberModal = true;
        this.inviting = false;
      }
      this.curGroupId = groupId;
      groupDetails({
        groupId,
      }).then((res) => {
        this.curGroupUsers = res.users;
      }).catch(() => {
      });
    },
    groupInvite() {
      if (!this.inviteName) {
        this.$message.warning('请输入邀请账号');
        return;
      }
      groupInvite({
        groupId: this.curGroupId,
        username: this.inviteName,
      }).then(() => {
        this.inviteName = '';
        this.$message.success('添加成功！');
        this.groupDetails(this.curGroupId, true);
      }).catch(() => {
      });
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  height: 100%;
  overflow: auto;
  background-color: #f2f0f1;
  padding-top: 40px;
}

.main {
  padding: 20px 80px;
}

.group-wrapper {
  margin-bottom: 20px;
}

.group {
  margin-bottom: 20px;
  .title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    span {
      color: #60686b;
      font-size: 20px;
      margin-right: 20px;
    }
    i {
      color: #919ba7;
      margin-right: 6px;
      cursor: pointer;
      font-size: 18px;
    }
    .setting {
      position: relative;
      .dropdown {
        position: absolute;
        top: 20px;
        left: 0;
        z-index: 10;
        width: 100px;
        color: #333;
        background: #fff;
        box-shadow: @shadow;
        transform: rotateX(90deg);
        transition: all 0.3s;
        transform-origin: top center;
        li {
          padding: 4px 10px;
          &:hover {
            background-color: #f3f4f5;
            cursor: pointer;
          }
        }
      }
      &.active {
        .dropdown {
          transform: rotateX(0);
        }
      }
    }
  }
}

.project-wrapper {
  display: flex;
  .project {
    width: 240px;
    height: 120px;
    font-size: 18px;
    color: #9e9e9e;
    background-color: #fcfcfc;
    cursor: pointer;
    margin-right: 20px;
    padding: 20px;
    h3 {
      color: #2b2f33;
      margin-bottom: 10px;
      .clamp(2);
    }
    .bottom {
      position: relative;
      .flex(space-between);
      p {
        color: #919ba7;
        font-size: 14px;
      }
      i {
        opacity: 0;
      }
      .dropdown {
        position: absolute;
        top: 20px;
        right: -60px;
        z-index: 10;
        width: 100px;
        font-size: 14px;
        color: #333;
        background: #fff;
        box-shadow: @shadow;
        transform: rotateX(90deg);
        transition: all 0.3s;
        transform-origin: top center;
        li {
          padding: 4px 10px;
          &:hover {
            background-color: #f3f4f5;
            cursor: pointer;
          }
        }
      }
      &.active {
        .dropdown {
          transform: rotateX(0);
        }
      }
    }
    &:hover {
      background-color: #f7f7f7;
      .bottom {
        i {
          opacity: 1;
        }
      }
    }
  }
  .add {
    .flex();
    width: 240px;
    height: 120px;
    font-size: 18px;
    color: #9e9e9e;
    background-color: #fcfcfc;
    cursor: pointer;
    i {
      margin-right: 10px;
      font-size: 24px;
    }
    &:hover {
      background-color: #f7f7f7;
    }
  }
}

.inviting {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.user-header {
  display: flex;
  border-bottom: 1px solid #eceeef;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: bold;
  > div {
    flex: 1;
    padding: 12px;
  }
}
.user-wrapper {
  .user {
    display: flex;
    > div {
      display: flex;
      align-items: center;
      flex: 1;
      padding: 6px 12px;
    }
    img {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}
</style>
