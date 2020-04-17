export const state = () => ({
  authed: false,
  user: {},
  client: null
})

export const mutations = {
  setAuthState (stateMutation, boolean) {
    const sm = stateMutation

    sm.authed = boolean
  },
  setUserState (stateMutation, user) {
    const sm = stateMutation

    sm.user = user
  }
}
