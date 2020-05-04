export const trackViewStates = {
  OVERVIEW: 'overview',
  CREATION: {
    FIRST: 'first-part',
    TASK: 'task',
    TASKBOOSTER: 'task-booster',
    BOOSTER: 'booster'
  },
  ZOOM: 'zoom',
  BIRDSEYE: 'birdseye'
}

export const trackPartTypes = {
  ENERGY: 'Start van de dag',
  MEETING: 'Meeting',
  SMALLTASKS: 'Losse taken',
  WORKBLOCK: 'Werkblok'
}

export const trackPartData = {
  type: null,
  energyLevel: 50,
  note: ''
}
