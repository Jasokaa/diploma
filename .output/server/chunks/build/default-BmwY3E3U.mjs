import { _ as __nuxt_component_0$1 } from './nuxt-link-B1pdB3FY.mjs';
import { mergeProps, defineComponent, ref, computed, watch, withCtx, createVNode, unref, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { _ as _export_sfc, b as useRoute, a as useRouter } from './server.mjs';
import { u as useAuth } from './useAuth-D55glZy3.mjs';
import { u as useProfile } from './useProfile-DiW2onUU.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import './state-DQnwRar-.mjs';

const _imports_0 = publicAssetsURL("/images/design/logo.svg");
const defaultGuestAvatar = "/images/avatars/avatar-new.png";
const defaultProfileAvatar = "/images/avatars/avatar-standart.png";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AppHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const authUser = ref(null);
    const searchTerm = ref("");
    useAuth();
    const { profile } = useProfile();
    computed(() => route.path === "/search");
    const avatarSrc = computed(() => {
      if (!authUser.value) {
        return defaultGuestAvatar;
      }
      if (!profile.value?.avatar_url) {
        return defaultProfileAvatar;
      }
      return profile.value.avatar_url;
    });
    const displayName = computed(() => {
      return profile.value?.full_name || profile.value?.username || "Profile";
    });
    const loadHeaderData = async () => {
      {
        return;
      }
    };
    watch(() => route.fullPath, loadHeaderData, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "app-header" }, _attrs))} data-v-d23b2f28><div class="app-header__shell" data-v-d23b2f28><div class="app-header__left" data-v-d23b2f28>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "app-header__brand",
        "aria-label": "Go to gifttt home"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="gifttt logo" class="app-header__logo" data-v-d23b2f28${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                src: _imports_0,
                alt: "gifttt logo",
                class: "app-header__logo"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<form class="app-header__search" data-v-d23b2f28><input${ssrRenderAttr("value", unref(searchTerm))} type="text" placeholder="Search by username or full name" data-v-d23b2f28><button type="submit" class="button-ghost app-header__search-button" data-v-d23b2f28> Search </button></form></div><nav class="app-header__nav" data-v-d23b2f28>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/friends",
        class: "app-header__nav-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Friends`);
          } else {
            return [
              createTextVNode("Friends")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/wishlists",
        class: "app-header__nav-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Wishlists`);
          } else {
            return [
              createTextVNode("Wishlists")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/wishlists/create",
        class: "button-primary app-header__create-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Create wishlist `);
          } else {
            return [
              createTextVNode(" Create wishlist ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/profile",
        class: "app-header__profile",
        "aria-label": "Open profile page"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="app-header__profile-copy" data-v-d23b2f28${_scopeId}><span class="app-header__profile-label" data-v-d23b2f28${_scopeId}>My space</span><strong class="app-header__profile-name" data-v-d23b2f28${_scopeId}>${ssrInterpolate(unref(displayName))}</strong></div><img${ssrRenderAttr("src", unref(avatarSrc))} alt="Profile avatar" class="app-header__avatar" data-v-d23b2f28${_scopeId}>`);
          } else {
            return [
              createVNode("div", { class: "app-header__profile-copy" }, [
                createVNode("span", { class: "app-header__profile-label" }, "My space"),
                createVNode("strong", { class: "app-header__profile-name" }, toDisplayString(unref(displayName)), 1)
              ]),
              createVNode("img", {
                src: unref(avatarSrc),
                alt: "Profile avatar",
                class: "app-header__avatar"
              }, null, 8, ["src"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav></div></header>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/AppHeader.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-d23b2f28"]]), { __name: "AppHeader" });
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_AppHeader = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "default-layout" }, _attrs))} data-v-31390b8a>`);
  _push(ssrRenderComponent(_component_AppHeader, null, null, _parent));
  _push(`<main class="default-layout__content" data-v-31390b8a>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</main></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-31390b8a"]]);

export { _default as default };
//# sourceMappingURL=default-BmwY3E3U.mjs.map
