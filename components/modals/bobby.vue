<template>
  <div class="bot-modal">
    <div class="form-field">
      <input placeholder="Heb je een vraag voor me? Of ben je opzoek naar een booster? " type="text" name="search" id="search">
    </div>
    <div class="modal-scrollcontainer">
      <div class="bot-modal__section">
        <h4>Uitleg baandelen</h4>
        <p>Alle baandelen nog eens op een rijtje.</p>

        <trackpart-slider />
      </div>

      <div class="bot-modal__section">
        <a
          class="button button--secondary button--sm add-idea"
          @click="$store.dispatch('modal/setActiveModal', 'createIdea')"
        >
          Idee toevoegen
        </a>
        <h4>Boosters</h4>
        <p>Opzoek naar een booster? Of zelf een goed idee?</p>

        <div class="panel-booster">
          <idea-list
            class="boosters"
            category="Beweging"
            type="list"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import trackpartSlider from '~/components/trackpartSlider'
import ideaList from '~/components/trackCreation/ideaList'

export default {
  components: {
    trackpartSlider,
    ideaList
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
.bot-modal {
  margin: 0 rem(-30px);
  width: calc(100% + 80px);

  &__section {
    margin-bottom: rem(40px);
  }
}

.modal-scrollcontainer {
  padding: 0 rem(60px);
}

.form-field {
  margin-bottom: rem(20px);
  padding: 0 rem(60px);
}

.panel-booster {
  margin: 0 rem(-50px);
  width: calc(100% + 140px);
  border-radius: 15px;
  background: gray-color(150);
}

.add-idea {
  float: right;
}
</style>
