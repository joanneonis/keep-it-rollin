/*
* isActive { Boolean } is het modal open?
* type { String } welk modal is actief
*/

export const state = () => ({
  isActive: false,
  type: '',
  title: '',
  description: '',
  actions: [],
  action: null
})

export const mutations = {
  setActive (stateMutation, bool) {
    const sm = stateMutation
    sm.isActive = bool
  },

  setType (stateMutation, type) {
    const sm = stateMutation
    sm.type = type
  },

  setHeader (stateMutation, data) {
    const { title, description } = data
    stateMutation.title = title
    stateMutation.description = description
  },

  setActions (stateMutation, data) {
    stateMutation.actions = data
  },

  setAction (stateMutation, action) {
    stateMutation.action = action
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
