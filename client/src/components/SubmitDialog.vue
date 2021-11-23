<template lang="html">
  <v-dialog
    persistent
    v-model="active"
    width="500"
    lazy
  >
    <v-card v-if="items.length">
      <v-card-title>
        <span class="heading">Round #{{ submit_round_number }}</span>
      </v-card-title>
      <v-window
        v-model="submit_step"
        lazy
      >
        <v-window-item :value="-1">
          <v-card-text>
            <template v-if="is_type2">
              <h1>Payment instructions</h1>
              <h3>For questions where the lottery was selected:</h3>
              <p>This is your computer clock, presenting the time down to the millisecond (1/1000th of a second).</p>
              <p>If the last two digits of the stopped clock are strictly less than the lottery winning chances you win the ${{ reward }} bonus, and if they are more, then you win nothing.</p>
              <p>Now, try to stop the clock showing the current time to millisecond precision by clicking on it. Because of the human reaction time, it is not possible for you to control these last two digits of the millisecond clock. The purpose of this is to generate a random number, and match your probability of winning to the selected round chances. </p>
              <stopwatch />
              <h3>For questions in which you selected to test your choice to the question about the presence of a jackhammer:</h3>
              <p>Your win will depend on if your choice was correct.</p>
            </template>
            <template v-else>
              <p>Now your answers will be tested. Whether you win or not depends on if your answer to the question about the presence of a jackhammer is correct for that round.</p>
            </template>
          </v-card-text>
        </v-window-item>
        <v-window-item
          v-for="(item, index) in items"
          :key="item.file"
          :value="index"
        >
          <v-card-text
            v-if="is_type1 || item.type == 1 || is_type3"
            class="text-xs-center"
          >
            <h1>Answer Test</h1>
            <h3>In round {{ submit_round_number }} your choice to the question about the presence of a jackhammer was selected for testing.</h3>
            <span v-if="item.won">
              <h3>Your answer was correct</h3>
              <h1 class="green--text">You won a bonus!</h1>
            </span>
            <span v-else>
              <h3>Your answer was incorrect</h3>
              <h1 class="red--text">No bonus won :(</h1>
            </span>
          </v-card-text>
          <v-card-text
            v-else
            class="text-xs-center"
          >
            <h1>Lottery</h1>
            <h3>In round {{ submit_round_number }} a(n) <b>{{ item.chance }}</b>% lottery was selected. To determine if you win the bonus, we will let you stop the clock below. </h3>
            <p>The last two digits must be less than <b>{{ item.chance }}</b> for you to win.</p>
            <stopwatch @stop="processLottery($event)" />
            <template v-if="item.won != -1">
              <span v-if="item.won">
                <h3>You won the lottery</h3>
                <h1 class="green--text">You won a bonus!</h1>
              </span>
              <span v-else>
                <h3>You lost the lottery</h3>
                <h1 class="red--text">No bonus won :(</h1>
              </span>
            </template>
          </v-card-text>
        </v-window-item>
      </v-window>
      <v-card-actions class="center-text-xs">
        <v-spacer />
        <v-btn
          depressed
          block
          :color="!is_final_submit ? 'primary' : 'success'"
          :disabled="submit_step >= 0 && current_item.won == -1"
          @click="next_submit()"
        >
          {{ !is_final_submit ? 'Next' : 'Finish' }}
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Stopwatch from '@/components/Stopwatch.vue'
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'SubmitDialog',
  model: {
    prop: 'active_parent',
    event: 'active_parent_change',
  },
  props: {
    active_parent: Boolean,
  },
  components: {
    'stopwatch': Stopwatch,
  },
  data() {
    return {
      submit_step: -1,
      active: this.active_parent,
    }
  },
  methods: {
    ...mapMutations(['setItem']),
    next_submit() {
      if (this.is_final_submit) {
        this.active = false
        this.$emit('submit')
      } else {
        this.submit_step++
      }
    },
    processLottery(e) {
      if (this.current_item.won === -1)
        this.setItem({won: e < this.current_item.chance, index: this.submit_step})
    },
  },
  computed: {
    ...mapState(['items', 'reward']),
    ...mapGetters(['is_type1', 'is_type2', 'is_type3', 'round_number', 'is_last_item']),
    current_item() {
      return this.items[this.submit_step < 0 ? 0 : this.submit_step]
    },
    is_final_submit() {
      return this.submit_step + 1 == this.items.length
    },
    submit_round_number() {
      return this.submit_step + 1
    },
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

<style lang="css" scoped>
</style>
