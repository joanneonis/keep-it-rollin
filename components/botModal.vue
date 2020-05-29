<template>
  <div>
    <img style="width: 100%" src="~/assets/img/temp/bot.png" alt="">
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
    this.$store.commit('modal/setHeader', { title: 'Tijdelijk plaatje', description: '' })
    this.$store.commit('modal/setActions', [
      {
        action: 'close',
        text: 'sluiten'
      }
    ])
  }
}
</script>
