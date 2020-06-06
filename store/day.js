/*
* isActive { Boolean } is het modal open?
* type { String } welk modal is actief
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
