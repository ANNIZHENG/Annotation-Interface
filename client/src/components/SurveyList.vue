<template lang="html">
  <v-window :value="step">
    <v-window-item
      v-for="(item, index) in items"
      :key="index"
      lazy
    >
      <v-container grid-list-lg>
        <v-layout column>
          <!-- Audio -->
          <!--       -->
          <v-flex>
            <v-audio
              :file="'assets/audio/' + item.file"
              @ended="audioComplete()"
            >
              <v-btn
                outline
                round
                class="teal--text"
                @click="$emit('sample')"
              >
                <span>What does a jackhammer sound like?</span>
              </v-btn>
            </v-audio>
          </v-flex>
          <!-- Classification -->
          <!--                -->
          <v-flex>
            <v-card>
              <v-card-title>
                <span>Is there a jackhammer present in the recording?</span>
              </v-card-title>
              <v-divider />
              <v-card-actions v-show="audio_step || debug">
                <v-radio-group
                  row
                  :value="item.classification"
                  @change="classComplete();setItem({'classification': $event});"
                >
                  <v-radio
                    label="Yes"
                    :value="true"
                  />
                  <v-radio
                    label="No"
                    :value="false"
                  />
                </v-radio-group>
              </v-card-actions>
            </v-card>
          </v-flex>
          <!-- Confidence & Lottery -->
          <!--                      -->
          <template v-if="is_type1">
            <!-- Type 1: Confidence -->
            <v-flex v-show="class_step">
              <v-card>
                <v-card-title>
                  How confident are you that there is {{ !item.classification ? "not" : "" }} a jackhammer present in the recording?
                </v-card-title>
                <v-divider />
                <v-card-actions>
                  <v-tooltip
                    bottom
                    class="v-input"
                  >
                    <span>I am {{ item.confidence }}% confident in my answer that there is {{ !item.classification ? "not" : "" }} a jackhammer present in the recording.</span>
                    <v-slider
                      thumb-label
                      :min="50"
                      :step="10"
                      slot="activator"
                      :color="bet_step ? '' : 'grey'"
                      :value="item.confidence"
                      @change="betComplete();setItem({'confidence': $event})"
                    >
                      <span slot="prepend">50%</span>
                      <span slot="append">100%</span>
                    </v-slider>
                  </v-tooltip>
                </v-card-actions>
                <v-card-actions>
                  <v-layout
                    row
                    wrap
                  >
                    <v-flex xs6>
                      not at all confident
                    </v-flex>
                    <v-flex
                      xs6
                      text-xs-right
                    >
                      certain, completely confident
                    </v-flex>
                  </v-layout>
                </v-card-actions>
              </v-card>
            </v-flex>
          </template>
         
          <template v-if="is_type2">
            <!-- Type 2: Lottery -->
            <v-flex v-show="class_step">
              <v-card>
                <v-card-title>
                  <span>
                    <b>You have the chance to win a bonus in one of the following ways (choose one):</b> <br>
                    1) by lottery (<flash v-model="animate">{{ item.confidence }}%</flash> chance of winning), or<br>
                    2) if my answer to the question about the presence of a jackhammer is correct
                  </span>
                </v-card-title>
                <v-divider />
                <v-card-actions class="layout justify-space-around row wrap">
                  <v-btn
                    color="primary"
                    :disabled="bet_step"
                    @click="addChoice(false)"
                  >
                    <span><flash v-model="animate">{{ item.confidence }}%</flash> chance lottery</span>
                  </v-btn>
                  <v-btn
                    color="primary"
                    :disabled="bet_step"
                    @click="addChoice(true)"
                  >
                    <span class="smalltext">My answer to the question about the presence of a jackhammer</span>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </template>
        </v-layout>
      </v-container>
    </v-window-item>
  </v-window>
</template>

<script>
import TextHighlight from '@/components/TextHighlight'
import VuetifyAudio from '@/components/VuetifyAudio'
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: "SurveyList",
  components: {
    'v-audio': VuetifyAudio,
    'flash': TextHighlight,
  },
  data() {
    return {
      animate: false,
    }
  },
  computed: {
    ...mapGetters(['is_type1', 'is_type2', 'is_type3', 'wins', 'round_number', 'is_last_item', 'current_item']),
    ...mapState(['items', 'debug', 'bet_step', 'class_step', 'audio_step', 'step']),
  },
  methods: {
    ...mapMutations(['betComplete', 'classComplete', 'audioComplete', 'setItem']),
    addChoice(choice) {
      this.setItem({
        choices: [...this.current_item.choices, choice],
        confidence: this.current_item.confidence + 10
      })
      if (this.current_item.confidence == 100)
        this.betComplete()
      this.animate = true
    },
  }
}
</script>

<style lang="css" scoped>
</style>
