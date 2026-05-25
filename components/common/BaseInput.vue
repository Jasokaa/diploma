<!-- This file is the base input component for shared form inputs. -->
<!-- It should later support validation states, labels, and helper messages. -->
<script setup lang="ts">
defineProps<{
  label: string
  modelValue?: string
  placeholder?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <label class="base-input">
    <span class="base-input__label">{{ label }}</span>
    <input
      class="base-input__field"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
  </label>
</template>

<style scoped>
.base-input {
  display: grid;
  gap: 0.4rem;
}

.base-input__label {
  color: var(--muted);
  font-size: 0.95rem;
}

.base-input__field {
  padding: 0.75rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: var(--surface);
}
</style>
