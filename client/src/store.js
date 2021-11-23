import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


Math.seed = 8;
Math.seededRandom = function(max, min) {
    max = max || 1;
    min = min || 0;

    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    var rnd = Math.seed / 233280;

    return min + rnd * (max - min);
}

function addAttributes(item) {
  return Object.assign(item, {
      confidence: 50,
      classification: null,
      choices: [],
      won: -1,
      chose: 0,
      type: 1,
      chance: 0,
  })
}

function makeItems(arr) {
  let arr2 = []
  for (let obj of arr) {
    arr2.push(addAttributes(obj))
  }
  return arr2
}

let args = window.surveydata
if (!args) {
  console.error("No data recieved from server! Demo only. ")
  args = {
    items: []
  }
  var demo = true
}

let practice_items = []
let i
for (i = 0; i < 20; i++) {
  practice_items.push({
    file: 'practice/' + (i < 10 ? 'positive/' : 'negative/') + i % 10 + '.wav',
    truth: (i < 10),
  })
}

args["practice_items"] = new Array(practice_items.length)
while (i-->0) {
  let randSpot = Math.floor(Math.seededRandom(0,practice_items.length))
  while (args["practice_items"][randSpot] != undefined)
    randSpot = (randSpot+1) % practice_items.length
  args["practice_items"][randSpot] = practice_items[i]
}

export default new Vuex.Store({
  strict: true,
  state: {
    id: args['id'] || "tH1s-i5-A-s4mpL3-c0D3",
    survey_type: parseInt(args['task_type'], 10) || Math.floor(Math.random() * 3) + 1,
    debug: false,
    items: makeItems(args["practice_items"]),
    is_practice: true,
    practices_performed: 1,
    step: 0,
    audio_step: false,
    class_step: false,
    bet_step: false,
    reward: parseFloat(args['reward']) || 1.00
  },
  getters: {
    is_type1(state) {
      return state.survey_type === 1
    },
    is_type2(state) {
      return state.survey_type === 2
    },
    is_type3(state) {
      return state.survey_type === 3
    },
    wins(state) {
      return state.items.filter((obj) => obj.won).length
    },
    reward_total(state, getters) {
      return state.reward * getters.wins
    },
    reward_max(state) {
      return state.reward * args['items'].length
    },
    round_number(state) {
      return state.is_practice ? '(practice)' : state.step + 1
    },
    max_round_number(state) {
      return state.is_practice ? '(not in practice)' : state.items.length
    },
    is_last_item(state) {
      return state.step + 1 == state.items.length
    },
    current_item(state) {
      return state.items[state.step]
    },
  },
  mutations: {
    toggleDebug(state) {
      state.debug = !state.debug
    },
    setItem(state, data) {
      let index
      if ('index' in data) {
        index = data.index
        delete data.index
      } else {
        index = state.step
      }
      for (let key in data) {
        if (state.items[index].hasOwnProperty(key))
          state.items[index][key] = data[key]
        else
          console.error("Invalid key: " + key)
        state.items[index].timestamp = new Date().toISOString()
      }
    },
    endPractice(state) {
      if (demo)
        state.items = makeItems(args["practice_items"].slice(0,2))
      else
        state.items = makeItems(args["items"])
      state.step = 0
      state.is_practice = false
      state.audio_step = false
      state.class_step = false
      state.bet_step = false
    },
    nextItem(state) {
      if (state.step + 1 == state.items.length) {
        state.step = 0
        state.items = makeItems(args["practice_items"])
      }
      else
        state.step++
      state.practices_performed++
      state.audio_step = false
      state.class_step = false
      state.bet_step = false
    },
    audioComplete(state) {
      state.audio_step = true
    },
    classComplete(state) {
      state.class_step = true
    },
    betComplete(state) {
      state.bet_step = true
    }
  }
})
