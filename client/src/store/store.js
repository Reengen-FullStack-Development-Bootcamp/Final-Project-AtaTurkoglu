import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import datatable from './modules/datatable'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { user, datatable },
})
