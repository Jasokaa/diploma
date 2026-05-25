import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseEqual } from 'vue/server-renderer';
import { _ as _export_sfc, a as useRouter } from './server.mjs';
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

const defaultProfileAvatar = "/images/avatars/avatar-standart.png";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const statusMessage = ref("");
    ref(false);
    const isLoading = ref(true);
    const avatarOptions = [
      { id: "avatar-1", label: "Avatar 1", image: "/images/avatars/avatar-1.png" },
      { id: "avatar-2", label: "Avatar 2", image: "/images/avatars/avatar-2.png" },
      { id: "avatar-3", label: "Avatar 3", image: "/images/avatars/avatar-3.png" },
      { id: "avatar-4", label: "Avatar 4", image: "/images/avatars/avatar-4.png" },
      { id: "avatar-5", label: "Avatar 5", image: "/images/avatars/avatar-5.png" },
      { id: "avatar-6", label: "Avatar 6", image: "/images/avatars/avatar-6.png" },
      { id: "avatar-7", label: "Avatar 7", image: "/images/avatars/avatar-7.png" },
      { id: "avatar-8", label: "Avatar 8", image: "/images/avatars/avatar-8.png" }
    ];
    const email = ref("");
    const fullName = ref("");
    const username = ref("");
    const birthDate = ref("");
    const avatarUrl = ref("");
    useAuth();
    useProfile();
    const avatarPreview = computed(() => {
      return avatarUrl.value || defaultProfileAvatar;
    });
    const showDeleteConfirmModal = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "page-section" }, _attrs))} data-v-6ac1ebfe>`);
      if (unref(isLoading)) {
        _push(`<div class="surface-card profile-page profile-page--loading" data-v-6ac1ebfe><div class="profile-page__skeleton-avatar" data-v-6ac1ebfe></div><div class="profile-page__skeleton-line profile-page__skeleton-line--long" data-v-6ac1ebfe></div><div class="profile-page__skeleton-line" data-v-6ac1ebfe></div><div class="profile-page__skeleton-line" data-v-6ac1ebfe></div><div class="profile-page__skeleton-line" data-v-6ac1ebfe></div><div class="profile-page__skeleton-grid" data-v-6ac1ebfe><!--[-->`);
        ssrRenderList(8, (item) => {
          _push(`<div class="profile-page__skeleton-option" data-v-6ac1ebfe></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(isLoading)) {
        _push(`<div class="surface-card profile-page" data-v-6ac1ebfe><div class="profile-page__intro" data-v-6ac1ebfe><div class="profile-page__intro-copy" data-v-6ac1ebfe><span class="eyebrow" data-v-6ac1ebfe>My space</span><h1 data-v-6ac1ebfe>Profile</h1><p data-v-6ac1ebfe>Keep your public identity polished so wishlists, friends, and invitations always feel personal.</p></div><div class="profile-page__snapshot" data-v-6ac1ebfe><img${ssrRenderAttr("src", unref(avatarPreview))} alt="Profile avatar preview" class="profile-page__avatar" data-v-6ac1ebfe><div class="profile-page__snapshot-meta" data-v-6ac1ebfe><strong data-v-6ac1ebfe>${ssrInterpolate(unref(fullName) || "Your name here")}</strong><span data-v-6ac1ebfe>${ssrInterpolate(unref(username) ? `@${unref(username)}` : "Choose a username")}</span></div></div></div><div class="profile-page__field-grid" data-v-6ac1ebfe><div data-v-6ac1ebfe><label for="profile-email" data-v-6ac1ebfe>Email</label><input id="profile-email"${ssrRenderAttr("value", unref(email))} type="email" readonly data-v-6ac1ebfe></div><div data-v-6ac1ebfe><label for="profile-full-name" data-v-6ac1ebfe>Full name</label><input id="profile-full-name"${ssrRenderAttr("value", unref(fullName))} type="text" placeholder="Enter your full name" data-v-6ac1ebfe></div><div data-v-6ac1ebfe><label for="profile-username" data-v-6ac1ebfe>Username</label><input id="profile-username"${ssrRenderAttr("value", unref(username))} type="text" placeholder="Enter a username" data-v-6ac1ebfe></div><div data-v-6ac1ebfe><label for="profile-birth-date" data-v-6ac1ebfe>Date of birth</label><input id="profile-birth-date"${ssrRenderAttr("value", unref(birthDate))} type="date" data-v-6ac1ebfe></div></div><fieldset class="profile-page__avatar-picker" data-v-6ac1ebfe><legend data-v-6ac1ebfe>Choose avatar</legend><label class="profile-page__upload" data-v-6ac1ebfe><span data-v-6ac1ebfe>Upload your photo</span><input type="file" accept="image/*" data-v-6ac1ebfe></label><div class="profile-page__avatar-options" data-v-6ac1ebfe><!--[-->`);
        ssrRenderList(avatarOptions, (option) => {
          _push(`<label class="profile-page__avatar-option" data-v-6ac1ebfe><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(avatarUrl), option.image)) ? " checked" : ""} type="radio" name="profile-avatar"${ssrRenderAttr("value", option.image)} data-v-6ac1ebfe><img${ssrRenderAttr("src", option.image)}${ssrRenderAttr("alt", option.label)} class="profile-page__avatar-option-image" data-v-6ac1ebfe><span data-v-6ac1ebfe>${ssrInterpolate(option.label)}</span></label>`);
        });
        _push(`<!--]--></div></fieldset><div class="profile-page__actions" data-v-6ac1ebfe><button type="button" data-v-6ac1ebfe> Save profile data </button><button type="button" class="profile-page__secondary-button" data-v-6ac1ebfe> Sign out </button><button type="button" class="profile-page__danger-button" data-v-6ac1ebfe> Delete profile </button></div>`);
        if (unref(statusMessage)) {
          _push(`<p data-v-6ac1ebfe>${ssrInterpolate(unref(statusMessage))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showDeleteConfirmModal)) {
        _push(`<div class="profile-page__modal-backdrop" data-v-6ac1ebfe><div class="surface-card profile-page__confirm-modal" data-v-6ac1ebfe><div class="profile-page__confirm-copy" data-v-6ac1ebfe><h2 data-v-6ac1ebfe>Delete profile data?</h2><p data-v-6ac1ebfe>Your login account will stay active, but your profile and related app data will be removed.</p></div><div class="profile-page__confirm-actions" data-v-6ac1ebfe><button type="button" class="profile-page__secondary-button" data-v-6ac1ebfe> Cancel </button><button type="button" class="profile-page__danger-button" data-v-6ac1ebfe> Delete profile </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const profile = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6ac1ebfe"]]);

export { profile as default };
//# sourceMappingURL=profile-VnDUOZLc.mjs.map
