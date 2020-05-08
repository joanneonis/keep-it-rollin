/* track
* viewState { ENUM } as overview or playing etc.
* activeParts { trackPart } what trackparts are placed
* date { Timestamp } what day is active (usually today)
* trackData { Object } metadata about the track (like creationtime etc.)
* action { String } save, update, cancel etc. // TODO ENUM
* controls { String } three camera controls (like zoom to.. etc) // TODO ENUM
*/

import moment from 'moment'
import firebase from 'firebase'
import { db } from '~/plugins/firebase'
import { trackViewStates, trackPartData } from '~/helpers/trackHelpers'

export const state = () => ({
  activeParts: [],
  activeLocalPart: trackPartData,
  trackData: null,
  date: moment().format('DDMMYYYY'),
  trackInited: false,
  viewState: trackViewStates.OVERVIEW,
  action: null,
  controls: null,
  trackPartTransforms: 0
})

export const mutations = {
  setAction (stateMutation, action) {
    const sm = stateMutation

    sm.action = action
  },

  setControls (stateMutation, control) {
    const sm = stateMutation

    sm.controls = control
  },

  viewState (stateMutation, state) {
    const sm = stateMutation

    sm.viewState = state
  },

  setActiveLocalPart (stateMutation, part) {
    const sm = stateMutation
    sm.activeLocalPart = part
  },

  setTrackInited (stateMutation, boolean) {
    const sm = stateMutation

    sm.trackInited = boolean
  },

  setDeforms (stateMutation, deform) {
    const sm = stateMutation

    sm.trackPartTransforms = deform
  },

  // gets trackparts form trackdoc
  setTrack (stateMutation, trackDoc) {
    const sm = stateMutation

    sm.activeParts = trackDoc.trackParts

    const reducedTrackData = Object.keys(trackDoc)
      .reduce((obj, key) => {
        if (key !== 'trackParts') {
          obj[key] = trackDoc[key]
        }
        return obj
      }, {})

    sm.trackData = reducedTrackData
  },

  addTrackPart (stateMutation, trackPart) {
    const sm = stateMutation

    sm.activeParts.push(trackPart)
  }
}

export const actions = {
  async getTrack ({ commit, rootState }) {
    // if user is not signed in, do not try to fetch
    if (!rootState.auth.userUid) { return }
    const track = await checkTrack(db.collection('users').doc(rootState.auth.userUid))
    if (!track.trackParts || track.trackParts.length === 0) {
      commit('viewState', trackViewStates.CREATION.FIRST)
    }

    commit('setTrack', track)
    commit('setTrackInited', true)
  },

  setTrackPart ({ commit, dispatch, rootState }, trackPartData) {
    const docRefDate = moment().format('DDMMYYYY')
    const todaysTrack = db.collection('users').doc(rootState.auth.userUid).collection('tracks').doc(docRefDate)

    // before push to fb, add creation time
    trackPartData.createdAt = firebase.firestore.Timestamp.now()

    // adds item to field array
    todaysTrack.update({
      trackParts: firebase.firestore.FieldValue.arrayUnion(trackPartData)
    }).catch((error) => {
      console.log(error)
    })

    commit('addTrackPart', trackPartData)
    // get newly added item from fb
    dispatch('getTrack')
  }
}

export const getters = {
  energyLevel: stateTrack => stateTrack.activeLocalPart.energyLevel,
  avarageEnergyLevel: (stateTrack) => {
    if (stateTrack.activeParts.length === 0) { return 50 }
    const sumLevel = stateTrack.activeParts.reduce(function (a, b) {
      return a + parseInt(b.energyLevel)
    }, 0)

    return sumLevel / stateTrack.activeParts.length
  }
}

function checkTrack (ref) {
  const docRefDate = moment().format('DDMMYYYY')
  const todaysTrack = ref.collection('tracks').doc(docRefDate)

  return todaysTrack
    .get().then(
      (doc) => {
        if (doc.exists) {
          console.log('track exists', doc.data(), doc.data().createdAt.toDate())
          return doc.data()
        } else {
          console.log('track does not exist yet, first trackpart')
          const trackObject = {
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            trackParts: []
          }
          todaysTrack.set(trackObject)
          return trackObject
        }
      }
    )
}
