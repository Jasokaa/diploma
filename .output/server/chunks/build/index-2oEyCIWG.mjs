import { _ as __nuxt_component_0 } from './nuxt-link-B1pdB3FY.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createTextVNode, unref, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { d as formatParticipantStatus, s as splitWishlistTitle, f as formatWishlistVisibility, a as formatParticipantJoinMode } from './helpers-BT2bhxkr.mjs';
import { f as formatWishlistScenario, d as detectWishlistScenario, g as getWishlistThemeStyle } from './wishlistScenarios-Bq5lbsHk.mjs';
import { _ as _export_sfc } from './server.mjs';
import { u as useAuth } from './useAuth-D55glZy3.mjs';
import { u as useWishlists } from './useWishlists-DPZKeTte.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import './state-DQnwRar-.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "WishlistCard",
  __ssrInlineRender: true,
  props: {
    wishlist: {},
    linkLabel: {},
    metaLabel: {}
  },
  setup(__props) {
    const props = __props;
    const titleParts = computed(() => splitWishlistTitle(props.wishlist.title));
    const scenarioLabel = computed(() => {
      return formatWishlistScenario(
        detectWishlistScenario({
          visibility: props.wishlist.visibility,
          giftReservation: props.wishlist.giftReservation,
          hideReservedGiftsFromAuthor: props.wishlist.hideReservedGiftsFromAuthor,
          splitGifts: props.wishlist.splitGifts,
          randomGiftSelection: props.wishlist.randomGiftSelection,
          participantVisibility: props.wishlist.participantVisibility,
          wishlistCollaboration: props.wishlist.wishlistCollaboration,
          giftStatusVisibility: props.wishlist.giftStatusVisibility,
          secretAssignmentMode: props.wishlist.secretAssignmentMode,
          participantJoinMode: props.wishlist.participantJoinMode
        })
      );
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<article${ssrRenderAttrs(mergeProps({
        class: "surface-card wishlist-card",
        style: unref(getWishlistThemeStyle)(props.wishlist.themeKey)
      }, _attrs))} data-v-f3920fdc><div class="wishlist-card__content" data-v-f3920fdc><span class="wishlist-card__scenario-chip" data-v-f3920fdc>Scenario · ${ssrInterpolate(unref(scenarioLabel))}</span><h3 class="wishlist-card__title" data-v-f3920fdc>`);
      if (unref(titleParts).cover) {
        _push(`<span class="wishlist-card__emoji" data-v-f3920fdc>${ssrInterpolate(unref(titleParts).cover)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span data-v-f3920fdc>${ssrInterpolate(unref(titleParts).text || props.wishlist.title)}</span></h3><p data-v-f3920fdc>${ssrInterpolate(props.wishlist.description || "No description yet.")}</p><div class="wishlist-card__meta" data-v-f3920fdc><span data-v-f3920fdc>Visibility: ${ssrInterpolate(unref(formatWishlistVisibility)(props.wishlist.visibility))}</span><span data-v-f3920fdc>Join mode: ${ssrInterpolate(unref(formatParticipantJoinMode)(props.wishlist.participantJoinMode))}</span>`);
      if (props.metaLabel) {
        _push(`<span data-v-f3920fdc>${ssrInterpolate(props.metaLabel)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="wishlist-card__actions" data-v-f3920fdc>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/wishlists/${props.wishlist.id}`,
        class: "wishlist-card__link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(props.linkLabel || "Open wishlist")}`);
          } else {
            return [
              createTextVNode(toDisplayString(props.linkLabel || "Open wishlist"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></article>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/wishlist/WishlistCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-f3920fdc"]]), { __name: "WishlistCard" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const statusMessage = ref("");
    const isLoading = ref(true);
    const collections = ref({
      own: [],
      joined: [],
      incomingInvitations: [],
      accessRequests: [],
      followingPublic: []
    });
    useAuth();
    ref("");
    useWishlists();
    const wishlistHighlights = computed(() => {
      return [
        {
          label: "Own lists",
          value: collections.value.own.length,
          note: "Wishlists you manage yourself"
        },
        {
          label: "Joined",
          value: collections.value.joined.length,
          note: "Wishlists you are already inside"
        },
        {
          label: "Invitations",
          value: collections.value.incomingInvitations.length,
          note: "Requests waiting for your answer"
        }
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_WishlistCard = __nuxt_component_1;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "page-section wishlist-page" }, _attrs))} data-v-2c96766a><div class="surface-card" data-v-2c96766a><h1 data-v-2c96766a>Wishlists</h1><p data-v-2c96766a>Keep your own lists close, answer invitations quickly, and browse the wishlists that matter to you.</p><div class="wishlist-page__hero-actions" data-v-2c96766a>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/wishlists/create",
        class: "button-primary wishlist-page__primary-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Create a new wishlist `);
          } else {
            return [
              createTextVNode(" Create a new wishlist ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/search",
        class: "button-secondary wishlist-page__secondary-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Find people and wishlists `);
          } else {
            return [
              createTextVNode(" Find people and wishlists ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(statusMessage)) {
        _push(`<p data-v-2c96766a>${ssrInterpolate(unref(statusMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="wishlist-page__highlights" data-v-2c96766a><!--[-->`);
      ssrRenderList(unref(wishlistHighlights), (item) => {
        _push(`<article class="wishlist-page__highlight-card" data-v-2c96766a><span class="wishlist-page__highlight-value" data-v-2c96766a>${ssrInterpolate(item.value)}</span><div class="wishlist-page__highlight-copy" data-v-2c96766a><strong data-v-2c96766a>${ssrInterpolate(item.label)}</strong><span data-v-2c96766a>${ssrInterpolate(item.note)}</span></div></article>`);
      });
      _push(`<!--]--></div></div><div class="surface-card" data-v-2c96766a><div class="wishlist-page__section-copy" data-v-2c96766a><h2 data-v-2c96766a>My wishlists</h2><p data-v-2c96766a>Your personal space for lists you own, style, and share.</p></div>`);
      if (unref(isLoading)) {
        _push(`<div class="wishlist-page__skeleton-list" data-v-2c96766a><!--[-->`);
        ssrRenderList(2, (item) => {
          _push(`<div class="wishlist-page__skeleton-card" data-v-2c96766a></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(collections).own.length) {
        _push(`<div class="wishlist-page__list" data-v-2c96766a><!--[-->`);
        ssrRenderList(unref(collections).own, (wishlist) => {
          _push(ssrRenderComponent(_component_WishlistCard, {
            key: wishlist.id,
            wishlist,
            "link-label": "Details"
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else if (!unref(isLoading)) {
        _push(`<p data-v-2c96766a> You have not created any wishlists yet. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="surface-card" data-v-2c96766a><div class="wishlist-page__section-copy" data-v-2c96766a><h2 data-v-2c96766a>Incoming invitations</h2><p data-v-2c96766a>Answer these first so the right lists move into your active planning space.</p></div>`);
      if (unref(isLoading)) {
        _push(`<div class="wishlist-page__skeleton-list" data-v-2c96766a><!--[-->`);
        ssrRenderList(1, (item) => {
          _push(`<div class="wishlist-page__skeleton-card" data-v-2c96766a></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(collections).incomingInvitations.length) {
        _push(`<div class="wishlist-page__list" data-v-2c96766a><!--[-->`);
        ssrRenderList(unref(collections).incomingInvitations, (record) => {
          _push(`<div class="wishlist-page__invitation-card" data-v-2c96766a>`);
          _push(ssrRenderComponent(_component_WishlistCard, {
            wishlist: record.wishlist,
            "link-label": "Details",
            "meta-label": `Status: ${unref(formatParticipantStatus)(record.participant.status)}`
          }, null, _parent));
          _push(`<div class="wishlist-page__invitation-actions" data-v-2c96766a><button type="button" class="button-primary wishlist-page__inline-button" data-v-2c96766a> Accept invitation </button><button type="button" class="button-secondary wishlist-page__inline-button" data-v-2c96766a> Reject invitation </button></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (!unref(isLoading)) {
        _push(`<p data-v-2c96766a> You have no incoming wishlist invitations right now. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="surface-card" data-v-2c96766a><div class="wishlist-page__section-copy" data-v-2c96766a><h2 data-v-2c96766a>Wishlists I joined</h2><p data-v-2c96766a>Lists where you can already browse gifts, coordinate, and jump back in quickly.</p></div>`);
      if (unref(isLoading)) {
        _push(`<div class="wishlist-page__skeleton-list" data-v-2c96766a><!--[-->`);
        ssrRenderList(1, (item) => {
          _push(`<div class="wishlist-page__skeleton-card" data-v-2c96766a></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(collections).joined.length) {
        _push(`<div class="wishlist-page__list" data-v-2c96766a><!--[-->`);
        ssrRenderList(unref(collections).joined, (wishlist) => {
          _push(ssrRenderComponent(_component_WishlistCard, {
            key: wishlist.id,
            wishlist,
            "link-label": "Details",
            "meta-label": "You are a participant"
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else if (!unref(isLoading)) {
        _push(`<p data-v-2c96766a> You have not joined any wishlists yet. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="surface-card" data-v-2c96766a><div class="wishlist-page__section-copy" data-v-2c96766a><h2 data-v-2c96766a>My access requests</h2><p data-v-2c96766a>These are still waiting on the author, so you can track them without guessing.</p></div>`);
      if (unref(isLoading)) {
        _push(`<div class="wishlist-page__skeleton-list" data-v-2c96766a><!--[-->`);
        ssrRenderList(1, (item) => {
          _push(`<div class="wishlist-page__skeleton-card" data-v-2c96766a></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(collections).accessRequests.length) {
        _push(`<div class="wishlist-page__list" data-v-2c96766a><!--[-->`);
        ssrRenderList(unref(collections).accessRequests, (record) => {
          _push(ssrRenderComponent(_component_WishlistCard, {
            key: record.participant.id,
            wishlist: record.wishlist,
            "link-label": "Details",
            "meta-label": `Status: ${unref(formatParticipantStatus)(record.participant.status)}`
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else if (!unref(isLoading)) {
        _push(`<p data-v-2c96766a> You do not have active access requests. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="surface-card" data-v-2c96766a><div class="wishlist-page__section-copy" data-v-2c96766a><h2 data-v-2c96766a>Public wishlists from followed users</h2><p data-v-2c96766a>Open lists shared by people you already follow and might want to browse next.</p></div>`);
      if (unref(isLoading)) {
        _push(`<div class="wishlist-page__skeleton-list" data-v-2c96766a><!--[-->`);
        ssrRenderList(1, (item) => {
          _push(`<div class="wishlist-page__skeleton-card" data-v-2c96766a></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(collections).followingPublic.length) {
        _push(`<div class="wishlist-page__list" data-v-2c96766a><!--[-->`);
        ssrRenderList(unref(collections).followingPublic, (wishlist) => {
          _push(ssrRenderComponent(_component_WishlistCard, {
            key: wishlist.id,
            wishlist,
            "link-label": "Details",
            "meta-label": "Public wishlist"
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else if (!unref(isLoading)) {
        _push(`<p data-v-2c96766a> No public wishlists from followed users are available yet. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/wishlists/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2c96766a"]]);

export { index as default };
//# sourceMappingURL=index-2oEyCIWG.mjs.map
