active_parent<template lang="html">
  <v-dialog
    persistent
    v-model="active"
    width="600"
  >
    <v-card
      color="blue"
      dark
    >
      <v-card-title class="headline">
        Instructions
      </v-card-title>
      <v-window v-model="step">
        <v-window-item :value="0">
          <consent-form />
        </v-window-item>
        <v-window-item :value="1">
          <v-card-text
            class="subheading"
            v-for="instruction in instructions"
            :key="instruction"
            v-html="instruction"
          />
          <v-card-actions>
            <v-btn
              color="light-green"
              block
              large
              @click="active=false"
            >
              Begin Practice Round
            </v-btn>
          </v-card-actions>
        </v-window-item>
      </v-window>
      <v-card-actions v-if="step==0">
        <v-spacer />
        <v-btn
          color="primary"
          depressed
          @click="step++"
        >
          Agree &amp; Continue
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ConsentForm from '@/components/ConsentForm'
export default {
  name: 'InstructionsDialog',
  model: {
    prop: 'active_parent',
    event: 'active_parent_change',
  },
  components: {
    'consent-form': ConsentForm
  },
  props: {
    active_parent: Boolean,
    instructions: {
      type: Array,
      default: () => {return [""]}
    },
  },
  data() {
    return {
      active: this.active_parent,
      step: 0,
      step_instr: 0,
      step_authority: 2,
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
</style>
