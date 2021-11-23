<template lang="html">
  <v-dialog
    persistent
    v-model="active"
    width="500"
  >
    <v-card
      dark
      color="blue"
    >
      <v-card-title class="headline">
        Survey Code
      </v-card-title>
      <v-card-text>
        <p>Thank you for participating, your bonus is ${{ reward_total.toFixed(2) }}</p>
        <p>Copy the code below to the MTurk assignment to get approved and paid.</p>
        <v-text-field
          light
          class="centered"
          solo
          readonly
          :value="id"
        />
        <v-data-table
          light
          class="elevation-2"
          :items="tableItems"
          :headers="tableHeaders"
          disable-initial-sort
          hide-actions
        >
          <template #items="props">
            <td>{{ props.item.round }}</td>
            <td>{{ props.item.type }}</td>
            <td>{{ props.item.won }}</td>
          </template>
        </v-data-table>
      </v-card-text>
      <v-dialog
        v-model="feedback_dialog"
        width="600"
        persistent
      >
        <v-card
          color="accent"
          dark
        >
          <v-card-text>
            <v-textarea
              v-model="feedback"
              label="optional feedback"
              hint="Can you tell us if there was anything that was unclear?"
            />
            <v-layout row>
              <v-flex shrink>
                <v-btn
                  flat
                  color="primary"
                  @click="feedback_dialog=false"
                >
                  No Thanks
                </v-btn> 
              </v-flex>
              <v-flex grow>
                <v-btn
                  block
                  @click="submitFeedback()"
                  :loading="feedback_pending"
                  :color="feedback_success ? 'success' : 'primary'"
                >
                  <span v-if="feedback_success">Feedback Recieved</span>
                  <span v-else>Submit Feedback</span>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapState, mapGetters} from 'vuex'

export default {
  name: 'CodeDialog',
  model: {
    prop: 'active_parent',
    event: 'active_parent_change',
  },
  props: {
    active_parent: Boolean
  },
  data() {
    return {
      feedback_dialog: false,
      active: this.active_parent,
      feedback: '',
      feedback_pending: false,
      feedback_success: false
    }
  },
  computed: {
    ...mapState(['items', 'id']),
    ...mapGetters(['reward_total']),
    tableItems() {
      return this.items.map((o, i) => {
        return {
          round: i+1,
          won: (o.won ? 'YES' : 'NO'),
          type: (o.type==0 ? 'Lottery' : 'Answer to question about jackhammer' )
        }
      })
    },
    tableHeaders() {
      return [
        {text: 'Round', value:'round', sortable: false},
        {text: 'Type', value:'type', sortable: false},
        {text: 'Won', value:'won', sortable: false}
      ]
    }
  },
  watch: {
    active_parent(newval) {
      this.active = newval
      if (newval)
        this.feedback_dialog = true
    },
    active(newval) {
      this.$emit('active_parent_change', newval)
    }
  },
  methods: {
    submitFeedback() {
      let data = {
        'id': this.id,
        'feedback': this.feedback
      }
      this.feedback_pending = true
      this.$axios.post("/post/feedback", data).then(() => {
        this.feedback_success = true
        this.feedback_dialog = false
      }).then(() => {
        this.feedback_pending = false
      })
    }
  }
}
</script>

<style lang="css">
.v-text-field.centered input {
  text-align: center !important;
}
</style>
