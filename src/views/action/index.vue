<template>
  <div>
    <h3 :class="s.title">
      action
      <span>action</span>
    </h3>
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

<style lang="less" module="s">
.title {
  color: red;
  span {
    display: flex;
    color: green;
  }
}
</style>
