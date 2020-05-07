<template>
  <div class="scene-popup">
    <strong>{{ popupData.title }}</strong>
    <span>{{ popupData.description }}</span>
    <ul class="list-unstyled scene-popup__list">
      <li class="scene-popup__list__item">
        <img src="~/assets/img/popup-energy.png" alt="Energie niveau">
        {{ popupData.energy }}
      </li>
      <li class="scene-popup__list__item">
        <img src="~/assets/img/popup-booster.png" alt="Booster toegevoegd?">
        booster toegevoegd?
      </li>
      <li class="scene-popup__list__item">
        <img src="~/assets/img/popup-calendar.png" alt="Kalenderitem bekijken">
        Kalenderitem bekijken
      </li>
    </ul>

    <button class="button-link button-link--primary button-link--has-icon">
      <img class="button-link__icon" src="~/assets/img/icon-edit.svg" alt="Bewerk item">
      aanpassen
    </button>
  </div>
</template>

<script>
import { getEnergyDescription, staticPartTexts } from '~/helpers/trackHelpers'

export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },

  computed: {
    // temp placeholderdata
    popupData () {
      return {
        title: this.data.title || this.data.type || this.data.category,
        description: this.data.note || this.getTypeDescription(this.data.type),
        energy: getEnergyDescription(this.data.energyLevel)
      }
    }
  },

  methods: {
    getTypeDescription (type) {
      if (!type) { return '' }
      return staticPartTexts[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.scene-popup {
  $padding: 17px;

  position: fixed;
  width: rem(220px);
  left: 0;
  right: 0;
  margin: auto;
  bottom: 15vh;
  background: #FFFFFF;
  box-shadow: 0 1px 2px 0 rgba(25, 49, 83, 0.05), 0 2px 24px 0 rgba(51, 52, 87, 0.07);
  border-radius: rem(10px);
  padding: $padding;

  font-size: rem(10px);

  strong {
    width: 100%;
    display: inline-block;
  }

  &::before {
    $triangle-size: 12px;

    content: '';
    width: 0;
    height: 0;
    border-left: $triangle-size solid #0000;
    border-right: $triangle-size solid #0000;
    border-bottom: $triangle-size solid #fff;
    margin: -($triangle-size + $padding) 0 ($triangle-size) $triangle-size / 2;
    display: block;
  }

  .button-link {
    float: right;
    padding-bottom: 0;
    padding-right: 0;
  }

  &-enter-active,
  &-leave-active {
    transition: all .2s .3s;
  }

  &-enter,
  &-leave-to {
    transform: translate(0, rem(15px));
    opacity: 0;
  }

  .scene--first-part,
  .scene--task,
  .scene--booster {
    pointer-events: none;

    &{
      right: calc(50vw + 200px); // 200px is also in the zoomTo function in baseScene
    }
  }
}

.scene-popup__list {
  margin-top: 13px;
  max-width: rem(180px);

  &__item {
    display: flex;
    align-items: center;
    margin-bottom: rem(4px);
    font-weight: 700;
    color: #213464;

    img {
      width: 27px;
      margin-right: 11px;
    }
  }
}

</style>
