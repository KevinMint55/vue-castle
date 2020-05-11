<template>
  <div>
    <h3 :class="s.title">
      info
      <span>info</span>
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
  color: @primary;
  span {
    display: flex;
    color: green;
  }
}
</style>
