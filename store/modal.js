/*
* isActive { Boolean } is het modal open?
* type { String } welk modal is actief
*/

export const state = () => ({
  isActive: false,
  type: ''
})

export const mutations = {
  setActive (stateMutation, bool) {
    const sm = stateMutation
    sm.isActive = bool
  },

  setType (stateMutation, type) {
    const sm = stateMutation
    sm.type = type
  }
}

export const actions = {
  setActiveModal ({ commit }, type) {
    commit('setActive', true)
    commit('setType', type)
  },

  closeModal ({ commit }) {
    commit('setActive', false)
  }
}
