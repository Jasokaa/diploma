create or replace function public.respond_to_wishlist_invitation(
  target_wishlist_id uuid,
  next_status text
)
returns public.wishlist_participants
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_row public.wishlist_participants;
begin
  if next_status not in ('approved', 'rejected') then
    raise exception 'Unsupported invitation response status: %', next_status;
  end if;

  update public.wishlist_participants
  set
    status = next_status,
    updated_at = now()
  where wishlist_id = target_wishlist_id
    and user_id = auth.uid()
    and status = 'invited'
  returning *
  into updated_row;

  if updated_row.id is null then
    raise exception 'Invitation not found or cannot be updated';
  end if;

  return updated_row;
end;
$$;

revoke all on function public.respond_to_wishlist_invitation(uuid, text) from public;
grant execute on function public.respond_to_wishlist_invitation(uuid, text) to authenticated;
