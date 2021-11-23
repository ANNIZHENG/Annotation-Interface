import Vue from 'vue'
import './plugins/axios'
import './plugins/vuetify'
import App from './App.vue'
import store from './store'

//Vue.config.productionTip = false
Vue.config.devtools = true

window.vue = new Vue({
  render: h => h(App),
  store,

  methods: {
    debug() {
      this.$store.commit('toggleDebug')

      return "Debug mode " + (this.$store.state.debug ? "enabled. " : "disabled. ")
    }
  }
}).$mount('#app')
