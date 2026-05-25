<!-- This file is a shared empty-state component for simple placeholder content. -->
<!-- It should later support icons, actions, and context-specific messages. -->
<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: 'Nothing here yet',
    description: 'This section will be implemented later.'
  }
)
</script>

<template>
  <div class="surface-card empty-state">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </div>
</template>

<style scoped>
.empty-state {
  text-align: center;
}

h3 {
  margin-top: 0;
}

p {
  margin-bottom: 0;
  color: var(--muted);
}
</style>
