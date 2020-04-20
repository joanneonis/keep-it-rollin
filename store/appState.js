export const state = () => ({
  calendarSkipped: true
})

export const mutations = {
  setCalendar (stateMutation, boolean) {
    const sm = stateMutation
    sm.calendarSkipped = boolean
  }
}
