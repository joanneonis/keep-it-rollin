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
import moment from 'moment'
import { db } from '~/plugins/firebase'
import { uuidv4 } from '~/helpers/trackHelpers'

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
  userData: null,
  freePlay: false
})

export const mutations = {
  setInitState (stateMutation, boolean) { stateMutation.authInited = boolean }, // if true, loading authentication is done
  setAuthState (stateMutation, boolean) { stateMutation.authed = boolean }, // update sign in state
  setUserId (stateMutation, uid) { stateMutation.userUid = uid },
  setUserData (stateMutation, user) { stateMutation.userData = user }
}

export const actions = {
  /*
  * Checks all signed in methods (local and Gapi + Firbease login)
  * and updates store userdata
  */
  async checkLogin ({ commit, dispatch }) {
    // check localSession
    if (hasLocalSession()) {
      dispatch('setSignedIn', {
        userdata: { displayName: 'player' },
        userId: hasLocalSession().freeplay
      })
    }

    // checks if user is signed in through gapi
    auth2Instance = await loadAuth2WithProps(credentials)
    const isAuthed = auth2Instance.isSignedIn.get()

    // double check also in fb auth
    firebase.auth().onAuthStateChanged(async function (user) {
      // User is signed in.
      if (user && isAuthed) {
        // get stored userdata
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

  /*
  * Init Gapi client
  * Client is used for retrieving Google (Calendar) Data
  */
  async initClient () {
    const that = this
    await apiInstance.load('client:auth2', async () => {
      await apiInstance.client.init(credentials)
      return apiInstance.auth2.getAuthInstance().isSignedIn.listen(that.authed)
    })
  },

  async handleAuth ({ commit, dispatch }) {
    // Signin Google
    const googleAuth = apiInstance.auth2.getAuthInstance()
    const googleUser = await googleAuth.signIn()

    // Use same token for Firebase login
    const token = googleUser.getAuthResponse().id_token
    const credential = firebase.auth.GoogleAuthProvider.credential(token)

    try {
      const firebaseResponse = await firebase.auth().signInWithCredential(credential)
      const userData = await getUserDocs(firebaseResponse.user)

      dispatch('setSignedIn', {
        userdata: userData,
        userId: firebaseResponse.user.uid
      })
    } catch (error) {
      console.log(error)
    }
  },

  // updates all userdata and gets trackData
  async setSignedIn ({ commit, dispatch }, params) {
    commit('setInitState', false)
    const { userId, userdata } = params

    commit('setUserId', userId)
    commit('setUserData', userdata)
    commit('setAuthState', true)
    await dispatch('track/getTrack', null, { root: true })
    commit('setInitState', true)
  },

  // Sign out in all instances
  handleSignout ({ commit }) {
    // Firebase signout
    firebase.auth().signOut()

    // Remove localStorage freeplayMode
    localStorage.clear()

    apiInstance.auth2.getAuthInstance().signOut().then(() => {
      commit('setUserState', '')
      commit('setUserData', {})
      commit('setAuthState', false)
    }).catch((error) => {
      console.log(error)
    })
  },

  // Set signin method (localstorage) for freePlay
  handleFreePlay ({ commit, dispatch }) {
    localStorage.setItem('freeplayToken', uuidv4())
    localStorage.setItem('freeplaySession', moment().format('DDMMYYYY'))

    dispatch('setSignedIn', {
      userdata: { displayName: 'speler' },
      userId: uuidv4()
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

function hasLocalSession () {
  const freeplay = localStorage.getItem('freeplayToken')
  const lastFreeSession = localStorage.getItem('freeplaySession')

  if (freeplay && lastFreeSession === moment().format('DDMMYYYY')) {
    return { freeplay, lastFreeSession }
  } else {
    return false
  }
}
