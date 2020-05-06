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

export function uuidv4 () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0; const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
