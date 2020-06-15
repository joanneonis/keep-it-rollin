/*
* activeMessages { Array<string> } messages as seen on screen
* activeActions { Array<string> } buttons as seen on screen
* storyId { Number } unique id
* clickedAction { String } user clicked action
* timer { Number } delay in Millis. Timer is disabled when 0. After timer fires messages are hidden
*/

export const state = () => ({
  activeMessages: [],
  activeActions: null,
  storyId: null,
  clickedAction: null,
  timer: 0
})

export const mutations = {
  // sets messages for the bot to display
  setActiveMessages (stateMutation, input) {
    const sm = stateMutation

    if (!input) { return }

    sm.activeMessages = input.messages
    sm.storyId = input.storyId
    if (input.actions) {
      sm.activeActions = input.actions
    }
    if (input.timer) {
      sm.timer = input.timer
    }
  },

  // add actions
  setAction (stateMutation, action) {
    const sm = stateMutation
    sm.clickedAction = action
  },

  // set timer after which the messages dissapear
  setTimer (stateMutation, time) {
    const sm = stateMutation
    sm.timer = time
  },

  // delete active messages
  setToIdle (stateMutation) {
    const sm = stateMutation
    sm.storyId = 999999
    sm.activeMessages = ['Advies nodig?']
    sm.activeActions = null
    sm.clickedAction = null
    sm.timer = 0
  }
}
