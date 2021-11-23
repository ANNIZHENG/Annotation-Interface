<template lang="html">
  <v-btn
    outline
    small
    @click="stop()"
  >
    {{ date | time }}
  </v-btn>
</template>

<script>
export default {
  data() {
    return {
      date: 0,
      interval: null,
      stopped: false,
    }
  },
  methods: {
    update() {
      this.date = Date.now()
    },
    stop() {
      clearInterval(this.interval)
      this.$emit("stop", this.date % 100)
    }
  },
  created() {
    this.interval = setInterval(this.update, 10)
  },
  destroyed() {
    clearInterval(this.interval)
  },
  filters: {
    time(val) {
      let ms = val % 1000
      if (ms < 10)
        ms = '00' + ms
      else if (ms < 100)
        ms = '0' + ms
      val = Math.floor(val/1000)
      let s = val % 60
      if (s < 10)
        s = '0' + s
      val = Math.floor(val/60)
      let min = val % 60
      if (min < 10)
        min = '0' + min
      return min + ':' + s + ':' + ms
    }
  }
}
</script>

<style lang="css" scoped>
</style>
