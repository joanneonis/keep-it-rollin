/*
* isDone { Boolean } Check if day is finished
*/

export const state = () => ({
  isDone: false
})

export const mutations = {
  setDone (stateMutation, bool) {
    const sm = stateMutation
    sm.isDone = bool
  }
}

export const actions = {
  setDone ({ commit }, bool) {
    commit('setDone', bool)
  }
}
