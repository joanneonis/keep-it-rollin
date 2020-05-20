<template>
  <div>
    <h3>idee toevoegen</h3>
    <p>Leuk je hebt een idee!</p>

    <div class="form-fields">
      <div class="form-field">
        <div class="form-field__label">
          Bij welke categorie(en) past het goed?
        </div>
        <div class="form-field__checkboxes">
          <label
            v-for="(checkbox, i) in checkboxes"
            :key="i"
            class="checkbox"
          >{{ checkbox }}
            <input
              type="checkbox"
              :value="checkbox"
              name="checkbox"
              @input="selectCategory(checkbox, $event)"
            >
          </label>
        </div>

        <div class="category-help">
          <strong>Uitleg bij de categorie</strong>
          <span class="type--muted" v-if="selectedCategories.length === 0"><br>Geen categorie gekozen</span>
          <span
            v-for="(item, key) in selectedCategories"
            :key="key"
          >
            <br>
            <strong class="type--highlight">{{ item }}:</strong>
            {{ helpText[item] }}
          </span>
        </div>
      </div>
      <div class="form-field">
        <label for="note">
          Hoe heet het?
        </label>
        <input
          id="title"
          v-model="title"
          placeholder="Weet je een korte titel voor je activiteit?"
          type="text"
          name="title"
        >
      </div>
      <div class="form-field">
        <label for="note">
          Wil je het kort uitleggen?
        </label>
        <textarea
          id="note"
          v-model="description"
          placeholder="Waarom is het leuk? Hoe werkt het?"
          name="note"
          cols="30"
          rows="10"
        />
      </div>
    </div>

    <button
      class="button button--primary"
      @click="saveIdea()"
    >
      Opslaan
    </button>
  </div>
</template>

<script>
import firebase from 'firebase'
import { db } from '~/plugins/firebase'
import { staticPartTexts, uuidv4 } from '~/helpers/trackHelpers'

export default {
  data () {
    return {
      checkboxes: [
        'Ontspanning',
        'Creatief',
        'Beweging'
      ],
      selectedCategories: [],
      uuid: null,
      title: null,
      description: null,
      helpText: staticPartTexts
    }
  },

  computed: {
    ideaItem () {
      return {
        title: this.title,
        description: this.description,
        uuid: this.uuid,
        categories: this.selectedCategories,
        userName: this.$store.state.auth.userData.displayName,
        userId: this.$store.state.auth.userUid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        type: 'user'
      }
    }
  },

  mounted () {
    this.uuid = uuidv4()
  },

  methods: {
    async saveIdea () {
      if (this.title) {
        // TODO save to firebase
        await db.collection('activities').add(this.ideaItem)
        await db.collection('users').doc(this.$store.state.auth.userUid).collection('ideas').add(this.ideaItem)

        const userStatsRef = db.collection('users').doc(this.$store.state.auth.userUid).collection('stats')
        await userStatsRef.doc('ideas').get().then(
          (doc) => {
            if (doc.exists) {
              doc.update({ ideasAdded: firebase.firestore.FieldValue.increment(1) })
            } else {
              userStatsRef.doc('ideas').set({
                ideasAdded: 1,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
              })
            }
          }
        )

        this.$store.dispatch('modal/closeModal')
      } else {
        alert('titel is verplicht')
      }
    },

    selectCategory (cat, e) {
      if (!this.selectedCategories.includes(cat)) {
        this.selectedCategories.push(cat)
        e.target.checked = true
      } else {
        this.selectedCategories = this.selectedCategories.filter(e => e !== cat)
        e.target.checked = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-field {
  width: 100%;
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}

.form-field__checkboxes {
  justify-content: center;
}

.category-help {
  margin: 10px 0;
}
</style>
