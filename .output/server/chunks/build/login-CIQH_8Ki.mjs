import { _ as __nuxt_component_0 } from './nuxt-link-B1pdB3FY.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import './state-DQnwRar-.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    const email = ref("");
    const password = ref("");
    const statusMessage = ref("");
    useAuth();
    useProfile();
    useRouter();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "page-section auth-page" }, _attrs))} data-v-fe113431><div class="auth-page__layout" data-v-fe113431><div class="surface-card auth-page__intro" data-v-fe113431><span class="eyebrow" data-v-fe113431>gifttt</span><h1 data-v-fe113431>Welcome back.</h1><p data-v-fe113431>Log in to open your wishlists, keep gift plans together, and pick up where you left off.</p><div class="auth-page__pills" data-v-fe113431><span class="auth-page__pill" data-v-fe113431>Private sharing</span><span class="auth-page__pill" data-v-fe113431>Split gifts</span><span class="auth-page__pill" data-v-fe113431>Secret Santa</span></div></div><form class="surface-card auth-page__form" data-v-fe113431><div class="auth-page__heading" data-v-fe113431><h2 data-v-fe113431>Log in</h2><p data-v-fe113431>Use your email and password to continue to your space.</p></div><label class="auth-page__field" for="email" data-v-fe113431><span data-v-fe113431>Email</span><input id="email"${ssrRenderAttr("value", unref(email))} type="email" placeholder="name@example.com" data-v-fe113431></label><label class="auth-page__field" for="password" data-v-fe113431><span data-v-fe113431>Password</span><input id="password"${ssrRenderAttr("value", unref(password))} type="password" placeholder="Enter password" data-v-fe113431></label><button type="submit" class="button-primary auth-page__submit" data-v-fe113431> Log in </button>`);
      if (unref(statusMessage)) {
        _push(`<p class="auth-page__status" data-v-fe113431>${ssrInterpolate(unref(statusMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="auth-page__links" data-v-fe113431>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/forgot-password",
        class: "auth-page__link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Forgot password? `);
          } else {
            return [
              createTextVNode(" Forgot password? ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p data-v-fe113431> Don’t have an account? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/register",
        class: "auth-page__link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Sign up `);
          } else {
            return [
              createTextVNode(" Sign up ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div></form></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fe113431"]]);

export { login as default };
//# sourceMappingURL=login-CIQH_8Ki.mjs.map
