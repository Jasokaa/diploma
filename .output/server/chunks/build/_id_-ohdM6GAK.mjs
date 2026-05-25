import { defineComponent, withAsyncContext, useSSRContext } from 'vue';
import { b as useRoute, n as navigateTo } from './server.mjs';
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
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import './state-DQnwRar-.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const { getProfileById } = useProfile();
    const profileId = String(route.params.id);
    const { data } = ([__temp, __restore] = withAsyncContext(() => getProfileById(profileId)), __temp = await __temp, __restore(), __temp);
    if (data?.username) {
      [__temp, __restore] = withAsyncContext(() => navigateTo(`/friends/${data.username}`)), await __temp, __restore();
    } else {
      [__temp, __restore] = withAsyncContext(() => navigateTo("/friends")), await __temp, __restore();
    }
    return () => {
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/users/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-ohdM6GAK.mjs.map
