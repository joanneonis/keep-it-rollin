<template>
  <section>
    <h3>Opgehaalde kalenderitems</h3>
    <p>Voorbeeld Calendarkoppeling, het ophalen van items.</p>
    <ul>
      <li
        v-for="item in calendarItems"
        :key="item.id"
      >
        <a
          :href="item.htmlLink"
          target="_blank"
        >
          {{ item.summary }}
        </a>
      </li>
    </ul>
  </section>
</template>

<script>
import { apiInstance } from '~/store/auth'

export default {
  data () {
    return {
      calendarItems: null
    }
  },

  mounted () {
    this.getCalendarItems()
  },

  methods: {
    async getCalendarItems () {
      try {
        const calendarItems = await apiInstance.client.calendar.events.list({
          calendarId: 'primary',
          timeMin: (new Date()).toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 10,
          orderBy: 'startTime'
        })

        this.calendarItems = calendarItems.result.items
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
