import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc, a as useRouter, u as useNuxtApp } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "reset-password",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const newPassword = ref("");
    const confirmPassword = ref("");
    const statusMessage = ref("");
    const { $supabase } = useNuxtApp();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "page-section auth-page" }, _attrs))} data-v-16b448c9><div class="auth-page__layout auth-page__layout--single" data-v-16b448c9><div class="surface-card auth-page__form" data-v-16b448c9><div class="auth-page__heading" data-v-16b448c9><span class="eyebrow" data-v-16b448c9>gifttt</span><h1 data-v-16b448c9>Create a new password</h1><p data-v-16b448c9>Choose a new password for your account and then return to log in.</p></div><form class="auth-page__inner-form" data-v-16b448c9><label class="auth-page__field" for="new-password" data-v-16b448c9><span data-v-16b448c9>New password</span><input id="new-password"${ssrRenderAttr("value", unref(newPassword))} type="password" placeholder="Enter new password" data-v-16b448c9></label><label class="auth-page__field" for="confirm-password" data-v-16b448c9><span data-v-16b448c9>Confirm password</span><input id="confirm-password"${ssrRenderAttr("value", unref(confirmPassword))} type="password" placeholder="Confirm new password" data-v-16b448c9></label><button type="submit" class="button-primary auth-page__submit" data-v-16b448c9> Update password </button></form>`);
      if (unref(statusMessage)) {
        _push(`<p class="auth-page__status" data-v-16b448c9>${ssrInterpolate(unref(statusMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reset-password.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const resetPassword = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-16b448c9"]]);

export { resetPassword as default };
//# sourceMappingURL=reset-password-58X2uliP.mjs.map
