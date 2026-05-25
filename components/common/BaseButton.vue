<!-- This file is the base button component for shared button styles. -->
<!-- It should later support variants, loading state, icons, and accessibility improvements. -->
<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    label: 'Button',
    type: 'button'
  }
)
</script>

<template>
  <button class="base-button" :type="type">
    <slot>{{ label }}</slot>
  </button>
</template>

<style scoped>
.base-button {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.75rem;
  background: var(--accent);
  color: white;
  cursor: pointer;
}
</style>
