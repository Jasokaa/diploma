<!-- This page provides a basic registration form and connects it to the authentication composable. -->
<script setup lang="ts">
definePageMeta({
  middleware: ['guest']
})

const router = useRouter()
const email = ref('')
const password = ref('')
const statusMessage = ref('')

const { signUp, signIn } = useAuth()

const handleSubmit = async () => {
  statusMessage.value = ''

  if (!email.value.includes('@')) {
    statusMessage.value = 'Enter a valid email'
    return
  }

  if (password.value.length < 6) {
    statusMessage.value = 'Password must be at least 6 characters'
    return
  }

  const signInResponse = await signIn(email.value, password.value)

  if (!signInResponse.error) {
    await router.push('/profile')
    return
  }

  const { error } = await signUp(email.value, password.value)

  if (error) {
    if (error.message.toLowerCase().includes('already') || error.message.toLowerCase().includes('registered') || error.message.toLowerCase().includes('exists')) {
      await router.push({
        path: '/login',
        query: {
          email: email.value,
          message: 'This email is already registered. Please log in or reset your password.'
        }
      })
      return
    }

    statusMessage.value = 'Registration failed'
    return
  }

  statusMessage.value = 'If this is a new account, please check your email to confirm registration. If you already used this email before, please log in or reset your password.'
}
</script>

<template>
  <section class="page-section auth-page">
    <div class="auth-page__layout">
      <div class="surface-card auth-page__intro">
        <span class="eyebrow">gifttt</span>
        <h1>Create your space.</h1>
        <p>Set up your account to build wishlists, invite the right people, and keep gift planning calm and clear.</p>
        <div class="auth-page__pills">
          <span class="auth-page__pill">Personal wishlists</span>
          <span class="auth-page__pill">Group gifting</span>
          <span class="auth-page__pill">Holiday planning</span>
        </div>
      </div>

      <form class="surface-card auth-page__form" @submit.prevent="handleSubmit">
        <div class="auth-page__heading">
          <h2>Sign up</h2>
          <p>Use your email to start a new account in gifttt.</p>
        </div>

        <label class="auth-page__field" for="email">
          <span>Email</span>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="name@example.com"
          >
        </label>

        <label class="auth-page__field" for="password">
          <span>Password</span>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Create password"
          >
        </label>

        <button type="submit" class="button-primary auth-page__submit">
          Create account
        </button>

        <p v-if="statusMessage" class="auth-page__status">
          {{ statusMessage }}
        </p>

        <div class="auth-page__links">
          <p>
            Already have an account?
            <NuxtLink to="/login" class="auth-page__link">
              Go to login
            </NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.auth-page__layout {
  width: min(100%, 62rem);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 1rem;
  align-items: start;
}

.auth-page__intro,
.auth-page__form {
  display: grid;
  gap: 1rem;
  padding: 1.7rem;
  border-radius: 2rem;
}

.auth-page__intro {
  background:
    radial-gradient(circle at top right, rgba(220, 255, 130, 0.62), transparent 26%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 253, 247, 0.94));
}

.auth-page__intro h1,
.auth-page__heading h2 {
  margin: 0;
}

.auth-page__intro p,
.auth-page__heading p,
.auth-page__links p {
  margin: 0;
  color: var(--muted);
}

.auth-page__pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: 0.2rem;
}

.auth-page__pill {
  display: inline-flex;
  align-items: center;
  min-height: 2.15rem;
  padding: 0.68rem 0.92rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(218, 218, 218, 0.9);
  color: #43523e;
  font-size: 0.82rem;
  font-weight: 600;
}

.auth-page__form {
  gap: 1.1rem;
}

.auth-page__heading {
  display: grid;
  gap: 0.3rem;
}

.auth-page__field {
  display: grid;
  gap: 0.45rem;
}

.auth-page__submit {
  width: 100%;
}

.auth-page__status {
  margin: 0;
  color: var(--danger);
  font-size: 0.95rem;
}

.auth-page__links {
  display: grid;
  gap: 0.55rem;
}

.auth-page__link {
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
}

@media (max-width: 860px) {
  .auth-page__layout {
    grid-template-columns: 1fr;
  }
}
</style>
