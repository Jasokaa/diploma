<!-- This file defines the gift creation and editing form with photo, price, description, and priority. -->
<script setup lang="ts">
import type { GiftCurrency, GiftFormInput, GiftPriority } from '~/types/gift'

const titleMaxLength = 80
const descriptionMaxLength = 300
const currencyOptions: Array<{ value: GiftCurrency, label: string }> = [
  { value: 'UAH', label: 'Hryvnia (₴)' },
  { value: 'USD', label: 'Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' }
]

const props = withDefaults(defineProps<{
  initialValues?: Partial<GiftFormInput>
  submitLabel?: string
  errorMessage?: string
}>(), {
  initialValues: () => ({}),
  submitLabel: 'Save gift',
  errorMessage: ''
})

const emit = defineEmits<{
  save: [payload: GiftFormInput]
  cancel: []
}>()

const defaultValues: GiftFormInput = {
  title: '',
  description: '',
  imageUrl: '',
  price: null,
  currency: 'UAH',
  priority: 'medium'
}

const title = ref('')
const description = ref('')
const imageUrl = ref('')
const price = ref('')
const currency = ref<GiftCurrency>('UAH')
const priority = ref<GiftPriority>('medium')
const imageSourceLabel = ref<'upload' | 'link' | ''>('')
const localErrorMessage = ref('')

const remainingTitleCharacters = computed(() => {
  return titleMaxLength - title.value.length
})

const remainingDescriptionCharacters = computed(() => {
  return descriptionMaxLength - description.value.length
})

const imagePreview = computed(() => {
  return imageUrl.value.trim()
})

const applyInitialValues = () => {
  title.value = (props.initialValues.title || '').slice(0, titleMaxLength)
  description.value = (props.initialValues.description || '').slice(0, descriptionMaxLength)
  imageUrl.value = props.initialValues.imageUrl || ''
  price.value = props.initialValues.price != null ? String(props.initialValues.price) : ''
  currency.value = props.initialValues.currency || defaultValues.currency
  priority.value = props.initialValues.priority || defaultValues.priority
  imageSourceLabel.value = imageUrl.value ? 'link' : ''
}

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  const reader = new FileReader()

  reader.onload = () => {
    imageUrl.value = typeof reader.result === 'string' ? reader.result : ''
    imageSourceLabel.value = 'upload'
  }

  reader.readAsDataURL(file)
}

const handleImageUrlChange = () => {
  if (imageUrl.value.trim()) {
    imageSourceLabel.value = 'link'
  }
}

const clearImage = () => {
  imageUrl.value = ''
  imageSourceLabel.value = ''
}

const handleSubmit = () => {
  const normalizedTitle = String(title.value ?? '').trim()
  const normalizedDescription = String(description.value ?? '').trim()
  const normalizedImageUrl = String(imageUrl.value ?? '').trim()
  const normalizedPrice = typeof price.value === 'number'
    ? String(price.value)
    : String(price.value ?? '').trim()

  if (!normalizedTitle) {
    localErrorMessage.value = 'Gift name is required.'
    return
  }
  const parsedPrice = normalizedPrice ? Number(normalizedPrice) : null
  localErrorMessage.value = ''

  emit('save', {
    title: normalizedTitle,
    description: normalizedDescription || null,
    imageUrl: normalizedImageUrl || null,
    price: parsedPrice != null && !Number.isNaN(parsedPrice) ? parsedPrice : null,
    currency: currency.value || 'UAH',
    priority: priority.value
  })
}

watch(() => props.initialValues, applyInitialValues, { deep: true, immediate: true })
watch(() => title.value, () => {
  if (title.value.trim()) {
    localErrorMessage.value = ''
  }
})
</script>

<template>
  <form class="surface-card gift-form" novalidate @submit.prevent="handleSubmit">
    <h2>Gift details</h2>

    <label class="gift-form__field">
      <span>Gift name</span>
      <input
        v-model="title"
        type="text"
        required
        :maxlength="titleMaxLength"
        placeholder="Headphones, perfume, Lego set"
      >
    </label>

    <p class="gift-form__counter">
      {{ remainingTitleCharacters }} characters left
    </p>

    <label class="gift-form__field">
      <span>Description</span>
      <textarea
        v-model="description"
        rows="3"
        :maxlength="descriptionMaxLength"
        placeholder="Add details like size, color, brand, or why you want this gift"
      />
    </label>

    <p class="gift-form__counter">
      {{ remainingDescriptionCharacters }} characters left
    </p>

    <div class="gift-form__field">
      <span>Photo</span>

      <div v-if="imagePreview" class="gift-form__preview">
        <img :src="imagePreview" alt="Gift preview" class="gift-form__preview-image">
        <div class="gift-form__preview-meta">
          <p>
            Source:
            {{ imageSourceLabel === 'upload' ? 'uploaded file' : 'internet link' }}
          </p>
          <button type="button" class="gift-form__secondary-button" @click="clearImage">
            Remove image
          </button>
        </div>
      </div>

      <label class="gift-form__upload">
        <span>Upload from device</span>
        <input
          type="file"
          accept="image/*"
          @change="handleImageUpload"
        >
      </label>

      <label class="gift-form__field">
        <span>Image link from the internet</span>
        <input
          v-model="imageUrl"
          type="url"
          placeholder="https://example.com/gift-photo.jpg"
          @input="handleImageUrlChange"
        >
      </label>
    </div>

    <div class="gift-form__price-row">
      <label class="gift-form__field">
        <span>Price</span>
        <input
          v-model="price"
          type="number"
          min="0"
          step="0.01"
          placeholder="1500"
        >
      </label>

      <label class="gift-form__field">
        <span>Currency</span>
        <select
          v-model="currency"
        >
          <option
            v-for="option in currencyOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>

    <div class="gift-form__field">
      <span>Priority</span>
      <div class="gift-form__priority-options">
        <button
          type="button"
          class="gift-form__priority-button gift-form__priority-button--low"
          :class="{ 'gift-form__priority-button--active': priority === 'low' }"
          @click="priority = 'low'"
        >
          Low
        </button>
        <button
          type="button"
          class="gift-form__priority-button gift-form__priority-button--medium"
          :class="{ 'gift-form__priority-button--active': priority === 'medium' }"
          @click="priority = 'medium'"
        >
          Medium
        </button>
        <button
          type="button"
          class="gift-form__priority-button gift-form__priority-button--high"
          :class="{ 'gift-form__priority-button--active': priority === 'high' }"
          @click="priority = 'high'"
        >
          High
        </button>
      </div>
    </div>

    <div class="gift-form__actions">
      <button type="button" class="gift-form__submit" @click="handleSubmit">
        {{ submitLabel }}
      </button>
      <button type="button" class="gift-form__secondary-button" @click="$emit('cancel')">
        Cancel
      </button>
    </div>

    <p v-if="localErrorMessage || errorMessage" class="gift-form__error">
      {{ localErrorMessage || errorMessage }}
    </p>
  </form>
</template>

<style scoped>
.gift-form {
  display: grid;
  gap: 1rem;
}

.gift-form__field {
  display: grid;
  gap: 0.4rem;
}

.gift-form__field input,
.gift-form__field textarea {
  padding: 0.75rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: var(--surface);
}

.gift-form__counter {
  margin: -0.35rem 0 0;
  color: #64748b;
  font-size: 0.9rem;
  text-align: right;
}

.gift-form__preview {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}

.gift-form__preview-image {
  width: 100%;
  max-width: 220px;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 1rem;
  border: 1px solid var(--border);
}

.gift-form__preview-meta {
  display: grid;
  gap: 0.5rem;
}

.gift-form__upload {
  display: grid;
  gap: 0.4rem;
}

.gift-form__upload input {
  border: 1px solid var(--border);
  border-radius: 0.95rem;
  background: #fff;
  padding: 0.45rem;
  color: var(--text);
}

.gift-form__upload input::file-selector-button {
  margin-right: 0.8rem;
  border: 1px solid rgba(218, 39, 149, 0.22);
  border-radius: 999px;
  background: #dcff82;
  color: #1f1f1f;
  padding: 0.7rem 1rem;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.gift-form__price-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 120px;
  gap: 0.75rem;
}

.gift-form__priority-options {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.gift-form__priority-button {
  padding: 0.75rem 1rem;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
}

.gift-form__priority-button--low {
  background: #dcfce7;
  color: #166534;
}

.gift-form__priority-button--medium {
  background: #fef3c7;
  color: #92400e;
}

.gift-form__priority-button--high {
  background: #fee2e2;
  color: #991b1b;
}

.gift-form__priority-button--active {
  border-color: #0f172a;
  box-shadow: 0 0 0 2px rgb(15 23 42 / 12%);
}

.gift-form__actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.gift-form__submit,
.gift-form__secondary-button {
  padding: 0.85rem 1rem;
  border: none;
  border-radius: 0.85rem;
  cursor: pointer;
  font-weight: 600;
}

.gift-form__submit {
  background: #da2795;
  color: white;
  box-shadow: 0 10px 24px rgba(218, 39, 149, 0.18);
}

.gift-form__secondary-button {
  background: #eef2f7;
  color: #1f1f1f;
}

.gift-form__error {
  margin: 0;
  color: #b91c1c;
  font-weight: 600;
}

@media (max-width: 640px) {
  .gift-form__price-row {
    grid-template-columns: 1fr;
  }
}
</style>
