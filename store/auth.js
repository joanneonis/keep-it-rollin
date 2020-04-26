/*
* authed { Boolean } is the user signed in?
* authInited { } fired after all autentication functions are done
* user { String } Username gotten from google profile
!* userId { String } Refrences with firestore collection
!* userSettings Object {
!*  -- calenderConnectionState { ENUM } not connected / skipped / connected
!*  -- notificationSettings
!* } user configurable settings
*/

import { gapi, loadAuth2WithProps } from 'gapi-script'
import firebase from 'firebase'

const credentiels = {
  apiKey: process.env.apiKey, // firebase web API key
  client_id: process.env.clientid, // oAuth client_id found in Google Cloud console
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  scope: 'https://www.googleapis.com/auth/calendar'
}

let auth2Instance // this.auth2

export const apiInstance = gapi // this.api

export const state = () => ({
  authed: false,
  authInited: false,
  user: null
})

export const mutations = {
  setInitState (stateMutation, boolean) {
    const sm = stateMutation

    sm.authInited = boolean
  },
  setAuthState (stateMutation, boolean) {
    const sm = stateMutation

    sm.authed = boolean
  },
  setUserState (stateMutation, user) {
    const sm = stateMutation

    sm.user = user
  },
  setApi (stateMutation, api) {
    const sm = stateMutation

    sm.api = api
  }
}

export const actions = {
  async checkLogin ({ commit }) {
    auth2Instance = await loadAuth2WithProps(credentiels)
    const isAuthed = auth2Instance.isSignedIn.get()

    commit('setAuthState', isAuthed)

    if (isAuthed) {
      const user = auth2Instance.currentUser.get().Qt.DW
      commit('setUserState', user)
      console.log('already authed', auth2Instance.currentUser.get().Qt.DW)
    } else {
      commit('setUserState', {})
    }

    commit('setInitState', true)

    // this.authInited = true
    return isAuthed
  },

  async initClient ({ commit }) {
    const that = this
    await apiInstance.load('client:auth2', async () => {
      await apiInstance.client.init(credentiels)
      commit('setClient', true)
      return apiInstance.auth2.getAuthInstance().isSignedIn.listen(that.authed)
    })
  },

  async handleAuth ({ commit }) {
    const googleAuth = apiInstance.auth2.getAuthInstance()
    const googleUser = await googleAuth.signIn()

    const token = googleUser.getAuthResponse().id_token
    const credential = firebase.auth.GoogleAuthProvider.credential(token)

    await firebase.auth().signInAndRetrieveDataWithCredential(credential)

    const user = auth2Instance.currentUser.get()

    commit('setUserState', user.Qt.DW)
    commit('setAuthState', true)
  },

  handleSignout ({ commit }) {
    const auth2 = apiInstance.auth2.getAuthInstance()
    firebase.auth().signOut()

    auth2.signOut().then(() => {
      commit('setUserState', '')
      commit('setAuthState', false)
    }).catch((error) => {
      console.log(error)
    })
  }
}

export const getters = {
  authInited: state => state.authInited,
  authed: state => state.authed
}
