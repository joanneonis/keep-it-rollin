import { gapi, loadAuth2WithProps } from 'gapi-script'

const credentials = {
  apiKey: process.env.apiKey,
  client_id: process.env.clientid,
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  scope: 'https://www.googleapis.com/auth/calendar'
}

export class GoogleAuth {
  items;
  api;
  isAuthed;
  auth2;
  user;
  client;

  constructor () {
    this.api = gapi
    this.initialize()
  }

  async initialize () {
    this.api = gapi
    await gapi.load('client:auth2', this.initClient.bind(this))

    this.auth2 = await loadAuth2WithProps(credentials)
    this.isAuthed = this.auth2.isSignedIn.get()

    if (this.isAuthed) {
      this.user = this.auth2.currentUser.get()
      // this.$store.commit('auth/setAuthState', true)
      // this.$store.commit('auth/setUserState', this.user)
    } else {
      this.user = undefined
      // this.$store.commit('auth/setAuthState', false)
    }
  }

  initClient () {
    return this.api.client.init(credentials).then((e) => {
      // Listen for sign-in state changes.
      return this.api.auth2.getAuthInstance().isSignedIn.listen(this.isAuthed)
    }).catch((error) => {
      console.log('Api client not inited', error)
    })
  }

  /*
   *  Sign in the user upon button click.
   */
  async handleAuthClick (event) {
    const auth2 = gapi.auth2.getAuthInstance()

    await auth2.signIn().then(() => {
      this.user = this.auth2.currentUser.get()
      this.isAuthed = true
      // this.$store.commit('auth/setAuthState', true)
      // this.$store.commit('auth/setUserState', this.user)

      return this.user
    })
  }

  /*
   *  Sign out the user upon button click.
   */
  async handleSignoutClick (event) {
    const auth2 = gapi.auth2.getAuthInstance()

    await auth2.signOut().then(() => {
      this.isAuthed = false
      // this.$store.commit('auth/setAuthState', false)
      // this.$store.commit('auth/setUserState', {})

      return {}
    })
  }
}
