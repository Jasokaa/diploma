import { _ as __nuxt_component_0 } from './nuxt-link-B1pdB3FY.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseEqual } from 'vue/server-renderer';
import { _ as _export_sfc, a as useRouter } from './server.mjs';
import { u as useAuth } from './useAuth-D55glZy3.mjs';
import { u as useProfile } from './useProfile-DiW2onUU.mjs';
import { u as useFriends } from './useFriends-6-ja2yAP.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const statusMessage = ref("");
    const followingProfiles = ref([]);
    const followerProfiles = ref([]);
    const mutualProfiles = ref([]);
    ref("");
    ref(false);
    const showProfileModal = ref(false);
    const profileStatusMessage = ref("");
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
    useFriends();
    const modalAvatarPreview = computed(() => {
      return avatarUrl.value || defaultProfileAvatar;
    });
    const followingIds = computed(() => followingProfiles.value.map((profile) => profile.id));
    const mutualIds = computed(() => mutualProfiles.value.map((profile) => profile.id));
    const followersOnly = computed(() => {
      return followerProfiles.value.filter((profile) => !mutualIds.value.includes(profile.id));
    });
    const followingOnly = computed(() => {
      return followingProfiles.value.filter((profile) => !mutualIds.value.includes(profile.id));
    });
    const networkHighlights = computed(() => {
      return [
        {
          label: "Mutual",
          value: mutualProfiles.value.length,
          note: "People already connected both ways"
        },
        {
          label: "Following",
          value: followingProfiles.value.length,
          note: "Profiles you keep an eye on"
        },
        {
          label: "Followers",
          value: followerProfiles.value.length,
          note: "People who want to follow your updates"
        }
      ];
    });
    const getProfileAvatar = (profile) => {
      return profile.avatar_url || defaultProfileAvatar;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "page-section friends-page" }, _attrs))} data-v-453de095><div class="surface-card" data-v-453de095><h1 data-v-453de095>Friends</h1><p data-v-453de095>Track your network, follow people back, and jump straight to their profiles when you need to.</p><div class="friends-page__hero-actions" data-v-453de095>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/search",
        class: "friends-page__action-link friends-page__action-link--primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Find people `);
          } else {
            return [
              createTextVNode(" Find people ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(statusMessage)) {
        _push(`<p data-v-453de095>${ssrInterpolate(unref(statusMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="friends-page__highlights" data-v-453de095><!--[-->`);
      ssrRenderList(unref(networkHighlights), (item) => {
        _push(`<article class="friends-page__highlight-card" data-v-453de095><span class="friends-page__highlight-value" data-v-453de095>${ssrInterpolate(item.value)}</span><div class="friends-page__highlight-copy" data-v-453de095><strong data-v-453de095>${ssrInterpolate(item.label)}</strong><span data-v-453de095>${ssrInterpolate(item.note)}</span></div></article>`);
      });
      _push(`<!--]--></div></div><div class="surface-card" data-v-453de095><div class="friends-page__section-copy" data-v-453de095><h2 data-v-453de095>Mutual friends</h2><p data-v-453de095>Your closest circle inside gifttt, ready for faster profile and wishlist access.</p></div>`);
      if (unref(mutualProfiles).length) {
        _push(`<div class="friends-page__cards" data-v-453de095><!--[-->`);
        ssrRenderList(unref(mutualProfiles), (profile) => {
          _push(`<article class="surface-card friends-page__card" data-v-453de095><div class="friends-page__card-main" data-v-453de095><img${ssrRenderAttr("src", getProfileAvatar(profile))}${ssrRenderAttr("alt", profile.full_name)} class="friends-page__card-avatar" data-v-453de095><div data-v-453de095><h3 class="friends-page__card-title" data-v-453de095>${ssrInterpolate(profile.full_name)}</h3><p class="friends-page__card-username" data-v-453de095>@${ssrInterpolate(profile.username)}</p></div></div><div class="friends-page__card-actions" data-v-453de095><p class="friends-page__following-note" data-v-453de095>You follow each other.</p>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/friends/${profile.username}`,
            class: "friends-page__action-link"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`View profile`);
              } else {
                return [
                  createTextVNode("View profile")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<button type="button" class="button-secondary" data-v-453de095>Unfollow</button></div></article>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<p data-v-453de095> No mutual friends yet. </p>`);
      }
      _push(`</div><div class="surface-card" data-v-453de095><div class="friends-page__section-copy" data-v-453de095><h2 data-v-453de095>Following</h2><p data-v-453de095>People whose public wishlists and updates you want to keep nearby.</p></div>`);
      if (unref(followingOnly).length) {
        _push(`<div class="friends-page__cards" data-v-453de095><!--[-->`);
        ssrRenderList(unref(followingOnly), (profile) => {
          _push(`<article class="surface-card friends-page__card" data-v-453de095><div class="friends-page__card-main" data-v-453de095><img${ssrRenderAttr("src", getProfileAvatar(profile))}${ssrRenderAttr("alt", profile.full_name)} class="friends-page__card-avatar" data-v-453de095><div data-v-453de095><h3 class="friends-page__card-title" data-v-453de095>${ssrInterpolate(profile.full_name)}</h3><p class="friends-page__card-username" data-v-453de095>@${ssrInterpolate(profile.username)}</p></div></div><div class="friends-page__card-actions" data-v-453de095><p class="friends-page__following-note" data-v-453de095>You are following this user.</p>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/friends/${profile.username}`,
            class: "friends-page__action-link"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`View profile`);
              } else {
                return [
                  createTextVNode("View profile")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<button type="button" class="button-secondary" data-v-453de095>Unfollow</button></div></article>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<p data-v-453de095> No one is in your following-only list. </p>`);
      }
      _push(`</div><div class="surface-card" data-v-453de095><div class="friends-page__section-copy" data-v-453de095><h2 data-v-453de095>Followers</h2><p data-v-453de095>People who are already interested in your profile and may want to follow back.</p></div>`);
      if (unref(followersOnly).length) {
        _push(`<div class="friends-page__cards" data-v-453de095><!--[-->`);
        ssrRenderList(unref(followersOnly), (profile) => {
          _push(`<article class="surface-card friends-page__card" data-v-453de095><div class="friends-page__card-main" data-v-453de095><img${ssrRenderAttr("src", getProfileAvatar(profile))}${ssrRenderAttr("alt", profile.full_name)} class="friends-page__card-avatar" data-v-453de095><div data-v-453de095><h3 class="friends-page__card-title" data-v-453de095>${ssrInterpolate(profile.full_name)}</h3><p class="friends-page__card-username" data-v-453de095>@${ssrInterpolate(profile.username)}</p></div></div><div class="friends-page__card-actions" data-v-453de095><p class="friends-page__following-note" data-v-453de095>This user follows you.</p>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/friends/${profile.username}`,
            class: "friends-page__action-link"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`View profile`);
              } else {
                return [
                  createTextVNode("View profile")
                ];
              }
            }),
            _: 2
          }, _parent));
          if (!unref(followingIds).includes(profile.id)) {
            _push(`<button type="button" class="button-primary" data-v-453de095> Follow back </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></article>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<p data-v-453de095> No follower-only profiles yet. </p>`);
      }
      _push(`</div>`);
      if (unref(showProfileModal)) {
        _push(`<div class="friends-page__modal-backdrop" data-v-453de095><div class="surface-card friends-page__modal" data-v-453de095><h2 data-v-453de095>Complete profile first</h2><p data-v-453de095>Please fill in your profile before following other users.</p><img${ssrRenderAttr("src", unref(modalAvatarPreview))} alt="Profile avatar preview" class="friends-page__modal-avatar" data-v-453de095><div data-v-453de095><label for="friends-profile-email" data-v-453de095>Email</label><input id="friends-profile-email"${ssrRenderAttr("value", unref(email))} type="email" readonly data-v-453de095></div><div data-v-453de095><label for="friends-profile-full-name" data-v-453de095>Full name</label><input id="friends-profile-full-name"${ssrRenderAttr("value", unref(fullName))} type="text" placeholder="Enter your full name" data-v-453de095></div><div data-v-453de095><label for="friends-profile-username" data-v-453de095>Username</label><input id="friends-profile-username"${ssrRenderAttr("value", unref(username))} type="text" placeholder="Enter a username" data-v-453de095></div><div data-v-453de095><label for="friends-profile-birth-date" data-v-453de095>Date of birth</label><input id="friends-profile-birth-date"${ssrRenderAttr("value", unref(birthDate))} type="date" data-v-453de095></div><fieldset class="friends-page__modal-avatar-picker" data-v-453de095><legend data-v-453de095>Choose avatar</legend><div class="friends-page__modal-avatar-options" data-v-453de095><!--[-->`);
        ssrRenderList(avatarOptions, (option) => {
          _push(`<label class="friends-page__modal-avatar-option" data-v-453de095><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(avatarUrl), option.image)) ? " checked" : ""} type="radio" name="friends-profile-avatar"${ssrRenderAttr("value", option.image)} data-v-453de095><img${ssrRenderAttr("src", option.image)}${ssrRenderAttr("alt", option.label)} class="friends-page__modal-avatar-option-image" data-v-453de095><span data-v-453de095>${ssrInterpolate(option.label)}</span></label>`);
        });
        _push(`<!--]--></div></fieldset><button type="button" data-v-453de095>Save profile</button><button type="button" data-v-453de095>Close</button>`);
        if (unref(profileStatusMessage)) {
          _push(`<p data-v-453de095>${ssrInterpolate(unref(profileStatusMessage))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/friends/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-453de095"]]);

export { index as default };
//# sourceMappingURL=index-BJSqJsvt.mjs.map
