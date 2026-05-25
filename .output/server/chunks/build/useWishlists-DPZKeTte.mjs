import { u as useNuxtApp } from './server.mjs';
import { u as useState } from './state-DQnwRar-.mjs';

const mapWishlist = (wishlist) => ({
  id: wishlist.id,
  ownerId: wishlist.owner_id,
  title: wishlist.title,
  description: wishlist.description,
  visibility: wishlist.visibility,
  giftReservation: wishlist.gift_reservation,
  hideReservedGiftsFromAuthor: wishlist.hide_reserved_gifts_from_author,
  splitGifts: wishlist.split_gifts,
  randomGiftSelection: wishlist.random_gift_selection,
  participantVisibility: wishlist.participant_visibility,
  wishlistCollaboration: wishlist.wishlist_collaboration,
  giftStatusVisibility: wishlist.gift_status_visibility,
  eventDate: wishlist.event_date,
  eventTime: wishlist.event_time,
  eventTimezone: wishlist.event_timezone,
  secretAssignmentMode: wishlist.secret_assignment_mode,
  participantJoinMode: wishlist.participant_join_mode,
  themeKey: wishlist.theme_key || "standard",
  createdAt: wishlist.created_at,
  updatedAt: wishlist.updated_at
});
const mapParticipant = (participant) => ({
  id: participant.id,
  wishlistId: participant.wishlist_id,
  userId: participant.user_id,
  status: participant.status,
  role: participant.role,
  invitedBy: participant.invited_by,
  createdAt: participant.created_at,
  updatedAt: participant.updated_at,
  profile: participant.profile || null
});
const mapAccessRecord = (item) => {
  if (!item.wishlist) {
    return null;
  }
  return {
    participant: mapParticipant(item),
    wishlist: mapWishlist(item.wishlist)
  };
};
const mapAssignment = (assignment) => ({
  id: assignment.id,
  wishlistId: assignment.wishlist_id,
  giverUserId: assignment.giver_user_id,
  recipientUserId: assignment.recipient_user_id,
  assignmentMode: assignment.assignment_mode,
  assignedBy: assignment.assigned_by,
  createdAt: assignment.created_at,
  giverProfile: assignment.giver_profile || null,
  recipientProfile: assignment.recipient_profile || null
});
const buildWishlistPayload = (payload) => ({
  title: payload.title,
  description: payload.description || null,
  visibility: payload.visibility,
  gift_reservation: payload.giftReservation,
  hide_reserved_gifts_from_author: payload.hideReservedGiftsFromAuthor,
  split_gifts: payload.splitGifts,
  random_gift_selection: payload.randomGiftSelection,
  participant_visibility: payload.participantVisibility,
  wishlist_collaboration: payload.wishlistCollaboration,
  gift_status_visibility: payload.giftStatusVisibility,
  event_date: payload.eventDate || null,
  event_time: payload.eventTime || null,
  event_timezone: payload.eventTimezone || null,
  secret_assignment_mode: payload.secretAssignmentMode,
  participant_join_mode: payload.participantJoinMode,
  theme_key: payload.themeKey
});
const buildParticipantPayload = (wishlistId, userId, status, role = "participant") => ({
  wishlist_id: wishlistId,
  user_id: userId,
  status,
  role,
  updated_at: (/* @__PURE__ */ new Date()).toISOString()
});
const mapSingleParticipantMutation = (data) => {
  if (!data) {
    return null;
  }
  if (Array.isArray(data)) {
    return data[0] ? mapParticipant(data[0]) : null;
  }
  return mapParticipant(data);
};
const replaceParticipantStatus = async ($supabase, participant, status) => {
  const deleteResponse = await $supabase.from("wishlist_participants").delete().eq("id", participant.id);
  if (deleteResponse.error) {
    return {
      data: null,
      error: deleteResponse.error
    };
  }
  const insertResponse = await $supabase.from("wishlist_participants").insert({
    wishlist_id: participant.wishlistId,
    user_id: participant.userId,
    status,
    role: participant.role || "participant",
    invited_by: participant.invitedBy || null,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).select("*");
  return {
    data: mapSingleParticipantMutation(insertResponse.data),
    error: insertResponse.error
  };
};
const respondToInvitationViaRpc = async ($supabase, wishlistId, nextStatus) => {
  const rpcResponse = await $supabase.rpc("respond_to_wishlist_invitation", {
    target_wishlist_id: wishlistId,
    next_status: nextStatus
  });
  return {
    data: mapSingleParticipantMutation(rpcResponse.data),
    error: rpcResponse.error
  };
};
const respondToInvitationViaApi = async ($supabase, wishlistId, nextStatus) => {
  const {
    data: { session }
  } = await $supabase.auth.getSession();
  if (!session?.access_token) {
    return {
      data: null,
      error: {
        message: "Please log in again to respond to this invitation."
      }
    };
  }
  try {
    const response = await $fetch("/api/wishlists/respond-invitation", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`
      },
      body: {
        wishlistId,
        status: nextStatus
      }
    });
    return {
      data: mapSingleParticipantMutation(response),
      error: null
    };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error?.data?.message || error?.message || "Failed to respond to the invitation."
      }
    };
  }
};
const useWishlists = () => {
  const { $supabase } = useNuxtApp();
  const wishlists = useState("wishlists", () => []);
  const getExistingParticipant = async (wishlistId, userId) => {
    return await $supabase.from("wishlist_participants").select("*").eq("wishlist_id", wishlistId).eq("user_id", userId).maybeSingle();
  };
  const getOwnWishlists = async (ownerId) => {
    const response = await $supabase.from("wishlists").select("*").eq("owner_id", ownerId).order("created_at", { ascending: false });
    const mappedWishlists = (response.data || []).map(mapWishlist);
    if (!response.error) {
      wishlists.value = mappedWishlists;
    }
    return {
      data: mappedWishlists,
      error: response.error
    };
  };
  const getJoinedWishlists = async (userId) => {
    const participantResponse = await $supabase.from("wishlist_participants").select("wishlist:wishlists(*)").eq("user_id", userId).eq("status", "approved");
    if (participantResponse.error) {
      return {
        data: [],
        error: participantResponse.error
      };
    }
    const mappedWishlists = (participantResponse.data || []).map((item) => item.wishlist).filter(Boolean).map(mapWishlist);
    return {
      data: mappedWishlists,
      error: null
    };
  };
  const getFollowingPublicWishlists = async (userId) => {
    const followingResponse = await $supabase.from("user_follows").select("following_id").eq("follower_id", userId);
    if (followingResponse.error || !followingResponse.data?.length) {
      return {
        data: [],
        error: followingResponse.error
      };
    }
    const followingIds = followingResponse.data.map((item) => item.following_id);
    const wishlistResponse = await $supabase.from("wishlists").select("*").in("owner_id", followingIds).eq("visibility", "public").order("created_at", { ascending: false });
    return {
      data: (wishlistResponse.data || []).map(mapWishlist),
      error: wishlistResponse.error
    };
  };
  const getAccessRecordsByStatus = async (userId, statuses) => {
    const response = await $supabase.from("wishlist_participants").select("*, wishlist:wishlists(*)").eq("user_id", userId).in("status", statuses).order("created_at", { ascending: false });
    return {
      data: (response.data || []).map(mapAccessRecord).filter(Boolean),
      error: response.error
    };
  };
  const getWishlistCollections = async (userId) => {
    const [ownResponse, joinedResponse, followingResponse, invitationsResponse, requestsResponse] = await Promise.all([
      getOwnWishlists(userId),
      getJoinedWishlists(userId),
      getFollowingPublicWishlists(userId),
      getAccessRecordsByStatus(userId, ["invited"]),
      getAccessRecordsByStatus(userId, ["pending", "rejected"])
    ]);
    const errors = [
      ownResponse.error,
      joinedResponse.error,
      followingResponse.error,
      invitationsResponse.error,
      requestsResponse.error
    ].filter(Boolean);
    const joinedWishlists = joinedResponse.data.filter((wishlist) => wishlist.ownerId !== userId);
    const joinedIds = joinedWishlists.map((wishlist) => wishlist.id);
    const ownIds = ownResponse.data.map((wishlist) => wishlist.id);
    const collections = {
      own: ownResponse.data,
      joined: joinedWishlists,
      incomingInvitations: invitationsResponse.data.filter((record) => !ownIds.includes(record.wishlist.id)),
      accessRequests: requestsResponse.data.filter((record) => !ownIds.includes(record.wishlist.id)),
      followingPublic: followingResponse.data.filter((wishlist) => {
        return wishlist.ownerId !== userId && !joinedIds.includes(wishlist.id) && !ownIds.includes(wishlist.id) && !invitationsResponse.data.some((record) => record.wishlist.id === wishlist.id) && !requestsResponse.data.some((record) => record.wishlist.id === wishlist.id);
      })
    };
    return {
      data: collections,
      error: errors[0] || null
    };
  };
  const getWishlistsByOwner = async (ownerId) => {
    const response = await $supabase.from("wishlists").select("*").eq("owner_id", ownerId).order("created_at", { ascending: false });
    return {
      data: (response.data || []).map(mapWishlist),
      error: response.error
    };
  };
  const getWishlistById = async (wishlistId) => {
    const response = await $supabase.from("wishlists").select("*").eq("id", wishlistId).maybeSingle();
    return {
      data: response.data ? mapWishlist(response.data) : null,
      error: response.error
    };
  };
  const getWishlistAssignments = async (wishlistId) => {
    const response = await $supabase.from("wishlist_assignments").select(`
        *,
        giver_profile:profiles!wishlist_assignments_giver_user_id_fkey (
          id,
          full_name,
          username,
          avatar_url
        ),
        recipient_profile:profiles!wishlist_assignments_recipient_user_id_fkey (
          id,
          full_name,
          username,
          avatar_url
        )
      `).eq("wishlist_id", wishlistId).order("created_at", { ascending: true });
    return {
      data: (response.data || []).map(mapAssignment),
      error: response.error
    };
  };
  const getOwnWishlistAssignment = async (wishlistId, userId) => {
    const response = await $supabase.from("wishlist_assignments").select(`
        *,
        giver_profile:profiles!wishlist_assignments_giver_user_id_fkey (
          id,
          full_name,
          username,
          avatar_url
        ),
        recipient_profile:profiles!wishlist_assignments_recipient_user_id_fkey (
          id,
          full_name,
          username,
          avatar_url
        )
      `).eq("wishlist_id", wishlistId).eq("giver_user_id", userId).maybeSingle();
    return {
      data: response.data ? mapAssignment(response.data) : null,
      error: response.error
    };
  };
  const createWishlistAssignments = async (wishlistId, assignments, assignmentMode, assignedBy) => {
    const response = await $supabase.from("wishlist_assignments").insert(assignments.map((assignment) => ({
      wishlist_id: wishlistId,
      giver_user_id: assignment.giverUserId,
      recipient_user_id: assignment.recipientUserId,
      assignment_mode: assignmentMode,
      assigned_by: assignedBy
    }))).select(`
        *,
        giver_profile:profiles!wishlist_assignments_giver_user_id_fkey (
          id,
          full_name,
          username,
          avatar_url
        ),
        recipient_profile:profiles!wishlist_assignments_recipient_user_id_fkey (
          id,
          full_name,
          username,
          avatar_url
        )
      `);
    return {
      data: (response.data || []).map(mapAssignment),
      error: response.error
    };
  };
  const deleteWishlistAssignments = async (wishlistId) => {
    const response = await $supabase.from("wishlist_assignments").delete().eq("wishlist_id", wishlistId);
    return {
      error: response.error
    };
  };
  const createWishlist = async (ownerId, payload) => {
    const response = await $supabase.from("wishlists").insert({
      owner_id: ownerId,
      ...buildWishlistPayload(payload)
    }).select("*").single();
    return {
      data: response.data ? mapWishlist(response.data) : null,
      error: response.error
    };
  };
  const updateWishlist = async (wishlistId, payload) => {
    const response = await $supabase.from("wishlists").update({
      ...buildWishlistPayload(payload),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", wishlistId).select("*").single();
    return {
      data: response.data ? mapWishlist(response.data) : null,
      error: response.error
    };
  };
  const deleteWishlist = async (wishlistId) => {
    return await $supabase.from("wishlists").delete().eq("id", wishlistId);
  };
  const getWishlistParticipants = async (wishlistId) => {
    const response = await $supabase.from("wishlist_participants").select(`
        *,
        profile:profiles!wishlist_participants_user_id_fkey (
          id,
          full_name,
          username,
          avatar_url,
          email
        )
      `).eq("wishlist_id", wishlistId).order("created_at", { ascending: true });
    return {
      data: (response.data || []).map(mapParticipant),
      error: response.error
    };
  };
  const getUserParticipation = async (wishlistId, userId) => {
    const response = await $supabase.from("wishlist_participants").select("*").eq("wishlist_id", wishlistId).eq("user_id", userId).maybeSingle();
    return {
      data: response.data ? mapParticipant(response.data) : null,
      error: response.error
    };
  };
  const getUserParticipationsForWishlists = async (wishlistIds, userId) => {
    if (!wishlistIds.length) {
      return {
        data: [],
        error: null
      };
    }
    const response = await $supabase.from("wishlist_participants").select("*").in("wishlist_id", wishlistIds).eq("user_id", userId);
    return {
      data: (response.data || []).map(mapParticipant),
      error: response.error
    };
  };
  const inviteUserToWishlist = async (wishlistId, userId, invitedBy) => {
    const response = await $supabase.from("wishlist_participants").upsert({
      wishlist_id: wishlistId,
      user_id: userId,
      invited_by: invitedBy,
      status: "invited",
      role: "participant",
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }, {
      onConflict: "wishlist_id,user_id"
    }).select("*");
    return {
      data: mapSingleParticipantMutation(response.data),
      error: response.error
    };
  };
  const requestToJoinWishlist = async (wishlist, userId) => {
    if (wishlist.participantJoinMode === "invite_only") {
      return {
        data: null,
        error: {
          message: "This wishlist is available by invitation only."
        }
      };
    }
    const nextStatus = wishlist.participantJoinMode === "open" ? "approved" : "pending";
    const existingResponse = await getExistingParticipant(wishlist.id, userId);
    if (existingResponse.error) {
      return {
        data: null,
        error: existingResponse.error
      };
    }
    if (existingResponse.data) {
      const response2 = await $supabase.from("wishlist_participants").update({
        status: nextStatus,
        role: existingResponse.data.role || "participant",
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", existingResponse.data.id).select("*");
      return {
        data: mapSingleParticipantMutation(response2.data),
        error: response2.error
      };
    }
    const response = await $supabase.from("wishlist_participants").insert(buildParticipantPayload(wishlist.id, userId, nextStatus)).select("*");
    return {
      data: mapSingleParticipantMutation(response.data),
      error: response.error
    };
  };
  const acceptInvitation = async (wishlistId, userId) => {
    const existingResponse = await getExistingParticipant(wishlistId, userId);
    if (existingResponse.error) {
      return {
        data: null,
        error: existingResponse.error
      };
    }
    if (existingResponse.data) {
      const apiResponse = await respondToInvitationViaApi($supabase, wishlistId, "approved");
      if (!apiResponse.error && apiResponse.data) {
        return apiResponse;
      }
      const rpcResponse = await respondToInvitationViaRpc($supabase, wishlistId, "approved");
      if (!rpcResponse.error && rpcResponse.data) {
        return rpcResponse;
      }
      const response2 = await $supabase.from("wishlist_participants").update({
        status: "approved",
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", existingResponse.data.id).select("*");
      const mappedParticipant = mapSingleParticipantMutation(response2.data);
      if (mappedParticipant || response2.error) {
        return {
          data: mappedParticipant,
          error: response2.error
        };
      }
      return await replaceParticipantStatus($supabase, existingResponse.data, "approved");
    }
    const response = await $supabase.from("wishlist_participants").insert(buildParticipantPayload(wishlistId, userId, "approved")).select("*");
    return {
      data: mapSingleParticipantMutation(response.data),
      error: response.error
    };
  };
  const rejectInvitation = async (wishlistId, userId) => {
    const existingResponse = await getExistingParticipant(wishlistId, userId);
    if (existingResponse.error) {
      return {
        data: null,
        error: existingResponse.error
      };
    }
    if (existingResponse.data) {
      const apiResponse = await respondToInvitationViaApi($supabase, wishlistId, "rejected");
      if (!apiResponse.error && apiResponse.data) {
        return apiResponse;
      }
      const rpcResponse = await respondToInvitationViaRpc($supabase, wishlistId, "rejected");
      if (!rpcResponse.error && rpcResponse.data) {
        return rpcResponse;
      }
      const response2 = await $supabase.from("wishlist_participants").update({
        status: "rejected",
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", existingResponse.data.id).select("*");
      const mappedParticipant = mapSingleParticipantMutation(response2.data);
      if (mappedParticipant || response2.error) {
        return {
          data: mappedParticipant,
          error: response2.error
        };
      }
      return await replaceParticipantStatus($supabase, existingResponse.data, "rejected");
    }
    const response = await $supabase.from("wishlist_participants").insert(buildParticipantPayload(wishlistId, userId, "rejected")).select("*");
    return {
      data: mapSingleParticipantMutation(response.data),
      error: response.error
    };
  };
  const updateParticipationStatus = async (participantId, status) => {
    const response = await $supabase.from("wishlist_participants").update({
      status,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", participantId).select("*");
    return {
      data: mapSingleParticipantMutation(response.data),
      error: response.error
    };
  };
  const removeParticipant = async (participantId) => {
    return await $supabase.from("wishlist_participants").delete().eq("id", participantId);
  };
  return {
    wishlists,
    getOwnWishlists,
    getJoinedWishlists,
    getFollowingPublicWishlists,
    getAccessRecordsByStatus,
    getWishlistCollections,
    getWishlistsByOwner,
    getWishlistById,
    getWishlistAssignments,
    getOwnWishlistAssignment,
    createWishlistAssignments,
    deleteWishlistAssignments,
    createWishlist,
    updateWishlist,
    deleteWishlist,
    getWishlistParticipants,
    getUserParticipation,
    getUserParticipationsForWishlists,
    inviteUserToWishlist,
    requestToJoinWishlist,
    acceptInvitation,
    rejectInvitation,
    updateParticipationStatus,
    removeParticipant
  };
};

export { useWishlists as u };
//# sourceMappingURL=useWishlists-DPZKeTte.mjs.map
