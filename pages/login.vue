<!-- This page provides a basic login form and connects it to the authentication composable. -->
<script setup lang="ts">
definePageMeta({
  middleware: ['guest']
})

const route = useRoute()
const email = ref('')
const password = ref('')
const statusMessage = ref('')

const { signIn, getUser } = useAuth()
const { getProfileById } = useProfile()
const router = useRouter()

onMounted(() => {
  if (typeof route.query.email === 'string') {
    email.value = route.query.email
  }

  if (typeof route.query.message === 'string') {
    statusMessage.value = route.query.message
  }
})

const handleSubmit = async () => {
  statusMessage.value = ''

  const { error } = await signIn(email.value, password.value)

  if (error) {
    const errorMessage = error.message.toLowerCase()

    if (errorMessage.includes('email not confirmed')) {
      statusMessage.value = 'Please confirm your email before logging in.'
      return
    }

    if (errorMessage.includes('invalid login credentials')) {
      statusMessage.value = 'Incorrect email or password. Please check your details or reset your password.'
      return
    }

    statusMessage.value = error.message
    return
  }

  const user = await getUser()

  if (!user) {
    statusMessage.value = 'Login succeeded, but user data could not be loaded.'
    return
  }

  const { data: profile } = await getProfileById(user.id)

  if (!profile) {
    await router.push('/')
    return
  }

  await router.push('/')
}
</script>

<template>
  <section class="page-section auth-page">
    <div class="auth-page__layout">
      <div class="surface-card auth-page__intro">
        <span class="eyebrow">gifttt</span>
        <h1>Welcome back.</h1>
        <p>Log in to open your wishlists, keep gift plans together, and pick up where you left off.</p>
        <div class="auth-page__pills">
          <span class="auth-page__pill">Private sharing</span>
          <span class="auth-page__pill">Split gifts</span>
          <span class="auth-page__pill">Secret Santa</span>
        </div>
      </div>

      <form class="surface-card auth-page__form" @submit.prevent="handleSubmit">
        <div class="auth-page__heading">
          <h2>Log in</h2>
          <p>Use your email and password to continue to your space.</p>
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
            placeholder="Enter password"
          >
        </label>

        <button type="submit" class="button-primary auth-page__submit">
          Log in
        </button>

        <p v-if="statusMessage" class="auth-page__status">
          {{ statusMessage }}
        </p>

        <div class="auth-page__links">
          <NuxtLink to="/forgot-password" class="auth-page__link">
            Forgot password?
          </NuxtLink>
          <p>
            Don’t have an account?
            <NuxtLink to="/register" class="auth-page__link">
              Sign up
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
