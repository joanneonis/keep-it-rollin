export const state = () => ({
  activeMessages: null,
  activeActions: null
})

export const mutations = {
  setActiveMessages (stateMutation, input) {
    const sm = stateMutation

    sm.activeMessages = input.messages
    if (input.actions) {
      sm.activeActions = input.actions
    }
  }
}
