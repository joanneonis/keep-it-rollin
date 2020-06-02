<template>
  <div class="trackpart-slider">
    <div class="trackpart">
      <div class="trackpart__content">
        <h4>Meeting baandeel</h4>
        <p>
          Na elke meeting blijft een deel van je brein hangen. Je balletje rolt dan door ‘gedachtensmurrie’. <br><br>
          Zorg dat je je balletje wel weer schoon maakt om verdere vertraging te voorkomen!
        </p>
      </div>
      <div class="trackpart__figure">
        <img src="~/assets/img/temp/gedachtensmurrie.png" alt="">
      </div>
    </div>

    <button
      class="button-link button-link--primary is-muted"
    >
      <img src="~/assets/img/icon-prev.svg" class="icon" alt="">
      <span>Vorig baandeel</span>
    </button>
    <button
      class="button-link button-link--primary"
    >
      <img src="~/assets/img/icon-next.svg" class="icon" alt="">
      <span>Volgend baandeel</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.trackpart-slider {
  margin-right: rem(-30px);
  margin-bottom: 20px;
}

.trackpart {
  background: gray-color(150);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  max-width: calc(100% - 40px);

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
</style>
