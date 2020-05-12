/*
* authed { Boolean } is the user signed in?
* authInited { } fired after all autentication functions are done
* userData { Object } Userdata from firebase !!TODO create userdata inteface?
* userUid { String } Refrences with firestore collection
!* userSettings Object {
!*  -- calenderConnectionState { ENUM } not connected / skipped / connected
!*  -- notificationSettings
!* } user configurable settings
*/

import { gapi, loadAuth2WithProps } from 'gapi-script'
import firebase from 'firebase'
import { db } from '~/plugins/firebase'

let auth2Instance
const credentials = {
  apiKey: process.env.apiKey, // firebase web API key
  client_id: process.env.clientid, // oAuth client_id found in Google Cloud console
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  scope: 'https://www.googleapis.com/auth/calendar'
}

export const apiInstance = gapi

export const state = () => ({
  authed: false,
  authInited: false,
  userUid: null,
  userData: null
  // errorDetected: false
})

export const mutations = {
  // if true, loading authentication is done
  setInitState (stateMutation, boolean) {
    const sm = stateMutation

    sm.authInited = boolean
  },
  // update sign in state
  setAuthState (stateMutation, boolean) {
    const sm = stateMutation

    sm.authed = boolean
  },

  setUserId (stateMutation, uid) {
    const sm = stateMutation

    sm.userUid = uid
  },

  setUserData (stateMutation, user) {
    const sm = stateMutation

    sm.userData = user
  }
}

export const actions = {
  async checkLogin ({ commit, dispatch }) {
    // checks if user is signed in through gapi
    auth2Instance = await loadAuth2WithProps(credentials)
    const isAuthed = auth2Instance.isSignedIn.get()

    // double check also in fb auth
    firebase.auth().onAuthStateChanged(async function (user) {
      // User is signed in.
      if (user && isAuthed) {
        await getUserDocs(user.providerData[0])

        dispatch('setSignedIn', {
          userdata: user.providerData[0],
          userId: user.uid
        })
      } else {
        // No user is signed in.
        commit('setUserData', {})
        commit('setInitState', true)
      }
    })
  },

  async initClient () {
    const that = this
    await apiInstance.load('client:auth2', async () => {
      await apiInstance.client.init(credentials)
      return apiInstance.auth2.getAuthInstance().isSignedIn.listen(that.authed)
    })
  },

  async handleAuth ({ commit, dispatch }) {
    const googleAuth = apiInstance.auth2.getAuthInstance()
    const googleUser = await googleAuth.signIn()

    const token = googleUser.getAuthResponse().id_token
    const credential = firebase.auth.GoogleAuthProvider.credential(token)

    let firebaseResponse
    try {
      firebaseResponse = await firebase.auth().signInWithCredential(credential)
    } catch (error) {
      console.log(error)
    }

    const userData = await getUserDocs(firebaseResponse.user)

    dispatch('setSignedIn', {
      userdata: userData,
      userId: firebaseResponse.user.uid
    })
  },

  async setSignedIn ({ commit, dispatch }, params) {
    const { userId, userdata } = params

    commit('setUserId', userId)
    commit('setUserData', userdata)
    commit('setAuthState', true)
    await dispatch('track/getTrack', null, { root: true })
    commit('setInitState', true)
  },

  handleSignout ({ commit }) {
    const auth2 = apiInstance.auth2.getAuthInstance()
    firebase.auth().signOut()

    auth2.signOut().then(() => {
      commit('setUserState', '')
      commit('setUserData', {})
      commit('setAuthState', false)
    }).catch((error) => {
      console.log(error)
    })
  }
}

export const getters = {
  signedInState: (stateAuth) => {
    if (!stateAuth.authInited) { return false }
    if (stateAuth.authed) { return true }
    if (!stateAuth.authed) { return false }
    return false
  }
}

function getUserDocs (firebaseUser) {
  const UID = firebaseUser.uid
  const ref = db.collection('users')
  return ref.doc(UID)
    .get().then(
      async (doc) => {
        let userData

        if (doc.exists) {
          // userdoc exists getting data
          userData = doc.data()
        } else {
          // new user, create doc
          userData = {
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL
          }

          await ref.doc(UID).set(userData)
        }

        return userData
      })
}
