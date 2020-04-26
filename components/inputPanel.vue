<template>
  <section class="input-panel">
    <div class="input-panel__header">
      <h2>Yes, een nieuwe dag!</h2>
      <span>Hoe zit je erbij? Vol goeie moed, of moet je nog even op gang komen?</span>
    </div>
    <div class="input-panel__body">
      <slot name="body" />
    </div>
    <div class="input-panel__footer">
      <slot name="footer" />
    </div>
  </section>
</template>

<script>
export default {
  //
}
</script>

<style lang="scss">
.input-panel {
  background: #fff;
  border-radius: rem(11px);
  float: right;
  min-width: rem(400px);

  &__header {
    padding: rem(40px) rem(30px) rem(30px);

    span {
      max-width: 360px;
      display: inline-block;
    }
  }

  &__footer {
    display: flex;
    padding: 0 30px 40px;
    justify-content: flex-end;
  }

  &__large {
    background-color: #00f;
    padding: rem(30px);
    color: #fff;
    border-radius: rem(5px);
    margin: 0 -20px;
  }
}
</style>
