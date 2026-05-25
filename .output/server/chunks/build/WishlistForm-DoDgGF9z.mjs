import { defineComponent, ref, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderStyle } from 'vue/server-renderer';
import { d as detectWishlistScenario, w as wishlistScenarioOptions, c as customScenarioOption, a as getWishlistScenarioByKey, b as wishlistThemeOptions } from './wishlistScenarios-Bq5lbsHk.mjs';
import { _ as _export_sfc } from './server.mjs';

const titleMaxLength = 80;
const descriptionMaxLength = 300;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "WishlistForm",
  __ssrInlineRender: true,
  props: {
    initialValues: { default: () => ({}) },
    submitLabel: { default: "Save wishlist" },
    showCloseButton: { type: Boolean, default: false },
    closeLabel: { default: "Close" }
  },
  emits: ["submit", "close"],
  setup(__props, { emit: __emit }) {
    const emojiPickerOptions = [
      "🎁",
      "🎀",
      "✨",
      "🌟",
      "⭐",
      "💫",
      "🪄",
      "🛍️",
      "🛒",
      "🧾",
      "🎄",
      "🎅",
      "🤶",
      "🕯️",
      "❄️",
      "💝",
      "💌",
      "💐",
      "🎈",
      "🎉",
      "🎊",
      "🎫",
      "🎟️",
      "🏷️",
      "🔖",
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "🩷",
      "🩵",
      "🩶",
      "💔",
      "❤️‍🔥",
      "❤️‍🩹",
      "💕",
      "💞",
      "💓",
      "💗",
      "💖",
      "💘",
      "💟",
      "❣️",
      "💋",
      "😀",
      "😃",
      "😄",
      "😁",
      "😊",
      "🙂",
      "🙃",
      "😉",
      "😋",
      "😛",
      "😜",
      "🤪",
      "😝",
      "🥲",
      "😗",
      "😙",
      "😚",
      "😘",
      "🤗",
      "🫣",
      "🌸",
      "🌷",
      "🌹",
      "🌻",
      "🌼",
      "🌺",
      "🪷",
      "🥀",
      "🪻",
      "🌿",
      "🍀",
      "🌵",
      "🌱",
      "🍃",
      "🍂",
      "🍁",
      "🌾",
      "🪴",
      "🪸",
      "🐚",
      "🌙",
      "☀️",
      "🌈",
      "❄️",
      "🔥",
      "💧",
      "🌊",
      "☁️",
      "⚡",
      "🌪️",
      "🌍",
      "🌎",
      "🌏",
      "🪐",
      "🌋",
      "🏝️",
      "🏜️",
      "🏞️",
      "🌅",
      "🌄",
      "🌌",
      "🌠",
      "🐾",
      "🐱",
      "🐶",
      "🦊",
      "🐻",
      "🐰",
      "🐼",
      "🐨",
      "🐯",
      "🦁",
      "🦄",
      "🐸",
      "🐧",
      "🐥",
      "🦋",
      "🐝",
      "🐳",
      "🐬",
      "🐙",
      "🐢",
      "🦕",
      "🦖",
      "🐉",
      "🐿️",
      "🦔",
      "🦦",
      "🦭",
      "🦩",
      "🦚",
      "🦜",
      "🐞",
      "🦗",
      "🪲",
      "🐌",
      "🐛",
      "🦀",
      "🦞",
      "🦐",
      "🎂",
      "🍰",
      "🧁",
      "🍪",
      "🍫",
      "🍬",
      "🍭",
      "☕",
      "🍵",
      "🥂",
      "🍓",
      "🍒",
      "🍋",
      "🍊",
      "🍉",
      "🍇",
      "🥝",
      "🥭",
      "🍍",
      "🥥",
      "🥐",
      "🥯",
      "🥨",
      "🧇",
      "🥞",
      "🍕",
      "🍔",
      "🍟",
      "🌮",
      "🌯",
      "🍣",
      "🍱",
      "🍜",
      "🍝",
      "🍿",
      "🍩",
      "🍯",
      "🍦",
      "🍧",
      "🍨",
      "🥧",
      "🍮",
      "🍡",
      "🧋",
      "🧃",
      "📚",
      "📖",
      "✏️",
      "🖊️",
      "🖋️",
      "🖍️",
      "📝",
      "📓",
      "📔",
      "📒",
      "🎨",
      "🖌️",
      "📷",
      "📸",
      "🎧",
      "🎮",
      "🕹️",
      "💻",
      "⌨️",
      "🖱️",
      "📱",
      "⌚",
      "🎬",
      "🎤",
      "🎸",
      "🎹",
      "🥁",
      "🎻",
      "🎲",
      "🧩",
      "🧶",
      "🪡",
      "🧵",
      "🧺",
      "🕯️",
      "🪞",
      "🛋️",
      "🛏️",
      "🪑",
      "🧿",
      "🪩",
      "🫧",
      "🧊",
      "🔮",
      "🧲",
      "🧰",
      "🔑",
      "🗝️",
      "🔒",
      "🧷",
      "💅",
      "💄",
      "💍",
      "👗",
      "👠",
      "👜",
      "👒",
      "🧢",
      "👟",
      "🧦",
      "🧣",
      "🧤",
      "🕶️",
      "👓",
      "🪮",
      "🪥",
      "🧴",
      "🧼",
      "🏠",
      "🏡",
      "🏙️",
      "🌃",
      "🌉",
      "🏰",
      "🗽",
      "🗼",
      "⛩️",
      "🕌",
      "🧭",
      "🧳",
      "🚲",
      "🛴",
      "🛹",
      "🛼",
      "🛵",
      "🚗",
      "🚕",
      "🚆",
      "🚢",
      "✈️",
      "⚽",
      "🏀",
      "🏈",
      "⚾",
      "🎾",
      "🏐",
      "🏉",
      "🎱",
      "🏓",
      "🏸",
      "🥅",
      "🏒",
      "🏑",
      "🥍",
      "🏏",
      "🪃",
      "🥊",
      "🥋",
      "🛸",
      "🤖",
      "👾",
      "👽",
      "🧚‍♀️",
      "🧜‍♀️",
      "🧝‍♀️",
      "🧙‍♀️",
      "🧛‍♀️",
      "🧞‍♀️",
      "🎃",
      "👻",
      "🕷️",
      "🦇",
      "🧟‍♀️",
      "🪦",
      "⚰️",
      "🧙",
      "🧚",
      "🧜",
      "🪁",
      "🪀",
      "🧨"
    ];
    const props = __props;
    const defaultWishlistValues = {
      description: "",
      visibility: "friends_only",
      giftReservation: "enabled",
      hideReservedGiftsFromAuthor: true,
      splitGifts: "disabled",
      randomGiftSelection: "disabled",
      participantVisibility: "visible",
      wishlistCollaboration: "author_only",
      giftStatusVisibility: "partial",
      eventTimezone: "Europe/Kiev",
      secretAssignmentMode: "disabled",
      participantJoinMode: "approval_required",
      themeKey: "standard"
    };
    const emoji = ref("🎁");
    const title = ref("");
    const description = ref("");
    const visibility = ref(defaultWishlistValues.visibility);
    const giftReservation = ref(defaultWishlistValues.giftReservation);
    const hideReservedGiftsFromAuthor = ref(defaultWishlistValues.hideReservedGiftsFromAuthor);
    const splitGifts = ref(defaultWishlistValues.splitGifts);
    const randomGiftSelection = ref(defaultWishlistValues.randomGiftSelection);
    const participantVisibility = ref(defaultWishlistValues.participantVisibility);
    const wishlistCollaboration = ref(defaultWishlistValues.wishlistCollaboration);
    const giftStatusVisibility = ref(defaultWishlistValues.giftStatusVisibility);
    const eventDate = ref("");
    const eventTime = ref("");
    const eventTimezone = ref(defaultWishlistValues.eventTimezone);
    const secretAssignmentMode = ref(defaultWishlistValues.secretAssignmentMode);
    const participantJoinMode = ref(defaultWishlistValues.participantJoinMode);
    const themeKey = ref(defaultWishlistValues.themeKey);
    const isEmojiPickerOpen = ref(false);
    const selectedScenario = ref("personal");
    const isApplyingScenario = ref(false);
    const remainingTitleCharacters = computed(() => {
      return titleMaxLength - title.value.length;
    });
    const remainingDescriptionCharacters = computed(() => {
      return descriptionMaxLength - description.value.length;
    });
    const applyInitialValues = () => {
      const rawTitle = props.initialValues.title || "";
      const [possibleEmoji = "", ...restParts] = rawTitle.split(" ");
      const strippedTitle = rawTitle.trim();
      const matchedEmoji = emojiPickerOptions.includes(possibleEmoji) ? possibleEmoji : "";
      emoji.value = matchedEmoji || "🎁";
      title.value = (matchedEmoji ? restParts.join(" ") : strippedTitle).slice(0, titleMaxLength);
      description.value = (props.initialValues.description ?? defaultWishlistValues.description ?? "").slice(0, descriptionMaxLength);
      visibility.value = props.initialValues.visibility || defaultWishlistValues.visibility;
      giftReservation.value = props.initialValues.giftReservation || defaultWishlistValues.giftReservation;
      hideReservedGiftsFromAuthor.value = props.initialValues.hideReservedGiftsFromAuthor ?? defaultWishlistValues.hideReservedGiftsFromAuthor;
      splitGifts.value = props.initialValues.splitGifts || defaultWishlistValues.splitGifts;
      randomGiftSelection.value = props.initialValues.randomGiftSelection || defaultWishlistValues.randomGiftSelection;
      participantVisibility.value = props.initialValues.participantVisibility || defaultWishlistValues.participantVisibility;
      wishlistCollaboration.value = props.initialValues.wishlistCollaboration || defaultWishlistValues.wishlistCollaboration;
      giftStatusVisibility.value = props.initialValues.giftStatusVisibility || defaultWishlistValues.giftStatusVisibility;
      eventDate.value = props.initialValues.eventDate || "";
      eventTime.value = props.initialValues.eventTime || "";
      eventTimezone.value = props.initialValues.eventTimezone || defaultWishlistValues.eventTimezone;
      secretAssignmentMode.value = props.initialValues.secretAssignmentMode || defaultWishlistValues.secretAssignmentMode;
      participantJoinMode.value = props.initialValues.participantJoinMode || defaultWishlistValues.participantJoinMode;
      themeKey.value = props.initialValues.themeKey || defaultWishlistValues.themeKey;
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
      });
    };
    watch(() => props.initialValues, applyInitialValues, { deep: true, immediate: true });
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
          return;
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
        });
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "surface-card wishlist-form" }, _attrs))} data-v-be2826e2><div class="wishlist-form__section-heading" data-v-be2826e2><h2 data-v-be2826e2>Wishlist settings</h2><p data-v-be2826e2>Shape the mood, visibility, and gift flow before people join this celebration.</p></div><section class="wishlist-form__section" data-v-be2826e2><div class="wishlist-form__section-heading wishlist-form__section-heading--compact" data-v-be2826e2><h3 data-v-be2826e2>Basics</h3><p data-v-be2826e2>Set the visual identity and explain what this wishlist is for.</p></div><label class="wishlist-form__field" data-v-be2826e2><span data-v-be2826e2>Emoji cover</span><div class="wishlist-form__emoji-row" data-v-be2826e2><input${ssrRenderAttr("value", unref(emoji))} type="text" maxlength="8" placeholder="🎁" data-v-be2826e2><button type="button" class="wishlist-form__emoji-toggle" data-v-be2826e2> Choose emoji </button></div></label>`);
      if (unref(isEmojiPickerOpen)) {
        _push(`<div class="wishlist-form__emoji-picker" data-v-be2826e2><!--[-->`);
        ssrRenderList(emojiPickerOptions, (item) => {
          _push(`<button type="button" class="wishlist-form__emoji-option" data-v-be2826e2>${ssrInterpolate(item)}</button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<label class="wishlist-form__field" data-v-be2826e2><span data-v-be2826e2>Wishlist title</span><input${ssrRenderAttr("value", unref(title))} type="text"${ssrRenderAttr("maxlength", titleMaxLength)} placeholder="Birthday wishlist" data-v-be2826e2></label><p class="wishlist-form__counter" data-v-be2826e2>${ssrInterpolate(unref(remainingTitleCharacters))} characters left </p><label class="wishlist-form__field" data-v-be2826e2><span data-v-be2826e2>Description</span><textarea rows="3"${ssrRenderAttr("maxlength", descriptionMaxLength)} placeholder="Short note about this wishlist" data-v-be2826e2>${ssrInterpolate(unref(description))}</textarea></label><p class="wishlist-form__counter" data-v-be2826e2>${ssrInterpolate(unref(remainingDescriptionCharacters))} characters left </p></section><section class="wishlist-form__section" data-v-be2826e2><div class="wishlist-form__section-heading wishlist-form__section-heading--compact" data-v-be2826e2><h3 data-v-be2826e2>Scenario</h3><p data-v-be2826e2>Pick a structure that already matches the kind of event or gift planning you want.</p></div><div class="wishlist-form__field" data-v-be2826e2><span data-v-be2826e2>Scenario</span><div class="wishlist-form__scenario-grid" data-v-be2826e2><!--[-->`);
      ssrRenderList(unref(wishlistScenarioOptions), (scenario) => {
        _push(`<button type="button" class="${ssrRenderClass([{ "wishlist-form__scenario-option--selected": unref(selectedScenario) === scenario.key }, "wishlist-form__scenario-option"])}" data-v-be2826e2><div class="wishlist-form__scenario-topline" data-v-be2826e2><span class="wishlist-form__scenario-emoji" data-v-be2826e2><span class="wishlist-form__scenario-emoji-glyph" data-v-be2826e2>${ssrInterpolate(scenario.emoji)}</span></span><div class="wishlist-form__scenario-heading" data-v-be2826e2><small data-v-be2826e2>Ready-made scenario</small><strong data-v-be2826e2>${ssrInterpolate(scenario.label)}</strong></div></div><span data-v-be2826e2>${ssrInterpolate(scenario.description)}</span></button>`);
      });
      _push(`<!--]--><button type="button" class="${ssrRenderClass([{ "wishlist-form__scenario-option--selected": unref(selectedScenario) === "custom" }, "wishlist-form__scenario-option"])}" data-v-be2826e2><div class="wishlist-form__scenario-topline" data-v-be2826e2><span class="wishlist-form__scenario-emoji" data-v-be2826e2><span class="wishlist-form__scenario-emoji-glyph" data-v-be2826e2>${ssrInterpolate(unref(customScenarioOption).emoji)}</span></span><div class="wishlist-form__scenario-heading" data-v-be2826e2><small data-v-be2826e2>Build it yourself</small><strong data-v-be2826e2>${ssrInterpolate(unref(customScenarioOption).label)}</strong></div></div><span data-v-be2826e2>${ssrInterpolate(unref(customScenarioOption).description)}</span></button></div></div>`);
      if (unref(selectedScenario) === "secret_santa") {
        _push(`<div class="wishlist-form__scenario-note" data-v-be2826e2><strong data-v-be2826e2>Secret Santa is active.</strong><span data-v-be2826e2>This scenario prepares a holiday distribution and locks participant changes after the author generates it.</span></div>`);
      } else if (unref(selectedScenario) !== "custom") {
        _push(`<div class="wishlist-form__scenario-note wishlist-form__scenario-note--soft" data-v-be2826e2><strong data-v-be2826e2>${ssrInterpolate(unref(getWishlistScenarioByKey)(unref(selectedScenario))?.label)}</strong><span data-v-be2826e2>${ssrInterpolate(unref(getWishlistScenarioByKey)(unref(selectedScenario))?.description)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><section class="wishlist-form__section" data-v-be2826e2><div class="wishlist-form__section-heading wishlist-form__section-heading--compact" data-v-be2826e2><h3 data-v-be2826e2>Access and participation</h3><p data-v-be2826e2>Decide who can find the wishlist, join it, and collaborate on the gifts inside.</p></div><div class="wishlist-form__grid wishlist-form__grid--two" data-v-be2826e2><label class="wishlist-form__field" data-v-be2826e2><span data-v-be2826e2>Visibility</span><select data-v-be2826e2><option value="private" data-v-be2826e2${ssrIncludeBooleanAttr(Array.isArray(unref(visibility)) ? ssrLooseContain(unref(visibility), "private") : ssrLooseEqual(unref(visibility), "private")) ? " selected" : ""}>Private</option><option value="friends_only" data-v-be2826e2${ssrIncludeBooleanAttr(Array.isArray(unref(visibility)) ? ssrLooseContain(unref(visibility), "friends_only") : ssrLooseEqual(unref(visibility), "friends_only")) ? " selected" : ""}>Invited participants only</option><option value="public" data-v-be2826e2${ssrIncludeBooleanAttr(Array.isArray(unref(visibility)) ? ssrLooseContain(unref(visibility), "public") : ssrLooseEqual(unref(visibility), "public")) ? " selected" : ""}>Public</option></select></label><label class="wishlist-form__field" data-v-be2826e2><span data-v-be2826e2>Participant join mode</span><select data-v-be2826e2><option value="open" data-v-be2826e2${ssrIncludeBooleanAttr(Array.isArray(unref(participantJoinMode)) ? ssrLooseContain(unref(participantJoinMode), "open") : ssrLooseEqual(unref(participantJoinMode), "open")) ? " selected" : ""}>Open</option><option value="approval_required" data-v-be2826e2${ssrIncludeBooleanAttr(Array.isArray(unref(participantJoinMode)) ? ssrLooseContain(unref(participantJoinMode), "approval_required") : ssrLooseEqual(unref(participantJoinMode), "approval_required")) ? " selected" : ""}>Approval required</option><option value="invite_only" data-v-be2826e2${ssrIncludeBooleanAttr(Array.isArray(unref(participantJoinMode)) ? ssrLooseContain(unref(participantJoinMode), "invite_only") : ssrLooseEqual(unref(participantJoinMode), "invite_only")) ? " selected" : ""}>Invite only</option></select></label><label class="wishlist-form__field" data-v-be2826e2><span data-v-be2826e2>Participant visibility</span><select data-v-be2826e2><option value="visible" data-v-be2826e2${ssrIncludeBooleanAttr(Array.isArray(unref(participantVisibility)) ? ssrLooseContain(unref(participantVisibility), "visible") : ssrLooseEqual(unref(participantVisibility), "visible")) ? " selected" : ""}>Visible</option><option value="hidden" data-v-be2826e2${ssrIncludeBooleanAttr(Array.isArray(unref(participantVisibility)) ? ssrLooseContain(unref(participantVisibility), "hidden") : ssrLooseEqual(unref(participantVisibility), "hidden")) ? " selected" : ""}>Hidden</option></select></label><label class="wishlist-form__field" data-v-be2826e2><span data-v-be2826e2>Wishlist collaboration</span><select data-v-be2826e2><option value="author_only" data-v-be2826e2${ssrIncludeBooleanAttr(Array.isArray(unref(wishlistCollaboration)) ? ssrLooseContain(unref(wishlistCollaboration), "author_only") : ssrLooseEqual(unref(wishlistCollaboration), "author_only")) ? " selected" : ""}>Author only</option><option value="collaborative" data-v-be2826e2${ssrIncludeBooleanAttr(Array.isArray(unref(wishlistCollaboration)) ? ssrLooseContain(unref(wishlistCollaboration), "collaborative") : ssrLooseEqual(unref(wishlistCollaboration), "collaborative")) ? " selected" : ""}>Collaborative</option></select></label></div><p class="wishlist-form__hint" data-v-be2826e2> In the current version, this option gives access only to users you invite or approve for this wishlist. </p></section><section class="wishlist-form__section" data-v-be2826e2><div class="wishlist-form__section-heading wishlist-form__section-heading--compact" data-v-be2826e2><h3 data-v-be2826e2>Style and gifting rules</h3><p data-v-be2826e2>Choose the visual palette and set how reservations, split gifts, and statuses behave.</p></div><div class="wishlist-form__field" data-v-be2826e2><span data-v-be2826e2>Wishlist style</span><div class="wishlist-form__theme-grid" data-v-be2826e2><!--[-->`);
      ssrRenderList(unref(wishlistThemeOptions), (theme) => {
        _push(`<button type="button" class="${ssrRenderClass([{ "wishlist-form__theme-option--selected": unref(themeKey) === theme.key }, "wishlist-form__theme-option"])}" data-v-be2826e2><div class="wishlist-form__theme-preview" style="${ssrRenderStyle({
          "--wishlist-theme-primary": theme.primary,
          "--wishlist-theme-secondary": theme.secondary
        })}" data-v-be2826e2><div class="wishlist-form__theme-preview-header" data-v-be2826e2></div><div class="wishlist-form__theme-preview-line wishlist-form__theme-preview-line--wide" data-v-be2826e2></div><div class="wishlist-form__theme-preview-line" data-v-be2826e2></div></div><span data-v-be2826e2>${ssrInterpolate(theme.label)}</span></button>`);
      });
      _push(`<!--]--></div></div><div class="wishlist-form__grid wishlist-form__grid--two" data-v-be2826e2><label class="wishlist-form__field" data-v-be2826e2><span data-v-be2826e2>Gift reservation</span><select data-v-be2826e2><option value="enabled" data-v-be2826e2${ssrIncludeBooleanAttr(Array.isArray(unref(giftReservation)) ? ssrLooseContain(unref(giftReservation), "enabled") : ssrLooseEqual(unref(giftReservation), "enabled")) ? " selected" : ""}>Enabled</option><option value="disabled" data-v-be2826e2${ssrIncludeBooleanAttr(Array.isArray(unref(giftReservation)) ? ssrLooseContain(unref(giftReservation), "disabled") : ssrLooseEqual(unref(giftReservation), "disabled")) ? " selected" : ""}>Disabled</option></select></label><label class="wishlist-form__field" data-v-be2826e2><span data-v-be2826e2>Split gifts</span><select data-v-be2826e2><option value="enabled" data-v-be2826e2${ssrIncludeBooleanAttr(Array.isArray(unref(splitGifts)) ? ssrLooseContain(unref(splitGifts), "enabled") : ssrLooseEqual(unref(splitGifts), "enabled")) ? " selected" : ""}>Enabled</option><option value="disabled" data-v-be2826e2${ssrIncludeBooleanAttr(Array.isArray(unref(splitGifts)) ? ssrLooseContain(unref(splitGifts), "disabled") : ssrLooseEqual(unref(splitGifts), "disabled")) ? " selected" : ""}>Disabled</option></select></label><label class="wishlist-form__field" data-v-be2826e2><span data-v-be2826e2>Random gift selection</span><select data-v-be2826e2><option value="enabled" data-v-be2826e2${ssrIncludeBooleanAttr(Array.isArray(unref(randomGiftSelection)) ? ssrLooseContain(unref(randomGiftSelection), "enabled") : ssrLooseEqual(unref(randomGiftSelection), "enabled")) ? " selected" : ""}>Enabled</option><option value="disabled" data-v-be2826e2${ssrIncludeBooleanAttr(Array.isArray(unref(randomGiftSelection)) ? ssrLooseContain(unref(randomGiftSelection), "disabled") : ssrLooseEqual(unref(randomGiftSelection), "disabled")) ? " selected" : ""}>Disabled</option></select></label><label class="wishlist-form__field" data-v-be2826e2><span data-v-be2826e2>Gift status visibility</span><select data-v-be2826e2><option value="full" data-v-be2826e2${ssrIncludeBooleanAttr(Array.isArray(unref(giftStatusVisibility)) ? ssrLooseContain(unref(giftStatusVisibility), "full") : ssrLooseEqual(unref(giftStatusVisibility), "full")) ? " selected" : ""}>Full</option><option value="partial" data-v-be2826e2${ssrIncludeBooleanAttr(Array.isArray(unref(giftStatusVisibility)) ? ssrLooseContain(unref(giftStatusVisibility), "partial") : ssrLooseEqual(unref(giftStatusVisibility), "partial")) ? " selected" : ""}>Partial</option><option value="hidden" data-v-be2826e2${ssrIncludeBooleanAttr(Array.isArray(unref(giftStatusVisibility)) ? ssrLooseContain(unref(giftStatusVisibility), "hidden") : ssrLooseEqual(unref(giftStatusVisibility), "hidden")) ? " selected" : ""}>Hidden</option></select></label></div><label class="wishlist-form__checkbox" data-v-be2826e2><input${ssrIncludeBooleanAttr(Array.isArray(unref(hideReservedGiftsFromAuthor)) ? ssrLooseContain(unref(hideReservedGiftsFromAuthor), null) : unref(hideReservedGiftsFromAuthor)) ? " checked" : ""} type="checkbox" data-v-be2826e2><span data-v-be2826e2>Hide reserved gifts from author</span></label></section><section class="wishlist-form__section" data-v-be2826e2><div class="wishlist-form__section-heading wishlist-form__section-heading--compact" data-v-be2826e2><h3 data-v-be2826e2>Event details</h3><p data-v-be2826e2>Add the date and timing so guests know exactly what this wishlist is tied to.</p></div><div class="wishlist-form__grid wishlist-form__grid--three" data-v-be2826e2><label class="wishlist-form__field" data-v-be2826e2><span data-v-be2826e2>Event date</span><input${ssrRenderAttr("value", unref(eventDate))} type="date" data-v-be2826e2></label><label class="wishlist-form__field" data-v-be2826e2><span data-v-be2826e2>Event time</span><input${ssrRenderAttr("value", unref(eventTime))} type="time" data-v-be2826e2></label><label class="wishlist-form__field" data-v-be2826e2><span data-v-be2826e2>Timezone</span><input${ssrRenderAttr("value", unref(eventTimezone))} type="text" placeholder="Europe/Kiev" data-v-be2826e2></label></div>`);
      if (unref(selectedScenario) === "secret_santa") {
        _push(`<label class="wishlist-form__field" data-v-be2826e2><span data-v-be2826e2>Secret Santa distribution</span><select data-v-be2826e2><option value="random_assignment" data-v-be2826e2${ssrIncludeBooleanAttr(Array.isArray(unref(secretAssignmentMode)) ? ssrLooseContain(unref(secretAssignmentMode), "random_assignment") : ssrLooseEqual(unref(secretAssignmentMode), "random_assignment")) ? " selected" : ""}>Random assignment</option><option value="manual_assignment" data-v-be2826e2${ssrIncludeBooleanAttr(Array.isArray(unref(secretAssignmentMode)) ? ssrLooseContain(unref(secretAssignmentMode), "manual_assignment") : ssrLooseEqual(unref(secretAssignmentMode), "manual_assignment")) ? " selected" : ""}>Manual assignment</option></select></label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><div class="wishlist-form__actions" data-v-be2826e2>`);
      if (props.showCloseButton) {
        _push(`<button type="button" class="wishlist-form__close" data-v-be2826e2>${ssrInterpolate(props.closeLabel)}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit" class="wishlist-form__submit" data-v-be2826e2>${ssrInterpolate(__props.submitLabel)}</button></div></form>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/wishlist/WishlistForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-be2826e2"]]), { __name: "WishlistForm" });

export { __nuxt_component_2 as _ };
//# sourceMappingURL=WishlistForm-DoDgGF9z.mjs.map
