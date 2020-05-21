<template>
  <div class="view">
    <vue-willtable
      ref="willtable"
      :columns="columns"
      v-model="data"
      @selection-change="selectionChange"
      :maxHeight="maxHeight">
    </vue-willtable>
    <div class="btn-bar">
      <div class="left">
        <div class="add" @click="addData">
          <i class="iconfont km-plus"></i>
        </div>
        <div class="delete" @click="removeData">
          <i class="iconfont km-delete"></i>
        </div>
      </div>
      <div class="right">
        {{ data.length }}条记录
      </div>
    </div>
  </div>
</template>

<script>
import { updateViewData, getView } from 'apis/views';
import VueWilltable from 'vue-willtable';
import 'vue-willtable/dist/vue-willtable.min.css';

export default {
  components: {
    VueWilltable,
  },
  data() {
    return {
      columns: [],
      data: [],
      selectedIds: [],
      maxHeight: 800,
    };
  },
  watch: {
    $route() {
      this.getData();
    },
    data: {
      handler(val) {
        if (val) {
          updateViewData({
            viewId: this.$route.params.vId,
            content: val,
          }).then(() => {
            this.$store.state.socket.emit('updateView', this.$route.params.vId, val);
          }).catch(() => { });
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.$store.state.socket.on('updateView', (vId, data, userId) => {
      if (vId === this.$route.params.vId && userId !== this.$store.state.userinfo._id) {
        data.forEach((item, index) => {
          Object.keys(item).forEach((key) => {
            this.data[index][key] = item[key];
          });
        });
      }
    });
    this.$store.state.socket.on('addViewItem', (vId, obj, userId) => {
      if (vId === this.$route.params.vId && userId !== this.$store.state.userinfo._id) {
        this.$refs.willtable.addItem(obj);
      }
    });
    this.$store.state.socket.on('removeViewItem', (vId, key, ids, userId) => {
      if (vId === this.$route.params.vId && userId !== this.$store.state.userinfo._id) {
        this.$refs.willtable.removeItems(key, ids);
      }
    });
    this.getData();
    this.maxHeight = document.documentElement.clientHeight - 74;
    window.onresize = () => {
      this.maxHeight = document.documentElement.clientHeight - 74;
    };
  },
  beforeRouteLeave(to, from, next) {
    this.$store.state.socket.off('updateView');
    this.$store.state.socket.off('addViewItem');
    this.$store.state.socket.off('removeViewItem');
    next();
  },
  methods: {
    getData() {
      getView({
        viewId: this.$route.params.vId,
      }).then((res) => {
        this.columns = res.table.columns;
        const tableData = res.data;
        this.columns.forEach((column) => {
          tableData.forEach((item) => {
            if (!Object.prototype.hasOwnProperty.call(item, column.key)) {
              // item[column.key] = '';
              this.$set(item, column.key, '');
            }
          });
        });
        this.$refs.willtable.setData(tableData);
      }).catch((err) => {
        if (err.status === 202) {
          this.$router.push({ path: `/tables/${this.$route.params.pId}` });
        }
      });
    },
    addData() {
      const obj = {};
      obj.id = new Date().getTime();
      this.columns.forEach((item) => {
        if (item.key) {
          obj[item.key] = '';
        }
      });
      this.$refs.willtable.addItem(obj);
      this.$store.state.socket.emit('addViewItem', this.$route.params.vId, obj);
    },
    selectionChange(selection) {
      this.selectedIds = selection.map((item) => item.id);
    },
    removeData() {
      if (this.selectedIds.length === 0) {
        this.$message.warning('请勾选操作项');
        return;
      }
      this.$refs.willtable.removeItems('id', this.selectedIds);
      this.$store.state.socket.emit('removeViewItem', this.$route.params.vId, 'id', this.selectedIds);
    },
  },
};
</script>

<style lang="less" scoped>
.view {
  position: relative;
  overflow: auto;
  flex: auto;
  height: 100%;
}

.btn-bar {
  position: absolute;
  z-index: 10;
  .flex(space-between);
  width: 100%;
  left: 0;
  bottom: 0;
  border-top: 1px solid @bd;
  background-color: #fff;
}

.left {
  display: flex;
  > div {
    .flex();
    width: 40px;
    height: 30px;
    border-right: 1px solid @bd;
    border-bottom: 1px solid @bd;
    border-top: none;
    cursor: pointer;
    transition: all 0.3s;
    &.add {
      &:hover {
        color: #67c23a;
      }
    }
    &.delete {
      &:hover {
        color: #f56c6c;
      }
    }
  }
}

.right {
  .flex();
  color: #909399;
  border-left: 1px solid @bd;
  border-bottom: 1px solid @bd;
  font-size: 14px;
  height: 30px;
  padding: 0 20px;
}
</style>
