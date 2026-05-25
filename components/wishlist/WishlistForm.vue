<!-- This file defines the wishlist creation and editing form with user-configurable wishlist settings. -->
<script setup lang="ts">
import type { WishlistFormInput, WishlistScenarioKey } from '~/types/wishlist'
import { wishlistThemeOptions } from '~/utils/wishlistThemes'
import {
  customScenarioOption,
  detectWishlistScenario,
  getWishlistScenarioByKey,
  wishlistScenarioOptions
} from '~/utils/wishlistScenarios'

const titleMaxLength = 80
const descriptionMaxLength = 300
const emojiPickerOptions = [
  '🎁', '🎀', '✨', '🌟', '⭐', '💫', '🪄', '🛍️', '🛒', '🧾', '🎄', '🎅', '🤶', '🕯️', '❄️',
  '💝', '💌', '💐', '🎈', '🎉', '🎊', '🎫', '🎟️', '🏷️', '🔖',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '🩷',
  '🩵', '🩶', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖',
  '💘', '💟', '❣️', '💋',
  '😀', '😃', '😄', '😁', '😊', '🙂', '🙃', '😉', '😋', '😛',
  '😜', '🤪', '😝', '🥲', '😗', '😙', '😚', '😘', '🤗', '🫣',
  '🌸', '🌷', '🌹', '🌻', '🌼', '🌺', '🪷', '🥀', '🪻', '🌿',
  '🍀', '🌵', '🌱', '🍃', '🍂', '🍁', '🌾', '🪴', '🪸', '🐚',
  '🌙', '☀️', '🌈', '❄️', '🔥', '💧', '🌊', '☁️', '⚡', '🌪️',
  '🌍', '🌎', '🌏', '🪐', '🌋', '🏝️', '🏜️', '🏞️', '🌅', '🌄',
  '🌌', '🌠',
  '🐾', '🐱', '🐶', '🦊', '🐻', '🐰', '🐼', '🐨', '🐯', '🦁',
  '🦄', '🐸', '🐧', '🐥', '🦋', '🐝', '🐳', '🐬', '🐙', '🐢',
  '🦕', '🦖', '🐉', '🐿️', '🦔', '🦦', '🦭', '🦩', '🦚', '🦜',
  '🐞', '🦗', '🪲', '🐌', '🐛', '🦀', '🦞', '🦐',
  '🎂', '🍰', '🧁', '🍪', '🍫', '🍬', '🍭', '☕', '🍵', '🥂',
  '🍓', '🍒', '🍋', '🍊', '🍉', '🍇', '🥝', '🥭', '🍍', '🥥',
  '🥐', '🥯', '🥨', '🧇', '🥞', '🍕', '🍔', '🍟', '🌮', '🌯',
  '🍣', '🍱', '🍜', '🍝', '🍿', '🍩', '🍯', '🍦', '🍧', '🍨',
  '🥧', '🍮', '🍡', '🧋', '🧃',
  '📚', '📖', '✏️', '🖊️', '🖋️', '🖍️', '📝', '📓', '📔', '📒',
  '🎨', '🖌️', '📷', '📸', '🎧', '🎮', '🕹️', '💻', '⌨️', '🖱️',
  '📱', '⌚', '🎬', '🎤', '🎸', '🎹', '🥁', '🎻', '🎲', '🧩',
  '🧶', '🪡', '🧵', '🧺', '🕯️', '🪞', '🛋️', '🛏️', '🪑', '🧿',
  '🪩', '🫧', '🧊', '🔮', '🧲', '🧰', '🔑', '🗝️', '🔒', '🧷',
  '💅', '💄', '💍', '👗', '👠', '👜', '👒', '🧢', '👟', '🧦',
  '🧣', '🧤', '🕶️', '👓', '🪮', '🪥', '🧴', '🧼',
  '🏠', '🏡', '🏙️', '🌃', '🌉', '🏰', '🗽', '🗼', '⛩️', '🕌',
  '🧭', '🧳', '🚲', '🛴', '🛹', '🛼', '🛵', '🚗', '🚕', '🚆',
  '🚢', '✈️',
  '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸',
  '🥅', '🏒', '🏑', '🥍', '🏏', '🪃', '🥊', '🥋',
  '🛸', '🤖', '👾', '👽', '🧚‍♀️', '🧜‍♀️', '🧝‍♀️', '🧙‍♀️', '🧛‍♀️', '🧞‍♀️',
  '🎃', '👻', '🕷️', '🦇', '🧟‍♀️', '🪦', '⚰️', '🧙', '🧚', '🧜',
  '🪁', '🪀', '🧨'
]

const props = withDefaults(defineProps<{
  initialValues?: Partial<WishlistFormInput>
  submitLabel?: string
  showCloseButton?: boolean
  closeLabel?: string
}>(), {
  initialValues: () => ({}),
  submitLabel: 'Save wishlist',
  showCloseButton: false,
  closeLabel: 'Close'
})

const emit = defineEmits<{
  submit: [payload: WishlistFormInput]
  close: []
}>()

const defaultWishlistValues: WishlistFormInput = {
  title: '',
  description: '',
  visibility: 'friends_only',
  giftReservation: 'enabled',
  hideReservedGiftsFromAuthor: true,
  splitGifts: 'disabled',
  randomGiftSelection: 'disabled',
  participantVisibility: 'visible',
  wishlistCollaboration: 'author_only',
  giftStatusVisibility: 'partial',
  eventDate: null,
  eventTime: null,
  eventTimezone: 'Europe/Kiev',
  secretAssignmentMode: 'disabled',
  participantJoinMode: 'approval_required',
  themeKey: 'standard'
}

const emoji = ref('🎁')
const title = ref('')
const description = ref('')
const visibility = ref<WishlistFormInput['visibility']>(defaultWishlistValues.visibility)
const giftReservation = ref<WishlistFormInput['giftReservation']>(defaultWishlistValues.giftReservation)
const hideReservedGiftsFromAuthor = ref(defaultWishlistValues.hideReservedGiftsFromAuthor)
const splitGifts = ref<WishlistFormInput['splitGifts']>(defaultWishlistValues.splitGifts)
const randomGiftSelection = ref<WishlistFormInput['randomGiftSelection']>(defaultWishlistValues.randomGiftSelection)
const participantVisibility = ref<WishlistFormInput['participantVisibility']>(defaultWishlistValues.participantVisibility)
const wishlistCollaboration = ref<WishlistFormInput['wishlistCollaboration']>(defaultWishlistValues.wishlistCollaboration)
const giftStatusVisibility = ref<WishlistFormInput['giftStatusVisibility']>(defaultWishlistValues.giftStatusVisibility)
const eventDate = ref('')
const eventTime = ref('')
const eventTimezone = ref(defaultWishlistValues.eventTimezone || 'Europe/Kiev')
const secretAssignmentMode = ref<WishlistFormInput['secretAssignmentMode']>(defaultWishlistValues.secretAssignmentMode)
const participantJoinMode = ref<WishlistFormInput['participantJoinMode']>(defaultWishlistValues.participantJoinMode)
const themeKey = ref<WishlistFormInput['themeKey']>(defaultWishlistValues.themeKey)
const isEmojiPickerOpen = ref(false)
const selectedScenario = ref<WishlistScenarioKey>('personal')
const isApplyingScenario = ref(false)

const remainingTitleCharacters = computed(() => {
  return titleMaxLength - title.value.length
})

const remainingDescriptionCharacters = computed(() => {
  return descriptionMaxLength - description.value.length
})

const applyInitialValues = () => {
  const rawTitle = props.initialValues.title || ''
  const [possibleEmoji = '', ...restParts] = rawTitle.split(' ')
  const strippedTitle = rawTitle.trim()
  const matchedEmoji = emojiPickerOptions.includes(possibleEmoji) ? possibleEmoji : ''

  emoji.value = matchedEmoji || '🎁'
  title.value = (matchedEmoji ? restParts.join(' ') : strippedTitle).slice(0, titleMaxLength)
  description.value = (props.initialValues.description ?? defaultWishlistValues.description ?? '').slice(0, descriptionMaxLength)
  visibility.value = props.initialValues.visibility || defaultWishlistValues.visibility
  giftReservation.value = props.initialValues.giftReservation || defaultWishlistValues.giftReservation
  hideReservedGiftsFromAuthor.value = props.initialValues.hideReservedGiftsFromAuthor ?? defaultWishlistValues.hideReservedGiftsFromAuthor
  splitGifts.value = props.initialValues.splitGifts || defaultWishlistValues.splitGifts
  randomGiftSelection.value = props.initialValues.randomGiftSelection || defaultWishlistValues.randomGiftSelection
  participantVisibility.value = props.initialValues.participantVisibility || defaultWishlistValues.participantVisibility
  wishlistCollaboration.value = props.initialValues.wishlistCollaboration || defaultWishlistValues.wishlistCollaboration
  giftStatusVisibility.value = props.initialValues.giftStatusVisibility || defaultWishlistValues.giftStatusVisibility
  eventDate.value = props.initialValues.eventDate || ''
  eventTime.value = props.initialValues.eventTime || ''
  eventTimezone.value = props.initialValues.eventTimezone || defaultWishlistValues.eventTimezone || 'Europe/Kiev'
  secretAssignmentMode.value = props.initialValues.secretAssignmentMode || defaultWishlistValues.secretAssignmentMode
  participantJoinMode.value = props.initialValues.participantJoinMode || defaultWishlistValues.participantJoinMode
  themeKey.value = props.initialValues.themeKey || defaultWishlistValues.themeKey
  selectedScenario.value = detectWishlistScenario({
    visibility: visibility.value,
    giftReservation: giftReservation.value,
    hideReservedGiftsFromAuthor: hideReservedGiftsFromAuthor.value,
    splitGifts: splitGifts.value,
    randomGiftSelection: randomGiftSelection.value,
    participantVisibility: participantVisibility.value,
    wishlistCollaboration: wishlistCollaboration.value,
    giftStatusVisibility: giftStatusVisibility.value,
    secretAssignmentMode: secretAssignmentMode.value,
    participantJoinMode: participantJoinMode.value
  })
}

const applyScenario = (scenarioKey: WishlistScenarioKey) => {
  selectedScenario.value = scenarioKey

  if (scenarioKey === 'custom') {
    return
  }

  const scenario = getWishlistScenarioByKey(scenarioKey)

  if (!scenario) {
    return
  }

  isApplyingScenario.value = true
  visibility.value = scenario.settings.visibility
  giftReservation.value = scenario.settings.giftReservation
  hideReservedGiftsFromAuthor.value = scenario.settings.hideReservedGiftsFromAuthor
  splitGifts.value = scenario.settings.splitGifts
  randomGiftSelection.value = scenario.settings.randomGiftSelection
  participantVisibility.value = scenario.settings.participantVisibility
  wishlistCollaboration.value = scenario.settings.wishlistCollaboration
  giftStatusVisibility.value = scenario.settings.giftStatusVisibility
  secretAssignmentMode.value = scenario.settings.secretAssignmentMode
  participantJoinMode.value = scenario.settings.participantJoinMode
  queueMicrotask(() => {
    isApplyingScenario.value = false
  })
}

const handleSubmit = () => {
  const normalizedTitle = title.value.trim()
  const normalizedEmoji = emoji.value.trim() || '🎁'

  emit('submit', {
    title: normalizedTitle ? `${normalizedEmoji} ${normalizedTitle}` : '',
    description: description.value.trim() || null,
    visibility: visibility.value,
    giftReservation: giftReservation.value,
    hideReservedGiftsFromAuthor: hideReservedGiftsFromAuthor.value,
    splitGifts: splitGifts.value,
    randomGiftSelection: randomGiftSelection.value,
    participantVisibility: participantVisibility.value,
    wishlistCollaboration: wishlistCollaboration.value,
    giftStatusVisibility: giftStatusVisibility.value,
    eventDate: eventDate.value || null,
    eventTime: eventTime.value || null,
    eventTimezone: eventTimezone.value.trim() || null,
    secretAssignmentMode: secretAssignmentMode.value,
    participantJoinMode: participantJoinMode.value,
    themeKey: themeKey.value
  })
}

const chooseEmoji = (selectedEmoji: string) => {
  emoji.value = selectedEmoji
  isEmojiPickerOpen.value = false
}

watch(() => props.initialValues, applyInitialValues, { deep: true, immediate: true })
watch(
  [
    visibility,
    giftReservation,
    hideReservedGiftsFromAuthor,
    splitGifts,
    randomGiftSelection,
    participantVisibility,
    wishlistCollaboration,
    giftStatusVisibility,
    secretAssignmentMode,
    participantJoinMode
  ],
  () => {
    if (isApplyingScenario.value) {
      return
    }

    selectedScenario.value = detectWishlistScenario({
      visibility: visibility.value,
      giftReservation: giftReservation.value,
      hideReservedGiftsFromAuthor: hideReservedGiftsFromAuthor.value,
      splitGifts: splitGifts.value,
      randomGiftSelection: randomGiftSelection.value,
      participantVisibility: participantVisibility.value,
      wishlistCollaboration: wishlistCollaboration.value,
      giftStatusVisibility: giftStatusVisibility.value,
      secretAssignmentMode: secretAssignmentMode.value,
      participantJoinMode: participantJoinMode.value
    })
  }
)
</script>

<template>
  <form class="surface-card wishlist-form" @submit.prevent="handleSubmit">
    <div class="wishlist-form__section-heading">
      <h2>Wishlist settings</h2>
      <p>Shape the mood, visibility, and gift flow before people join this celebration.</p>
    </div>

    <section class="wishlist-form__section">
      <div class="wishlist-form__section-heading wishlist-form__section-heading--compact">
        <h3>Basics</h3>
        <p>Set the visual identity and explain what this wishlist is for.</p>
      </div>

      <label class="wishlist-form__field">
        <span>Emoji cover</span>
        <div class="wishlist-form__emoji-row">
          <input
            v-model="emoji"
            type="text"
            maxlength="8"
            placeholder="🎁"
          >
          <button
            type="button"
            class="wishlist-form__emoji-toggle"
            @click="isEmojiPickerOpen = !isEmojiPickerOpen"
          >
            Choose emoji
          </button>
        </div>
      </label>

      <div v-if="isEmojiPickerOpen" class="wishlist-form__emoji-picker">
        <button
          v-for="item in emojiPickerOptions"
          :key="item"
          type="button"
          class="wishlist-form__emoji-option"
          @click="chooseEmoji(item)"
        >
          {{ item }}
        </button>
      </div>

      <label class="wishlist-form__field">
        <span>Wishlist title</span>
        <input
          v-model="title"
          type="text"
          :maxlength="titleMaxLength"
          placeholder="Birthday wishlist"
        >
      </label>

      <p class="wishlist-form__counter">
        {{ remainingTitleCharacters }} characters left
      </p>

      <label class="wishlist-form__field">
        <span>Description</span>
        <textarea
          v-model="description"
          rows="3"
          :maxlength="descriptionMaxLength"
          placeholder="Short note about this wishlist"
        />
      </label>

      <p class="wishlist-form__counter">
        {{ remainingDescriptionCharacters }} characters left
      </p>
    </section>

    <section class="wishlist-form__section">
      <div class="wishlist-form__section-heading wishlist-form__section-heading--compact">
        <h3>Scenario</h3>
        <p>Pick a structure that already matches the kind of event or gift planning you want.</p>
      </div>

      <div class="wishlist-form__field">
        <span>Scenario</span>
        <div class="wishlist-form__scenario-grid">
          <button
            v-for="scenario in wishlistScenarioOptions"
            :key="scenario.key"
            type="button"
            class="wishlist-form__scenario-option"
            :class="{ 'wishlist-form__scenario-option--selected': selectedScenario === scenario.key }"
            @click="applyScenario(scenario.key)"
          >
            <div class="wishlist-form__scenario-topline">
              <span class="wishlist-form__scenario-emoji">
                <span class="wishlist-form__scenario-emoji-glyph">
                  {{ scenario.emoji }}
                </span>
              </span>
              <div class="wishlist-form__scenario-heading">
                <small>Ready-made scenario</small>
                <strong>{{ scenario.label }}</strong>
              </div>
            </div>
            <span>{{ scenario.description }}</span>
          </button>

          <button
            type="button"
            class="wishlist-form__scenario-option"
            :class="{ 'wishlist-form__scenario-option--selected': selectedScenario === 'custom' }"
            @click="applyScenario('custom')"
          >
            <div class="wishlist-form__scenario-topline">
              <span class="wishlist-form__scenario-emoji">
                <span class="wishlist-form__scenario-emoji-glyph">
                  {{ customScenarioOption.emoji }}
                </span>
              </span>
              <div class="wishlist-form__scenario-heading">
                <small>Build it yourself</small>
                <strong>{{ customScenarioOption.label }}</strong>
              </div>
            </div>
            <span>{{ customScenarioOption.description }}</span>
          </button>
        </div>
      </div>

      <div v-if="selectedScenario === 'secret_santa'" class="wishlist-form__scenario-note">
        <strong>Secret Santa is active.</strong>
        <span>This scenario prepares a holiday distribution and locks participant changes after the author generates it.</span>
      </div>
      <div v-else-if="selectedScenario !== 'custom'" class="wishlist-form__scenario-note wishlist-form__scenario-note--soft">
        <strong>{{ getWishlistScenarioByKey(selectedScenario)?.label }}</strong>
        <span>{{ getWishlistScenarioByKey(selectedScenario)?.description }}</span>
      </div>
    </section>

    <section class="wishlist-form__section">
      <div class="wishlist-form__section-heading wishlist-form__section-heading--compact">
        <h3>Access and participation</h3>
        <p>Decide who can find the wishlist, join it, and collaborate on the gifts inside.</p>
      </div>

      <div class="wishlist-form__grid wishlist-form__grid--two">
        <label class="wishlist-form__field">
          <span>Visibility</span>
          <select v-model="visibility">
            <option value="private">Private</option>
            <option value="friends_only">Invited participants only</option>
            <option value="public">Public</option>
          </select>
        </label>

        <label class="wishlist-form__field">
          <span>Participant join mode</span>
          <select v-model="participantJoinMode">
            <option value="open">Open</option>
            <option value="approval_required">Approval required</option>
            <option value="invite_only">Invite only</option>
          </select>
        </label>

        <label class="wishlist-form__field">
          <span>Participant visibility</span>
          <select v-model="participantVisibility">
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
          </select>
        </label>

        <label class="wishlist-form__field">
          <span>Wishlist collaboration</span>
          <select v-model="wishlistCollaboration">
            <option value="author_only">Author only</option>
            <option value="collaborative">Collaborative</option>
          </select>
        </label>
      </div>

      <p class="wishlist-form__hint">
        In the current version, this option gives access only to users you invite or approve for this wishlist.
      </p>
    </section>

    <section class="wishlist-form__section">
      <div class="wishlist-form__section-heading wishlist-form__section-heading--compact">
        <h3>Style and gifting rules</h3>
        <p>Choose the visual palette and set how reservations, split gifts, and statuses behave.</p>
      </div>

      <div class="wishlist-form__field">
        <span>Wishlist style</span>
        <div class="wishlist-form__theme-grid">
          <button
            v-for="theme in wishlistThemeOptions"
            :key="theme.key"
            type="button"
            class="wishlist-form__theme-option"
            :class="{ 'wishlist-form__theme-option--selected': themeKey === theme.key }"
            @click="themeKey = theme.key"
          >
            <div
              class="wishlist-form__theme-preview"
              :style="{
                '--wishlist-theme-primary': theme.primary,
                '--wishlist-theme-secondary': theme.secondary
              }"
            >
              <div class="wishlist-form__theme-preview-header" />
              <div class="wishlist-form__theme-preview-line wishlist-form__theme-preview-line--wide" />
              <div class="wishlist-form__theme-preview-line" />
            </div>
            <span>{{ theme.label }}</span>
          </button>
        </div>
      </div>

      <div class="wishlist-form__grid wishlist-form__grid--two">
        <label class="wishlist-form__field">
          <span>Gift reservation</span>
          <select v-model="giftReservation">
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </label>

        <label class="wishlist-form__field">
          <span>Split gifts</span>
          <select v-model="splitGifts">
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </label>

        <label class="wishlist-form__field">
          <span>Random gift selection</span>
          <select v-model="randomGiftSelection">
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </label>

        <label class="wishlist-form__field">
          <span>Gift status visibility</span>
          <select v-model="giftStatusVisibility">
            <option value="full">Full</option>
            <option value="partial">Partial</option>
            <option value="hidden">Hidden</option>
          </select>
        </label>
      </div>

      <label class="wishlist-form__checkbox">
        <input v-model="hideReservedGiftsFromAuthor" type="checkbox">
        <span>Hide reserved gifts from author</span>
      </label>
    </section>

    <section class="wishlist-form__section">
      <div class="wishlist-form__section-heading wishlist-form__section-heading--compact">
        <h3>Event details</h3>
        <p>Add the date and timing so guests know exactly what this wishlist is tied to.</p>
      </div>

      <div class="wishlist-form__grid wishlist-form__grid--three">
        <label class="wishlist-form__field">
          <span>Event date</span>
          <input v-model="eventDate" type="date">
        </label>

        <label class="wishlist-form__field">
          <span>Event time</span>
          <input v-model="eventTime" type="time">
        </label>

        <label class="wishlist-form__field">
          <span>Timezone</span>
          <input v-model="eventTimezone" type="text" placeholder="Europe/Kiev">
        </label>
      </div>

      <label v-if="selectedScenario === 'secret_santa'" class="wishlist-form__field">
        <span>Secret Santa distribution</span>
        <select v-model="secretAssignmentMode">
          <option value="random_assignment">Random assignment</option>
          <option value="manual_assignment">Manual assignment</option>
        </select>
      </label>
    </section>

    <div class="wishlist-form__actions">
      <button
        v-if="props.showCloseButton"
        type="button"
        class="wishlist-form__close"
        @click="emit('close')"
      >
        {{ props.closeLabel }}
      </button>
      <button type="submit" class="wishlist-form__submit">
        {{ submitLabel }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.wishlist-form {
  display: grid;
  gap: 1.25rem;
  padding: 1.7rem;
  border-radius: 2rem;
}

.wishlist-form__section {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid rgba(218, 218, 218, 0.82);
  border-radius: 1.5rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(249, 249, 249, 0.92));
}

.wishlist-form__section-heading {
  display: grid;
  gap: 0.35rem;
}

.wishlist-form__section-heading h2,
.wishlist-form__section-heading h3 {
  margin: 0;
}

.wishlist-form__section-heading h3 {
  font-size: 1.12rem;
}

.wishlist-form__section-heading p {
  margin: 0;
  max-width: 42rem;
  color: var(--muted);
  font-size: 0.96rem;
}

.wishlist-form__section-heading--compact {
  gap: 0.22rem;
}

.wishlist-form__grid {
  display: grid;
  gap: 0.9rem;
}

.wishlist-form__grid--two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.wishlist-form__grid--three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.wishlist-form__field {
  display: grid;
  gap: 0.45rem;
}

.wishlist-form__field input,
.wishlist-form__field textarea,
.wishlist-form__field select {
  padding: 0.85rem 1rem;
  border: 1px solid var(--border);
  border-radius: 0.95rem;
  background: rgba(255, 255, 255, 0.96);
}

.wishlist-form__checkbox {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  grid-column: 1 / -1;
  justify-self: start;
  gap: 0.65rem;
  width: fit-content;
  max-width: none;
  padding: 0.25rem 0 0;
  text-align: left;
}

.wishlist-form__checkbox input {
  margin: 0;
  flex-shrink: 0;
}

.wishlist-form__checkbox span {
  display: inline-block;
  max-width: none;
  line-height: 1.25;
  white-space: nowrap;
}

.wishlist-form__scenario-note {
  display: grid;
  gap: 0.22rem;
  padding: 0.95rem 1rem;
  border-radius: 1.1rem;
  background: rgba(220, 255, 130, 0.35);
  border: 1px solid rgba(144, 175, 65, 0.22);
}

.wishlist-form__scenario-note--soft {
  background: rgba(255, 255, 255, 0.72);
  border-color: rgba(218, 218, 218, 0.88);
}

.wishlist-form__scenario-note strong,
.wishlist-form__scenario-note span {
  margin: 0;
}

.wishlist-form__hint {
  margin: -0.35rem 0 0;
  color: var(--muted);
  font-size: 0.93rem;
}

.wishlist-form__counter {
  margin: -0.35rem 0 0;
  color: var(--muted);
  font-size: 0.88rem;
  text-align: right;
}

.wishlist-form__emoji-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.wishlist-form__emoji-row input {
  width: 5rem;
  text-align: center;
  font-size: 1.4rem;
}

.wishlist-form__emoji-toggle {
  padding: 0.82rem 1rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: #fff;
  cursor: pointer;
  color: #4d5d49;
  font-weight: 600;
}

.wishlist-form__emoji-picker {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(3rem, 1fr));
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 1rem;
  max-height: 18rem;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.98);
}

.wishlist-form__emoji-option {
  min-height: 3rem;
  border: 1px solid var(--border);
  border-radius: 0.95rem;
  background: white;
  font-size: 1.35rem;
  cursor: pointer;
}

.wishlist-form__actions {
  position: sticky;
  bottom: 0;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.8rem;
  padding-top: 0.65rem;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.98) 68%, rgb(255 255 255 / 0%));
}

.wishlist-form__close {
  min-height: 3.45rem;
  padding-inline: 1.2rem;
  border: 1px solid rgba(218, 218, 218, 0.95);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  color: #43523e;
  font-weight: 600;
}

.wishlist-form__submit {
  width: 100%;
  min-height: 3.45rem;
}

.wishlist-form__theme-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  gap: 0.75rem;
  align-items: stretch;
}

.wishlist-form__scenario-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 0.75rem;
}

.wishlist-form__scenario-option {
  display: grid;
  gap: 0.7rem;
  align-content: start;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 1.2rem;
  background: rgba(255, 255, 255, 0.96);
  cursor: pointer;
  text-align: left;
  transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}

.wishlist-form__scenario-option strong {
  font-size: 1rem;
  color: var(--text);
}

.wishlist-form__scenario-option span {
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.45;
}

.wishlist-form__scenario-option:hover {
  transform: translateY(-1px);
  border-color: rgba(218, 39, 149, 0.24);
}

.wishlist-form__scenario-option--selected {
  border-color: rgba(218, 39, 149, 0.36);
  box-shadow: 0 0 0 3px rgba(218, 39, 149, 0.12);
}

.wishlist-form__scenario-topline {
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
}

.wishlist-form__scenario-heading {
  display: grid;
  gap: 0.18rem;
}

.wishlist-form__scenario-heading small {
  color: #8d9b87;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.wishlist-form__scenario-emoji {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: #fffef8;
  border: 1px solid rgba(218, 218, 218, 0.9);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 70%);
  flex-shrink: 0;
  overflow: hidden;
}

.wishlist-form__scenario-emoji-glyph {
  display: inline-block;
  font-size: 3.2rem;
  line-height: 1;
  transform: scale(1.26);
  transform-origin: center;
}

.wishlist-form__scenario-note {
  display: grid;
  gap: 0.3rem;
  padding: 0.9rem 1rem;
  border: 1px solid rgba(218, 39, 149, 0.18);
  border-radius: 1rem;
  background: rgba(218, 39, 149, 0.06);
}

.wishlist-form__scenario-note strong {
  color: var(--accent);
}

.wishlist-form__scenario-note span {
  color: #8d3a70;
  font-size: 0.94rem;
}

.wishlist-form__theme-option {
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 0.5rem;
  justify-items: stretch;
  align-content: start;
  width: 100%;
  min-width: 0;
  height: 100%;
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.96);
  cursor: pointer;
  text-align: left;
  transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}

.wishlist-form__theme-option:hover {
  transform: translateY(-1px);
}

.wishlist-form__theme-option--selected {
  border-color: rgba(218, 39, 149, 0.36);
  box-shadow: inset 0 0 0 3px rgba(218, 39, 149, 0.12);
}

.wishlist-form__theme-option span {
  display: block;
  min-height: 2.4rem;
  align-self: end;
  text-align: center;
}

.wishlist-form__theme-preview {
  width: 8.4rem;
  justify-self: center;
  min-height: 82px;
  border-radius: 0.8rem;
  border: 1px solid var(--wishlist-theme-secondary);
  background: linear-gradient(180deg, var(--wishlist-theme-primary), #fff);
  padding: 0.65rem;
  display: grid;
  gap: 0.45rem;
  box-sizing: border-box;
}

.wishlist-form__theme-preview-header {
  width: 52%;
  height: 12px;
  border-radius: 999px;
  background: var(--wishlist-theme-secondary);
}

.wishlist-form__theme-preview-line {
  width: 68%;
  height: 9px;
  border-radius: 999px;
  background: rgb(255 255 255 / 92%);
}

.wishlist-form__theme-preview-line--wide {
  width: 88%;
}

@media (max-width: 860px) {
  .wishlist-form__grid--two,
  .wishlist-form__grid--three {
    grid-template-columns: 1fr;
  }

  .wishlist-form__theme-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .wishlist-form__actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .wishlist-form__checkbox span {
    white-space: normal;
  }
}

@media (max-width: 560px) {
  .wishlist-form__theme-grid {
    grid-template-columns: 1fr;
  }
}
</style>
