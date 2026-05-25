// This file contains simple shared helper functions.
// It can later include formatters, guards, and small data transformation utilities.
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

export const splitWishlistTitle = (rawTitle: string) => {
  const normalizedTitle = rawTitle.trim()

  if (!normalizedTitle) {
    return {
      cover: '',
      text: ''
    }
  }

  const [firstToken = '', ...restTokens] = normalizedTitle.split(' ')
  const emojiLikePattern = /^[\p{Extended_Pictographic}\uFE0F\u200D]+$/u

  if (emojiLikePattern.test(firstToken)) {
    return {
      cover: firstToken,
      text: restTokens.join(' ').trim()
    }
  }

  return {
    cover: '',
    text: normalizedTitle
  }
}

export const formatWishlistVisibility = (value: string) => {
  const labels: Record<string, string> = {
    private: 'Private',
    friends_only: 'Invited participants only',
    public: 'Public'
  }

  return labels[value] || value
}

export const formatParticipantJoinMode = (value: string) => {
  const labels: Record<string, string> = {
    open: 'Open',
    approval_required: 'Approval required',
    invite_only: 'Invite only'
  }

  return labels[value] || value
}

export const formatSecretAssignmentMode = (value: string) => {
  const labels: Record<string, string> = {
    disabled: 'Disabled',
    random_assignment: 'Random assignment',
    manual_assignment: 'Manual assignment'
  }

  return labels[value] || value
}

export const formatGiftReservationSetting = (value: string) => {
  const labels: Record<string, string> = {
    enabled: 'Enabled',
    disabled: 'Disabled'
  }

  return labels[value] || value
}

export const formatGiftStatusVisibility = (value: string) => {
  const labels: Record<string, string> = {
    full: 'Full',
    partial: 'Partial',
    hidden: 'Hidden'
  }

  return labels[value] || value
}

export const formatParticipantStatus = (value: string) => {
  const labels: Record<string, string> = {
    invited: 'Invited',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected'
  }

  return labels[value] || value
}
