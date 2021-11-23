<template lang="html">
  <svg
    viewBox="0 0 32 32"
    :style="{'background': secondary}"
  >
    <circle
      r="16"
      cx="16"
      cy="16"
      class="pie"
      :style="{'stroke-dasharray': chance +' 100', 'stroke': primary, 'fill': secondary}"
    />
    <circle
      r="4"
      cx="16"
      cy="16"
      class="pin"
    />
    <rect
      x="16"
      y="16"
      width="4"
      height="4"
      :style="{'transform': 'rotate('+(current_spin*360-45)+'deg)'}"
    />
  </svg>
</template>

<script>
export default {
  name: 'Spinner',
  props: {
    chance: {
      type: Number,
      required: true,
    },
    result: {
      type: Number,
      required: true,
    },
    activate: {
      type: Boolean,
    },
    primary: {
      type: String,
      default: '#2196F3',
    },
    secondary: {
      type: String,
      default: '#ECEFF1',
    },
  },
  data() {
    return {
      current_spin: -8,
    }
  },
  watch: {
    activate() {
      this.current_spin = this.result
      setTimeout(() => {
        this.$emit('complete');
      }, 4* 1000)
    }
  }
}
</script>

<style lang="css" scoped>
svg {
  /* width: 100%; */
  transform: rotate(-90deg);
  border-radius: 50%;
}
circle.pie {
  stroke-width: 32;
}
circle.pin {
  fill: #263238;
}
rect {
  transform-origin: 50% 50%;
  /* transform: rotate(-3645deg); */
  transition: transform 4s cubic-bezier(0.22, 0.61, 0.36, 1);
  /* animation: spin 4s cubic-bezier(0.22, 0.61, 0.36, 1); */
  fill: #263238;
}
</style>
