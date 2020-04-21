import { gapi, loadAuth2WithProps } from 'gapi-script'

const credentiels = {
  apiKey: process.env.apiKey,
  client_id: process.env.clientid,
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  scope: 'https://www.googleapis.com/auth/calendar'
}

let auth2Instance // this.auth2

export const apiInstance = gapi // this.api

export const state = () => ({
  authed: false,
  authInited: false,
  user: null,
  clientInited: false
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
  },
  setClient (stateMutation, boolean) {
    const sm = stateMutation

    sm.clientInited = boolean
  }
}

export const actions = {
  async checkLogin ({ commit }) {
    // if (this.authInited) { return this.isAuthed }

    // console.log(this.initClient)
    // await gapi.load('client:auth2', this.initClient)

    auth2Instance = await loadAuth2WithProps(credentiels)
    const isAuthed = auth2Instance.isSignedIn.get()

    commit('setAuthState', isAuthed)
    commit('setInitState', true)

    if (isAuthed) {
      const user = auth2Instance.currentUser.get().getBasicProfile().vW
      commit('setUserState', user)
    } else {
      commit('setUserState', {})
    }

    console.log('Checked login status', this.isAuthed)

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

  handleAuth ({ commit }) {
    const auth2 = apiInstance.auth2.getAuthInstance()

    auth2.signIn().then((e) => {
      console.log('signin accepted scopes', e.uc.scope)
      const user = auth2Instance.currentUser.get()
      commit('setUserState', user.Qt.vW)
      commit('setAuthState', true)
    }).catch((error) => {
      console.log(error)
    })
  },

  handleSignout ({ commit }) {
    const auth2 = apiInstance.auth2.getAuthInstance()

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
