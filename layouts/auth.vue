<!-- This file defines the layout for login and registration pages. -->
<!-- It should later include better branding and auth-specific messaging. -->
<template>
  <div class="auth-layout">
    <div class="auth-layout__panel surface-card">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1.5rem;
}

.auth-layout__panel {
  width: min(100%, 420px);
}
</style>
