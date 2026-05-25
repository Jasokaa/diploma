import { d as defineEventHandler, u as useRuntimeConfig, g as getHeader, c as createError, r as readBody } from '../../../nitro/nitro.mjs';
import { createClient } from '@supabase/supabase-js';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const respondInvitation_post = defineEventHandler(async (event) => {
  var _a;
  const config = useRuntimeConfig(event);
  const authorization = getHeader(event, "authorization");
  if (!(authorization == null ? void 0 : authorization.startsWith("Bearer "))) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      data: {
        message: "Missing authorization token."
      }
    });
  }
  const accessToken = authorization.slice("Bearer ".length).trim();
  if (!accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      data: {
        message: "Missing authorization token."
      }
    });
  }
  const body = await readBody(event);
  if (!body.wishlistId || !body.status) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        message: "Wishlist ID and invitation status are required."
      }
    });
  }
  if (!["approved", "rejected"].includes(body.status)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        message: "Unsupported invitation response."
      }
    });
  }
  const userClient = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey);
  const {
    data: { user },
    error: authError
  } = await userClient.auth.getUser(accessToken);
  if (authError || !user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      data: {
        message: "Could not verify your session."
      }
    });
  }
  if (!config.supabaseServiceRoleKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Configuration Error",
      data: {
        message: "Missing Supabase service role configuration."
      }
    });
  }
  const adminClient = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey);
  const participantResponse = await adminClient.from("wishlist_participants").select("*").eq("wishlist_id", body.wishlistId).eq("user_id", user.id).eq("status", "invited").maybeSingle();
  if (participantResponse.error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Database Error",
      data: {
        message: participantResponse.error.message
      }
    });
  }
  if (!participantResponse.data) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      data: {
        message: "Invitation not found or has already been processed."
      }
    });
  }
  const updateResponse = await adminClient.from("wishlist_participants").update({
    status: body.status,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", participantResponse.data.id).select("*").single();
  if (updateResponse.error || !updateResponse.data) {
    throw createError({
      statusCode: 500,
      statusMessage: "Database Error",
      data: {
        message: ((_a = updateResponse.error) == null ? void 0 : _a.message) || "Failed to update the invitation."
      }
    });
  }
  return updateResponse.data;
});

export { respondInvitation_post as default };
//# sourceMappingURL=respond-invitation.post.mjs.map
