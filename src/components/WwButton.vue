<template>
  <button @click="handleClick" :class="classes">
    <span>
      <i :class="`iconfont icon-${icon}`" v-if="icon"></i>
      <slot></slot>
    </span>
  </button>
</template>

<script>
const prefixCls = 'ww-btn';

export default {
  props: {
    type: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '',
    },
    shape: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
    },
  },
  data() {
    return {

    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${this.type}`]: this.type,
          [`${this.size}`]: this.size,
          shape: this.shape,
        },
      ];
    },
  },
  methods: {
    handleClick(event) {
      this.$emit('click', event);
    },
  },
};
</script>

<style lang="less" scoped>
.ww-btn {
  display: inline-block;
  color: #fff;
  padding: 5px 12px;
  transition: color 0.2s linear, background-color 0.2s linear,
    border 0.2s linear;
  user-select: none;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid transparent;
  vertical-align: middle;
  background-color: #154d5e;
  border: 1px solid #02a1f2;
  i {
    vertical-align: middle;
  }
  &:hover {
    background-color: #02a1f2;
  }
  &.error {
    background-color: #890409;
    border: 1px solid #ed3f14;
    &:hover {
      background-color: #ed3f14;
    }
  }
  &.warning {
    background-color: #e75e40;
    border: 1px solid #ff9900;
    &:hover {
      background-color: #ff9900;
    }
  }
  &.small {
    padding: 3px 8px;
  }
  &.shape {
    border-radius: 12px;
    &.small {
      border-radius: 8px;
    }
  }
}
</style>
