<template>
  <div class="page">
    <head-top></head-top>
    <div class="main">
      <div class="table-menu">
        <div class="action">
          <el-button type="success" @click="createTables" size="medium">创建表格</el-button>
        </div>
        <ul class="table-wrapper">
          <li class="table" v-for="table in tables" :key="table._id">
            <h3 class="table-name" :class="{ active: tableSetId === table._id }" v-clickoutside="hideTableMenu">
              <span>{{ table.name }}</span>
              <i class="iconfont km-down" @click.stop="tableSetId = table._id;viewSetId = null;" v-if="tableSetId !== table._id"></i>
              <ul class="dropdown-menu">
                <li @click="renameTable(table._id, table.name)">重命名</li>
                <li @click="setColumns(table._id)">编辑表头</li>
                <!-- <li @click="copyTable(table._id)">复制</li> -->
                <li @click="delTable(table._id)">删除</li>
              </ul>
            </h3>
            <ul class="view-wrapper">
              <router-link
                tag="li"
                class="view"
                v-for="view in table.views"
                :key="view._id"
                :to="{ name: 'view', params: { vId: view._id }}"
                :class="{ active: viewSetId === view._id }"
                v-clickoutside="hideViewMenu">
                <span>{{ view.name }}</span>
                <i class="iconfont km-down" @click.stop="switchView(view._id)"></i>
                <ul class="dropdown-menu">
                  <li @click="renameView(view._id, view.name)">重命名</li>
                  <li @click="delView(view._id, table._id)">删除</li>
                </ul>
              </router-link>
              <li class="add" @click="createView(table._id)">添加新视图...</li>
            </ul>
          </li>
        </ul>
      </div>
      <router-view ref="view"></router-view>
    </div>
    <el-dialog
      title="编辑表头"
      :visible.sync="editColumnsModal"
      width="800px">
      <el-table :data="editColumns" border stripe style="margin-bottom: 10px;" size="mini">
        <el-table-column label="列名称" show-overflow-tooltip width="140">
          <template slot-scope="scope">
            <el-input v-model="scope.row.title" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="列类型" show-overflow-tooltip width="140">
          <template slot-scope="scope">
            <el-select v-model="scope.row.type" placeholder="请选择" size="mini" @change="selectChange($event, scope.$index)">
              <el-option label="文本" value="text"></el-option>
              <el-option label="数值" value="number"></el-option>
              <el-option label="日期" value="date"></el-option>
              <el-option label="月份" value="month"></el-option>
              <el-option label="下拉选项" value="select"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="选项" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="set-options" v-if="scope.row.type === 'select'">
              <ul class="options" v-if="scope.row.options">
                <li v-for="(option, index) in scope.row.options" :key="index">
                  <span>{{ option.value }}</span>
                  <i class="iconfont km-close" @click="scope.row.options.splice(index, 1)"></i>
                </li>
              </ul>
              <div style="display: flex;align-items: center;margin-top: 4px;cursor: pointer;" @click="addSelect(scope)">
                <i class="iconfont km-plus" style="color: #8aa891;margin-right: 6px;"></i>添加选项
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip width="80" align="center">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="removeColumns(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button size="mini" type="success" @click="editColumns.push({})">添加列</el-button>
      <span slot="footer">
        <el-button size="small" @click="editColumnsModal = false;">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmSetColumns" :loading="editLoading">
          <span v-if="editLoading">保存中...</span>
          <span v-else>保存</span>
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTables, createTable, renameTable, getTableDetails, copyTable, delTable, editColumns,
} from 'apis/tables';
import { createView, delView, renameView } from 'apis/views';
import HeadTop from 'components/HeadTop';

export default {
  components: {
    HeadTop,
  },
  data() {
    return {
      tables: [],
      tableSetId: null,
      viewSetId: null,
      curEditId: null,
      editColumns: [],
      editColumnsModal: false,
      editLoading: false,
    };
  },
  mounted() {
    this.$store.state.socket.on('updateColumns', (vId) => {
      if (vId === this.$route.params.vId) {
        this.$refs.view.getData();
      }
    });
    this.$store.state.socket.on('updateProject', (pId) => {
      if (pId === this.$route.params.pId) {
        this.getTables();
      }
    });
    this.getTables();
  },
  beforeRouteLeave(to, from, next) {
    this.$store.state.socket.off('updateColumns');
    this.$store.state.socket.off('updateProject');
    next();
  },
  watch: {
    $route() {
      this.getTables();
    },
  },
  methods: {
    getTables() {
      getTables({
        projectId: this.$route.params.pId,
      }).then((res) => {
        this.tables = res;
        this.initCurView();
      }).catch(() => {
      });
    },
    initCurView() {
      this.tables.some((item) => {
        if (item.views.length > 0) {
          if (!this.$route.params.vId || !item.views.some((v) => v._id === this.$route.params.vId)) {
            this.$router.push({ name: 'view', params: { vId: item.views[0]._id } });
          }
          return true;
        }
        this.$router.push({ name: 'table', params: { pId: this.$route.params.pId } });
        return false;
      });
    },
    createTables() {
      this.$prompt('创建表格', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '表格名称',
      }).then(({ value }) => {
        if (!value) {
          this.$message.error('请输入表格名称');
          return;
        }
        createTable({
          projectId: this.$route.params.pId,
          name: value,
        }).then(() => {
          this.$message.success('创建成功！');
          this.getTables();
          this.$store.state.socket.emit('updateProject', this.$route.params.pId);
        }).catch(() => {
        });
      }).catch(() => {
      });
    },
    createView(tableId) {
      this.$prompt('创建视图', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '视图名称',
      }).then(({ value }) => {
        if (!value) {
          this.$message.error('请输入视图名称');
          return;
        }
        createView({
          tableId,
          name: value,
        }).then(() => {
          this.$message.success('创建成功！');
          this.getTables();
          this.$store.state.socket.emit('updateProject', this.$route.params.pId);
        }).catch(() => {
        });
      }).catch(() => {
      });
    },
    hideTableMenu() {
      this.tableSetId = null;
    },
    hideViewMenu() {
      this.viewSetId = null;
    },
    renameTable(id, name) {
      this.tableSetId = null;
      this.$prompt('重命名', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '表格名称',
        inputValue: name,
      }).then(({ value }) => {
        if (!value) {
          this.$message.error('请输入表格名称');
          return;
        }
        renameTable({
          id,
          name: value,
        }).then(() => {
          this.$message.success('修改成功！');
          this.getTables();
          this.$store.state.socket.emit('updateProject', this.$route.params.pId);
        }).catch(() => {
        });
      }).catch(() => {
      });
    },
    setColumns(id) {
      this.editColumnsModal = true;
      this.curEditId = id;
      this.tableSetId = null;
      getTableDetails({
        id,
      }).then((res) => {
        this.editColumns = res.columns;
      }).catch(() => {
      });
    },
    copyTable(tableId) {
      copyTable({
        projectId: this.$route.params.pId,
        tableId,
      }).then(() => {
        this.$message.success('复制成功！');
      }).catch(() => {
      });
    },
    delTable(tableId) {
      this.tableSetId = null;
      this.$confirm('确定删除该表格?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        delTable({
          tableId,
          projectId: this.$route.params.pId,
        }).then(() => {
          this.$message.success('删除成功！');
          this.getTables();
          this.$store.state.socket.emit('updateProject', this.$route.params.pId);
        }).catch(() => { });
      }).catch(() => { });
    },
    switchView(id) {
      this.viewSetId = id;
      this.tableSetId = null;
    },
    renameView(id, name) {
      this.$prompt('重命名', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '视图名称',
        inputValue: name,
      }).then(({ value }) => {
        if (!value) {
          this.$message.error('请输入视图名称');
          return;
        }
        renameView({
          id,
          name: value,
        }).then(() => {
          this.$message.success('修改成功！');
          this.getTables();
          this.$store.state.socket.emit('updateProject', this.$route.params.pId);
        }).catch(() => {
        });
      }).catch(() => {
      });
    },
    delView(viewId, tableId) {
      this.$confirm('确定删除该视图?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        delView({
          viewId,
          tableId,
        }).then(() => {
          this.$message.success('删除成功！');
          this.getTables();
          this.$store.state.socket.emit('updateProject', this.$route.params.pId);
        }).catch(() => { });
      }).catch(() => { });
    },
    addSelect(row) {
      this.$prompt('添加选项', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '选项名称',
      }).then(({ value }) => {
        if (!value) {
          this.$message.error('请输入选项名称');
          return;
        }
        this.editColumns[row.$index].options.push({
          value,
          label: value,
        });
      }).catch(() => {
      });
    },
    removeColumns(index) {
      this.$confirm('确定删除该列？(该列的数据将被销毁，不可恢复)', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.editColumns.splice(index, 1);
      }).catch(() => { });
    },
    selectChange(val, index) {
      if (val === 'select') {
        this.$set(this.editColumns[index], 'options', []);
      }
    },
    confirmSetColumns() {
      this.editLoading = true;
      this.editColumns = this.editColumns.filter((item) => item.title);
      editColumns({
        id: this.curEditId,
        columns: this.editColumns,
      }).then(() => {
        this.$message.success('编辑成功！');
        this.editColumnsModal = false;
        this.$refs.view.getData();
        this.$store.state.socket.emit('updateColumns', this.$route.params.vId);
      }).catch(() => { }).finally(() => {
        this.editLoading = false;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  height: 100%;
  overflow: auto;
  padding-top: 40px;
}

.main {
  display: flex;
  height: 100%;
}

.table-menu {
  width: 220px;
  background-color: #f2f0f1;
  color: #1a1b1c;
  border-right: 1px solid @bd;
  overflow-y: auto;
  flex: none;
}

.action {
  .flex();
  height: 80px;
}

.table-wrapper {
  padding-left: 20px;
  .table {
    margin-bottom: 10px;
    .table-name {
      position: relative;
      .flex(space-between);
      font-size: 14px;
      margin-bottom: 10px;
      padding-right: 20px;
      i {
        display: none;
        cursor: pointer;
      }
      &:hover {
        i {
          display: inline-block;
        }
      }
      &.active {
        .dropdown-menu {
          transform: rotateX(0);
        }
      }
    }
    &:after {
      content: "";
      display: block;
      height: 1px;
      margin: 6px auto;
      background: linear-gradient(
        90deg,
        hsla(210, 5%, 83%, 0),
        #c8cacc,
        #bbbdbf,
        #b0b3b5,
        hsla(204, 3%, 66%, 0)
      );
      opacity: 0.4;
    }
  }
}

.view-wrapper {
  padding-left: 10px;
  > li {
    cursor: pointer;
    padding: 4px 20px 4px 10px;
    &:hover {
      color: #409eff;
    }
  }
  .view {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
    &.router-link-active {
      background-color: #fff;
      color: #409eff;
      i {
        display: inline-block;
      }
    }
    &.active {
      .dropdown-menu {
        transform: rotateX(0);
      }
    }
    i {
      display: none;
    }
  }
  .add {
    font-size: 12px;
    color: #909399;
  }
}

.dropdown-menu {
  position: absolute;
  top: 20px;
  right: 20px;
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

.set-options {
  .options {
    display: flex;
    flex-wrap: wrap;
    > li {
      display: flex;
      align-items: center;
      margin-right: 10px;
      i {
        margin-left: 6px;
        &:hover {
          color: #f56c6c;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
