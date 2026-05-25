<!-- This file defines the login form component. -->
<!-- It should later connect to Supabase auth and validation logic. -->
<script setup lang="ts">
const email = ref('')
const password = ref('')
</script>

<template>
  <form class="surface-card auth-form">
    <h2>Login</h2>
    <BaseInput v-model="email" label="Email" placeholder="name@example.com" />
    <BaseInput v-model="password" label="Password" placeholder="Enter password" />
    <BaseButton type="submit" label="Sign in" />
  </form>
</template>

<style scoped>
.auth-form {
  display: grid;
  gap: 1rem;
}

h2 {
  margin: 0;
}
</style>
