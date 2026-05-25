<!-- This file defines the registration form component. -->
<!-- It should later connect to Supabase sign-up flow and profile creation logic. -->
<script setup lang="ts">
const name = ref('')
const email = ref('')
const password = ref('')
</script>

<template>
  <form class="surface-card auth-form">
    <h2>Register</h2>
    <BaseInput v-model="name" label="Display name" placeholder="Your name" />
    <BaseInput v-model="email" label="Email" placeholder="name@example.com" />
    <BaseInput v-model="password" label="Password" placeholder="Create password" />
    <BaseButton type="submit" label="Create account" />
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
