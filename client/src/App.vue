<template lang="html">
  <v-app>
    <v-container>
      <v-layout
        justify-center
        align-center
        fill-height
      >
        <v-flex>
          <v-card :color="is_practice ? 'yellow lighten-5' : 'deep-purple lighten-5'">
            <!-- Help -->
            <v-tooltip
              left
              v-model="instructions_tooltip"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  flat
                  icon
                  color="grey"
                  large
                  @click="instructions_dialog=true"
                  style="position:absolute;right:0;top:0;z-index:100;"
                >
                  ?
                </v-btn>
              </template>
              <span>Instructions</span>
            </v-tooltip>
            <!--  -->
            <v-card-title primary-title>
              <v-layout
                column
                align-center
              >
                <h3 class="headline">
                  Audio Classification {{ is_practice ? " (Practice)":null }}
                </h3>
                <span class="subheading">Click Play to begin</span>
              </v-layout>
            </v-card-title>
            <!-- Tasks -->
            <!--       -->
            <survey-list
              @sample="audiosample_dialog=true"
              :debug="debug"
            />
            <!-- Navigation -->
            <!--            -->
            <v-card-actions class="center-text-xs">
              <v-spacer />
              <v-btn
                depressed
                block
                :color=" !is_last_item ? 'primary' : 'success'"
                :disabled="!is_type3 ? !bet_step : !class_step"
                @click="processRound()"
              >
                {{ !is_last_item ? 'Next Recording' : 'Finish' }}
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
          <v-flex
            xs12
            justify-center
          >
            <v-card
              flat
              color="transparent"
            >
              <v-card-text class="text-xs-center">
                <span
                  v-if="!is_practice"
                  class="grey--text"
                >
                  {{ round_number }}/{{ max_round_number }}
                </span>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-flex>
        <!-- Round Submit Message -->
        <!--                      -->
        <round-dialog
          v-model="round_dialog"
          @start="endPractice()"
          @next="nextRound()"
        />
        <!-- Instructions Message -->
        <!--                      -->
        <instructions-dialog
          v-model="instructions_dialog"
          :instructions="is_type1 ? instructions_type1 : is_type2 ? instructions_type2 : instructions_type3"
          @active_parent_change="showTooltip()"
        />
        <!-- Process Message -->
        <!--                 -->
        <submit-dialog
          v-model="submit_dialog"
          @submit="submitAll()"
        />
        <!-- Final Submit Message -->
        <!--                      -->
        <code-dialog
          v-model="code_dialog"
        />
        <!-- Sample Dialog -->
        <!--               -->
        <v-dialog
          v-model="audiosample_dialog"
          max-width="500"
        >
          <template v-if="audiosample_dialog">
            <v-audio
              v-for="eg in examples"
              :key="eg"
              class="v-sheet--tile elevation-0"
              minimal
              :file="'assets/audio/jackhammer_only/'+eg"
            />
          </template>
        </v-dialog>
        <!-- Error Message -->
        <!--               -->
        <error-dialog
          v-model="error_dialog"
          :message="error_message"
        />
      </v-layout>
    </v-container>
  </v-app>
</template>

<style lang="css">
  .v-tooltip>span {
    width: 100%;
  }
  iframe {
    border: none;
  }
  .smalltext {
    font-size: 9px;
  }
</style>

<script>
import VuetifyAudio from '@/components/VuetifyAudio'
import InstructionsDialog from '@/components/InstructionsDialog'
import ErrorDialog from '@/components/ErrorDialog'
import CodeDialog from '@/components/CodeDialog'
import SubmitDialog from '@/components/SubmitDialog'
import RoundDialog from '@/components/RoundDialog'
import SurveyList from  '@/components/SurveyList'
import type1instr from '@/components/instructions/type1.js'
import type2instr from '@/components/instructions/type2.js'
import type3instr from '@/components/instructions/type3.js'
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    'v-audio': VuetifyAudio,
    'instructions-dialog': InstructionsDialog,
    'error-dialog': ErrorDialog,
    'code-dialog': CodeDialog,
    'round-dialog': RoundDialog,
    'survey-list': SurveyList,
    'submit-dialog': SubmitDialog
  },
  data () {
    return {
      code_dialog: false,
      submit_dialog: false,
      round_dialog: false,
      instructions_dialog: true,
      instructions_type1: type1instr,
      instructions_type2: type2instr,
      instructions_type3: type3instr,
      instructions_tooltip: false,
      audiosample_dialog: false,
      error_dialog: false,
      error_message: {
        data: "Cause unknown."
      },
      animate: false,
      examples: ["1.wav", "2.wav", "3.wav"],
    }
  },
  computed: {
    ...mapState(['debug', 'bet_step', 'class_step', 'is_practice', 'id', 'items']),
    ...mapGetters(['is_type1', 'is_type2', 'is_type3', 'wins', 'round_number', 'is_last_item', 'current_item', 'max_round_number']),
  },
  methods: {
    ...mapMutations(['setItem', 'nextItem', 'endPractice']),
    processRound() {

      if (this.is_type2) {
        let r = Math.floor(Math.random() * 5)
        this.setItem({
          chose: r,
          type: this.current_item.choices[r],
          chance: (r + 5) * 10
        })
      }
      if (this.is_type1 || this.current_item.type == 1 || this.is_type3) {
        this.setItem({won: this.current_item.truth == this.current_item.classification})
      }
      this.round_dialog = true
    },
    showTooltip() {
      this.instructions_tooltip = true;
      setTimeout(() => {
        this.instructions_tooltip = false;
      }, 3000);
    },
    nextRound() {
      if (this.is_last_item && !this.is_practice)
        this.submit_dialog = true
      else
        this.nextItem();
    },
    handleError(error) {
      this.error_message = error.response;
      this.error_dialog = true;
      this.submit_dialog = this.round_dialog = false;
    },
    submitAll() {
      let data = {
        'id': this.id,
        'wins': this.wins,
        'items': this.items,
      }
      this.$axios.post("/post/all", data).then(() => {
        this.code_dialog = true
      }).catch(error => {
        this.handleError(error)
      })
    },
  },
  created() {

  }
}
</script>
