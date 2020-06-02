<template>
  <div class="trackpart-slider">
    <VueSlickCarousel v-bind="settings" ref="carousel">
      <div
        v-for="(part, key) in trackparts"
        :key="key"
        class="trackpart"
      >
        <div class="trackpart__content">
          <h4>{{ part.title }}</h4>
          <div v-html="$md.render(part.description)" />
        </div>
        <div class="trackpart__figure">
          <img src="~/assets/img/temp/gedachtensmurrie.png" alt="">
        </div>
      </div>
    </VueSlickCarousel>

    <button
      class="button-link button-link--primary"
      @click="$refs.carousel.prev()"
    >
      <img src="~/assets/img/icon-prev.svg" class="icon" alt="">
      <span>Vorig baandeel</span>
    </button>
    <button
      class="button-link button-link--primary"
      @click="$refs.carousel.next()"
    >
      <img src="~/assets/img/icon-next.svg" class="icon" alt="">
      <span>Volgend baandeel</span>
    </button>
  </div>
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'

export default {
  components: { VueSlickCarousel },

  data () {
    return {
      trackparts: [
        {
          title: 'Meeting',
          description: 'Na elke meeting blijft een deel van je brein hangen. Je balletje rolt dan door ‘gedachtensmurrie’. \n\nZorg dat je je balletje wel weer schoon maakt om verdere vertraging te voorkomen!'

        },
        {
          title: 'Werkblok',
          description: 'Tijdens een werkblok ben je een langere tijd gefocust aan het werk. In de baan belandt je bal daarom letterlijk in een ‘blok’, waar hij pas uit komt als je klaar bent. '
        },
        {
          title: 'Losse taken',
          description: 'Simpele losse taken geven je brein veel ruimte voor afleiding. In de baan botst je balletje ondertussen tegen allerlei ‘afleidingsblokken’ aan. '
        },
        {
          title: 'Start van de dag',
          description: 'Er zijn veel factoren die invloed hebben op je productiviteit. Gun jezelf een eerlijke start en geef aan met hoeveel energie je de dag ingaat. De baan houdt er rekening mee als de dag even niet zo lekker begint.'
        },
        {
          title: 'Booster',
          description: 'Als je naar de tips van Bobby luistert, krijg je een booster in je baan. Boosters geven je balletje net dat extra zetje, waardoor je met gemak naar het einde van de dag rolt.'
        }
      ],
      settings: {
        arrows: false,
        dots: true,
        slidesToShow: 1.1,
        centerMode: true,
        centerPadding: '5px'
      }
    }
  }
}
</script>

<style lang="scss">
.trackpart-slider {
  margin-right: rem(-30px);
  margin-bottom: 20px;
}

.trackpart {
  background: gray-color(150);
  border-radius: 15px;
  padding: 20px;
  display: flex!important;
  max-width: calc(100% - 40px);
  margin-left: rem(50px);

  &__figure img {
    max-width: 300px;
  }

  &__content {
    display: flex;
    flex-flow: column;
    justify-content: center;
    padding: rem(20px);
  }
}

.slick-dots {
  position: absolute;
  bottom: -45px;
  display: flex!important;
  list-style: none;
  right: 0;

  li {
    font-size: 0;
    line-height: 0;
    color: transparent;
    margin-right: 12px;

    &::before {
      background: gray-color(200);
      width: rem(7px);
      height: rem(7px);
      margin-right: rem(10px);
    }

    button {
      display: none;
    }

    &.slick-active::before {
      background: theme-color(primary);
    }
  }
}
</style>
