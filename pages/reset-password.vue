<!-- This page lets the user set a new password after opening the Supabase recovery link. -->
<script setup lang="ts">
const router = useRouter()
const newPassword = ref('')
const confirmPassword = ref('')
const statusMessage = ref('')

const { $supabase } = useNuxtApp()

const handleSubmit = async () => {
  statusMessage.value = ''

  if (newPassword.value.length < 6) {
    statusMessage.value = 'Password must be at least 6 characters'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    statusMessage.value = 'Passwords do not match'
    return
  }

  const { error } = await $supabase.auth.updateUser({
    password: newPassword.value
  })

  if (error) {
    statusMessage.value = error.message
    return
  }

  statusMessage.value = 'Password updated successfully.'
  await router.push('/login')
}
</script>

<template>
  <section class="page-section auth-page">
    <div class="auth-page__layout auth-page__layout--single">
      <div class="surface-card auth-page__form">
        <div class="auth-page__heading">
          <span class="eyebrow">gifttt</span>
          <h1>Create a new password</h1>
          <p>Choose a new password for your account and then return to log in.</p>
        </div>

        <form class="auth-page__inner-form" @submit.prevent="handleSubmit">
          <label class="auth-page__field" for="new-password">
            <span>New password</span>
            <input
              id="new-password"
              v-model="newPassword"
              type="password"
              placeholder="Enter new password"
            >
          </label>

          <label class="auth-page__field" for="confirm-password">
            <span>Confirm password</span>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm new password"
            >
          </label>

          <button type="submit" class="button-primary auth-page__submit">
            Update password
          </button>
        </form>

        <p v-if="statusMessage" class="auth-page__status">
          {{ statusMessage }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.auth-page__layout {
  width: min(100%, 62rem);
  margin: 0 auto;
}

.auth-page__layout--single {
  width: min(100%, 34rem);
}

.auth-page__form {
  display: grid;
  gap: 1rem;
  padding: 1.7rem;
  border-radius: 2rem;
}

.auth-page__heading,
.auth-page__inner-form {
  display: grid;
  gap: 0.8rem;
}

.auth-page__heading h1,
.auth-page__heading p,
.auth-page__status {
  margin: 0;
}

.auth-page__heading p {
  color: var(--muted);
}

.auth-page__field {
  display: grid;
  gap: 0.45rem;
}

.auth-page__submit {
  width: 100%;
}

.auth-page__status {
  color: var(--danger);
  font-size: 0.95rem;
}
</style>
