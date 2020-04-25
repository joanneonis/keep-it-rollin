// import firebase from 'firebase'

export const state = () => ({
  newUser: false,
  userDoc: null,
  trackParts: null
})

export const mutations = {
  setTrackParts (stateMutation, parts) {
    const sm = stateMutation

    sm.trackParts = parts
  }
}

export const actions = {
  fetchTrackParts ({ commit }) {
    commit('setTrackParts', true)
  }
}

export const getters = {
  trackParts: state => state.trackParts
}
