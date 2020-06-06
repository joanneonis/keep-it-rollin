<template>
  <div class="energy-modal">
    <energy-level class="energy-level--big" />
    <div class="energy-chart--container">
      <strong>Dag verloop</strong>
      <canvas ref="chart" class="energy-chart" height="250" />
    </div>
  </div>
</template>

<script>
import { Chart } from 'chart.js'
import energyLevel from '~/components/trackComponents/energyLevel'

export default {
  components: {
    energyLevel
  },

  computed: {
    energyLevels () {
      return this.$store.getters['track/energyParts'].map(part => parseInt(part.energyLevel))
    },
    energyLabels () {
      return this.$store.getters['track/energyParts'].map(part => (part.startTime))
    },
    energyTitles () {
      return this.$store.getters['track/energyParts'].map(part => (part.note || part.title))
    },
    energyTypes () {
      return this.$store.getters['track/energyParts'].map(part => (part.type))
    }
  },

  mounted () {
    this.$store.commit('modal/setHeader', { title: 'Energie', description: 'Om lekker aan het werk te blijven heb je energie nodig, zo hou je het balletje rollende. Bekijk hier jouw dag!' })
    this.$store.commit('modal/setActions', [
      {
        action: 'close',
        text: 'sluiten'
      }
    ])
    this.initChart()
  },

  methods: {
    initChart () {
      const that = this
      const ctx = this.$refs.chart.getContext('2d')
      // eslint-disable-next-line no-unused-vars
      const myChart = new Chart(ctx, {
        type: 'line',
        responsive: true,
        data: {
          labels: this.energyLabels,
          datasets: [{
            label: 'Energie-niveau',
            data: this.energyLevels,
            borderWidth: 2,
            borderColor: '#1B34F1',
            fill: false
          }]
        },
        options: {
          legend: {
            display: false
          },
          tooltips: {
            callbacks: {
              title (tooltipItem, data) {
                const index = tooltipItem[0].index
                return that.energyTypes[index]
              },
              label (tooltipItem, data) {
                const index = tooltipItem.index
                return `Energie: ${that.energyLevels[index]}%` // Gestart om: ${that.energyLabels[index]}
              },
              afterLabel (tooltipItem, data) {
                const index = tooltipItem.index
                const description = that.energyTitles[index]
                return description
              }
            },
            backgroundColor: '#E9ECF3',
            titleFontSize: 16,
            titleFontColor: '#1B34F1',
            bodyFontColor: '#000',
            bodyFontStyle: 'bold',
            footerFontStyle: 'regular',
            bodyFontSize: 14,
            displayColors: false
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                suggestedMax: 100
              }
            }]
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.energy-modal {
  width: 100%;
}
.energy-chart {
  width: 100%;
  height: 300px;
  margin-top: 10px;

  &--container {
    padding: 20px;
  }
}

.energy-level--big {
  background: gray-color(150);
  padding: 10px;
  margin: 0 -20px 10px -20px;
  border-radius: 10px;
  font-size: 16px;
  flex-direction: row-reverse;
  padding: 20px;
  justify-content: flex-end;

  .energy-status__info {
    text-align: left;
    padding-left: 20px;
  }
}
</style>
