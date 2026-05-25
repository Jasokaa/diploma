<!-- This file redirects the old user-id route to the username-based profile route. -->
<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const route = useRoute()

const { getProfileById } = useProfile()
const profileId = String(route.params.id)
const { data } = await getProfileById(profileId)

if (data?.username) {
  await navigateTo(`/friends/${data.username}`)
} else {
  await navigateTo('/friends')
}
</script>
