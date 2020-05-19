<template>
  <div class="page">
    <div class="content">
      <p class="number">
        4<i class="iconfont km-fangxiangjiantou"></i>4
      </p>
      <p class="des">您访问的页面不存在</p>
      <div class="btn">
        <el-button type="text" @click="$router.push({ path: '/list' })">返回首页</el-button>
        <el-button type="primary" @click="$router.back()">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
};
</script>

<style lang="less" scoped>
@keyframes move {
  0% {
    transform: rotate(0deg);
  }
  20% {
    transform: rotate(-50deg);
  }
  40% {
    transform: rotate(10deg);
  }
  60% {
    transform: rotate(50deg);
  }
  80% {
    transform: rotate(20deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.page {
  .flex();
  height: 100%;
  background-color: #f0f0f0;
}

.content {
  background: #fff;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;
  border: 1px solid #dddee1;
  padding: 50px 100px;
  text-align: center;
  &:hover {
    box-shadow: @shadow;
  }
}

.number {
  font-size: 240px;
  color: @text-blue;
  i {
    display: inline-block;
    font-size: 240px;
    color: #19be6b;
    animation: move 4s infinite;
  }
}

.des {
  font-size: 30px;
  color: #909399;
  margin-bottom: 20px;
}

.btn {
  display: flex;
  justify-content: space-around;
}

</style>
