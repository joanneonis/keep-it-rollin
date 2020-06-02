<template>
  <div class="wrapper">
    <div class="form-field">
      <input placeholder="Heb je een vraag voor me? Of ben je opzoek naar een booster? " type="text" name="search" id="search">
    </div>
    <div class="modal-scrollcontainer">
      <h4>Uitleg baandelen</h4>
      <p>Alle baandelen nog eens op een rijtje.</p>

      <trackpart-slider />

      <h4>Boosters</h4>
      <p>Opzoek naar een booster? Of zelf een goed idee?</p>

      <booster-list class="boosters" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import trackpartSlider from '~/components/info/trackpartSlider'
import boosterList from '~/components/info/boosterList'

export default {
  components: {
    trackpartSlider,
    boosterList
  },

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

<style lang="scss" scoped>
.wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: rem(-30px);
  right: rem(-30px);
}

.modal-scrollcontainer {
  height: calc(100% - 45px); // minus height search
  display: flex;
  flex-flow: column;
  overflow: auto;
  padding: 0 rem(60px);
}

.form-field {
  margin-bottom: rem(20px);
  padding: 0 rem(60px);
}

.boosters {
  margin: 0 rem(-50px);
  width: calc(100% + 140px)
}
</style>
