<template lang="html">
  <div
    class="highlight"
    :class="{'flash-animation': value}"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: "TextHighlight",
  props: {
    value: Boolean,
  },
  watch: {
    value(newval) {
      if (newval) {
        setTimeout(() => {
          this.$emit('input', false)
        }, 1000)

      }
    }
  }
}
</script>

<style lang="css" scoped>
.highlight {
  display:inline-block;
  padding: 0.2em;
  margin: -0.2em;
  border-radius: 2px;
}

.flash-animation {
  animation: flash 1s;
}

@-webkit-keyframes pulse {
  0% {
    background-color: rgb(255, 65, 54);
    -webkit-box-shadow: 0 0 0 0 rgba(255, 65, 54, 0.4);
  }
  10% {
    -webkit-transform: scale(1.2);
  }
  70% {
    -webkit-box-shadow: 0 0 0 10px rgba(255, 65, 54, 0);
    -webkit-transform: scale(1.0);
  }
  100% {
    background-color: inherit;
    -webkit-box-shadow: 0 0 0 0 rgba(255, 65, 54, 0);
  }
}

@keyframes flash {
  0% {
    background-color: rgb(255, 65, 54);
    -moz-box-shadow: 0 0 0 0 rgba(255, 65, 54, 0.4);
    box-shadow: 0 0 0 0 rgba(255, 65, 54, 0.4);
  }
  10% {
    transform: scale(1.2);
  }
  70% {
    -moz-box-shadow: 0 0 0 10px rgba(255, 65, 54, 0);
    box-shadow: 0 0 0 10px rgba(255, 65, 54, 0);
    transform: scale(1.0);
  }
  100% {
    background-color: inherit;
    -moz-box-shadow: 0 0 0 0 rgba(255, 65, 54, 0);
    box-shadow: 0 0 0 0 rgba(255, 65, 54, 0);
  }
}
</style>
