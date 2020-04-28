/* track
!* viewState { ENUM } as overview or playing etc.
!* activeParts { trackPart } what trackparts are placed
!* date { Timestamp } what day is active (usually today)
*/

import moment from 'moment'
import firebase from 'firebase'
// import { db } from '~/plugins/firebase'

export const state = () => ({
  //
})

export const mutations = {
  //
}

export const actions = {
  //
}

export const getters = {
  //
}

// eslint-disable-next-line no-unused-vars
function checkTrack (ref) {
  const docRefDate = moment().format('DDMMYYYY')
  const todaysTrack = ref.collection('tracks').doc(docRefDate)

  todaysTrack
    .get().then(
      (doc) => {
        if (doc.exists) {
          console.log('track exists', doc.data(), doc.data().createdAt.toDate())
        } else {
          console.log('track does not exist yet, first trackpart')
          todaysTrack.set({
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            trackParts: []
          })
        }
      }
    )
}
