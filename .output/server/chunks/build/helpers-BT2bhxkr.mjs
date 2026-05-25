const splitWishlistTitle = (rawTitle) => {
  const normalizedTitle = rawTitle.trim();
  if (!normalizedTitle) {
    return {
      cover: "",
      text: ""
    };
  }
  const [firstToken = "", ...restTokens] = normalizedTitle.split(" ");
  const emojiLikePattern = /^[\p{Extended_Pictographic}\uFE0F\u200D]+$/u;
  if (emojiLikePattern.test(firstToken)) {
    return {
      cover: firstToken,
      text: restTokens.join(" ").trim()
    };
  }
  return {
    cover: "",
    text: normalizedTitle
  };
};
const formatWishlistVisibility = (value) => {
  const labels = {
    private: "Private",
    friends_only: "Invited participants only",
    public: "Public"
  };
  return labels[value] || value;
};
const formatParticipantJoinMode = (value) => {
  const labels = {
    open: "Open",
    approval_required: "Approval required",
    invite_only: "Invite only"
  };
  return labels[value] || value;
};
const formatGiftReservationSetting = (value) => {
  const labels = {
    enabled: "Enabled",
    disabled: "Disabled"
  };
  return labels[value] || value;
};
const formatGiftStatusVisibility = (value) => {
  const labels = {
    full: "Full",
    partial: "Partial",
    hidden: "Hidden"
  };
  return labels[value] || value;
};
const formatParticipantStatus = (value) => {
  const labels = {
    invited: "Invited",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected"
  };
  return labels[value] || value;
};

export { formatParticipantJoinMode as a, formatGiftReservationSetting as b, formatGiftStatusVisibility as c, formatParticipantStatus as d, formatWishlistVisibility as f, splitWishlistTitle as s };
//# sourceMappingURL=helpers-BT2bhxkr.mjs.map
