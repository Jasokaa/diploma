import { _ as __nuxt_component_0 } from './nuxt-link-B1pdB3FY.mjs';
import { _ as __nuxt_component_2 } from './WishlistForm-DoDgGF9z.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc, a as useRouter } from './server.mjs';
import { u as useAuth } from './useAuth-D55glZy3.mjs';
import { u as useProfile } from './useProfile-DiW2onUU.mjs';
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
import './wishlistScenarios-Bq5lbsHk.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import './state-DQnwRar-.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const statusMessage = ref("");
    const canCreateWishlist = ref(true);
    const { getUser } = useAuth();
    useProfile();
    const { createWishlist } = useWishlists();
    const handleSubmit = async (payload) => {
      statusMessage.value = "";
      if (!payload.title.trim()) {
        statusMessage.value = "Wishlist title is required";
        return;
      }
      const user = await getUser();
      if (!user) {
        await router.push("/login");
        return;
      }
      const { data, error } = await createWishlist(user.id, payload);
      if (error || !data) {
        console.error("Wishlist creation failed:", error);
        statusMessage.value = error ? `Failed to create wishlist: ${error.message}` : "Failed to create wishlist";
        return;
      }
      await router.push(`/wishlists/${data.id}`);
    };
    const handleClose = async () => {
      await router.push("/wishlists");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_WishlistForm = __nuxt_component_2;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "page-section wishlist-create" }, _attrs))} data-v-c2290f43><div class="wishlist-create__layout" data-v-c2290f43><div class="surface-card wishlist-create__hero" data-v-c2290f43><div class="wishlist-create__hero-copy" data-v-c2290f43><span class="eyebrow" data-v-c2290f43>gifttt</span><h1 data-v-c2290f43>Create a wishlist that feels like your own.</h1><p data-v-c2290f43>Choose a scenario, set the tone, and fine-tune the sharing rules for this celebration.</p><div class="wishlist-create__hero-pills" data-v-c2290f43><span class="wishlist-create__hero-pill" data-v-c2290f43>Personal moments</span><span class="wishlist-create__hero-pill" data-v-c2290f43>Shared gifting</span><span class="wishlist-create__hero-pill" data-v-c2290f43>Secret Santa ready</span></div></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/wishlists",
        class: "button-secondary wishlist-create__back-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Back to my wishlists `);
          } else {
            return [
              createTextVNode(" Back to my wishlists ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(canCreateWishlist)) {
        _push(ssrRenderComponent(_component_WishlistForm, {
          "submit-label": "Create wishlist",
          "show-close-button": "",
          "close-label": "Close",
          onSubmit: handleSubmit,
          onClose: handleClose
        }, null, _parent));
      } else {
        _push(`<div class="surface-card wishlist-create__notice" data-v-c2290f43><p data-v-c2290f43>${ssrInterpolate(unref(statusMessage))}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/profile",
          class: "button-primary wishlist-create__profile-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Go to profile `);
            } else {
              return [
                createTextVNode(" Go to profile ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      if (unref(statusMessage) && unref(canCreateWishlist)) {
        _push(`<p class="wishlist-create__status" data-v-c2290f43>${ssrInterpolate(unref(statusMessage))}</p>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/wishlists/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const create = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c2290f43"]]);

export { create as default };
//# sourceMappingURL=create-Dyhq9aib.mjs.map
