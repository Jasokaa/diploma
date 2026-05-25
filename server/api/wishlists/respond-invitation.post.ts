import { createClient } from '@supabase/supabase-js'

type InvitationResponseBody = {
  wishlistId?: string
  status?: 'approved' | 'rejected'
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const authorization = getHeader(event, 'authorization')

  if (!authorization?.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: {
        message: 'Missing authorization token.'
      }
    })
  }

  const accessToken = authorization.slice('Bearer '.length).trim()

  if (!accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: {
        message: 'Missing authorization token.'
      }
    })
  }

  const body = await readBody<InvitationResponseBody>(event)

  if (!body.wishlistId || !body.status) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message: 'Wishlist ID and invitation status are required.'
      }
    })
  }

  if (!['approved', 'rejected'].includes(body.status)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message: 'Unsupported invitation response.'
      }
    })
  }

  const userClient = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey)
  const {
    data: { user },
    error: authError
  } = await userClient.auth.getUser(accessToken)

  if (authError || !user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: {
        message: 'Could not verify your session.'
      }
    })
  }

  if (!config.supabaseServiceRoleKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Configuration Error',
      data: {
        message: 'Missing Supabase service role configuration.'
      }
    })
  }

  const adminClient = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey)
  const participantResponse = await adminClient
    .from('wishlist_participants')
    .select('*')
    .eq('wishlist_id', body.wishlistId)
    .eq('user_id', user.id)
    .eq('status', 'invited')
    .maybeSingle()

  if (participantResponse.error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Database Error',
      data: {
        message: participantResponse.error.message
      }
    })
  }

  if (!participantResponse.data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      data: {
        message: 'Invitation not found or has already been processed.'
      }
    })
  }

  const updateResponse = await adminClient
    .from('wishlist_participants')
    .update({
      status: body.status,
      updated_at: new Date().toISOString()
    })
    .eq('id', participantResponse.data.id)
    .select('*')
    .single()

  if (updateResponse.error || !updateResponse.data) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Database Error',
      data: {
        message: updateResponse.error?.message || 'Failed to update the invitation.'
      }
    })
  }

  return updateResponse.data
})
