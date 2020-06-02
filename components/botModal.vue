<template>
  <div class="wrapper">
    <div class="form-field">
      <input placeholder="Heb je een vraag voor me? Of ben je opzoek naar een booster? " type="text" name="search" id="search">
    </div>
    <div>
      <h4>Uitleg baandelen</h4>
      <p>Alle baandelen nog eens op een rijtje.</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      modalAction: state => state.modal.action
    })
  },

  watch: {
    modalAction (val) {
      console.log('received modal action', val)

      if (val === 'close') {
        this.$store.dispatch('modal/closeModal')
      }
    }
  },

  mounted () {
    this.$store.commit('modal/setHeader', { title: 'Kan ik je helpen?', description: 'Ben je ergens naar opzoek? Vraag het hier, en ik zoek het voor je op 👌' })
    this.$store.commit('modal/setActions', [
      {
        action: 'close',
        text: 'sluiten'
      }
    ])
  }
}
</script>
