<!-- This file defines the default branded shell for the gifttt experience. -->
<template>
  <div class="default-layout">
    <AppHeader />
    <main class="default-layout__content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.default-layout__content {
  width: min(100%, 1320px);
  margin: 0 auto;
  padding: 1.6rem 1.4rem 2.2rem;
}

@media (max-width: 900px) {
  .default-layout__content {
    padding: 1rem 0.9rem 1.6rem;
  }
}
</style>
