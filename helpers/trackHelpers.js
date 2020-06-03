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

export const staticPartTexts = {
  Meeting: 'Bij elke meeting blijft een deel van je brein hangen, hierdoor ben je minder scherp.',
  'Losse taken': 'Bij een simpele taak dwaalt je brein gemakkelijk af. Zorg dat er weinig ruimte overblijft voor afleiding',
  Werkblok: 'Tijdens een werkblok ben je een langere tijd gefocust aan het werk. Voor het krijgen van nieuwe inzichten is het belangrijk om te ‘ontfocussen’',
  Beweging: 'Even bewegen...',
  Creatief: 'Een creatieve pauze...',
  Energiek: 'Een energieke pauze...',
  Ontspanning: 'Een ontspannende pauze...',
  'Even eruit': 'Even er tussenuit...',
  Tussendoortje: 'Een snelle pauze'
}

export function getEnergyDescription (energy) {
  if (energy < 25) {
    return { text: 'Geen energie', img: 'slecht' }
  }
  if (energy >= 25 && energy < 50) {
    return { text: 'Enigszins moeizaam', img: 'matig' }
  }
  if (energy >= 50 && energy < 75) {
    return { text: 'Prima', img: 'prima' }
  }
  if (energy >= 75) {
    return { text: 'Vol energie!', img: 'blij' }
  }
}

export function uuidv4 () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0; const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const basePosY = 0.08
const baseXshift = 2
const rotationStrength = 33

export function getPosAndRotation (index) {
  if (index === 0) {
    return [[0.5, basePosY, 0], rotationStrength + 10]
  } else {
    const caseMod = (index % 4)
    switch (caseMod) {
      case 0:
        return [[0, basePosY, index * 1.5], 0]
      case 1:
        return [[baseXshift / 1.5, basePosY, index * 1.5], rotationStrength]
      case 2:
        return [[baseXshift, basePosY, index * 1.5], 0]
      case 3:
        return [[baseXshift / 1.5, basePosY, index * 1.5], -rotationStrength]
    }
  }
}
