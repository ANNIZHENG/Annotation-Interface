<template lang="html">
  <v-dialog
    persistent
    v-model="active"
    width="500"
  >
    <v-card
      color="error"
      dark
    >
      <v-card-title class="headline">
        Fatal Error
      </v-card-title>
      <v-card-text>
        <p>There was an error submitting information to the server:</p>
        <v-card color="black">
          <v-card-title
            v-html="message.data"
            class="header"
          />
          <code class="large-code ">{{ message }}</code>
          <v-card-text>
            Please refresh the browser. If the issue persists
            contact the owner for assistance.
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ErrorDialog',
  model: {
    prop: 'active_parent',
    event: 'active_parent_change',
  },
  props: {
    active_parent: Boolean,
    message: {
      type: Object,
      default: () => {
        return {data: "Empty Response"}
      }
    },
  },
  data() {
    return {
      active: this.active_parent,
    }
  },
  watch: {
    active_parent(newval) {
      this.active = newval
    },
    active(newval) {
      this.$emit('active_parent_change', newval)
    }
  }
}
</script>

<style lang="css">
.large-code {
  width:100%;
  max-height:500px;
  overflow:auto;
  white-space:pre;
  border-radius: 0;
}
</style>
