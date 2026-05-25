<!-- This page lets the user request a password reset email for local development. -->
<script setup lang="ts">
definePageMeta({
  middleware: ['guest']
})

const email = ref('')
const statusMessage = ref('')
const resetRequestSent = ref(false)

const { $supabase } = useNuxtApp()

const handleSubmit = async () => {
  statusMessage.value = ''
  resetRequestSent.value = false

  const { error } = await $supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: 'http://localhost:3000/reset-password'
  })

  if (error) {
    statusMessage.value = error.message
    return
  }

  statusMessage.value = 'Check this email to reset your password. Please note: the email will be sent only if this address was registered before.'
  resetRequestSent.value = true
}
</script>

<template>
  <section class="page-section auth-page">
    <div class="auth-page__layout auth-page__layout--single">
      <div class="surface-card auth-page__form">
        <div class="auth-page__heading">
          <span class="eyebrow">gifttt</span>
          <h1>Reset your password</h1>
          <p>Enter your email and we will send you a link to set a new password.</p>
        </div>

        <form class="auth-page__inner-form" @submit.prevent="handleSubmit">
          <label class="auth-page__field" for="email">
            <span>Email</span>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="name@example.com"
            >
          </label>

          <button type="submit" class="button-primary auth-page__submit">
            Send reset email
          </button>
        </form>

        <p v-if="statusMessage" class="auth-page__status">
          {{ statusMessage }}
        </p>

        <p v-if="resetRequestSent" class="auth-page__helper">
          If you are not sure you registered before or you do not have access to this email, register a new account.
        </p>

        <NuxtLink to="/register" class="button-secondary auth-page__back">
          Return to registration
        </NuxtLink>
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
.auth-page__helper,
.auth-page__status {
  margin: 0;
}

.auth-page__heading p,
.auth-page__helper {
  color: var(--muted);
}

.auth-page__field {
  display: grid;
  gap: 0.45rem;
}

.auth-page__submit,
.auth-page__back {
  width: 100%;
}

.auth-page__status {
  color: var(--danger);
  font-size: 0.95rem;
}
</style>
