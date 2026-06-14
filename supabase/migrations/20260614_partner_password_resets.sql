create table if not exists partner_password_resets (
  id uuid default gen_random_uuid() primary key,
  partner_id uuid references partners(id) on delete cascade not null,
  email text not null,
  token_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz null,
  created_at timestamptz default now()
);

create index if not exists partner_password_resets_token_hash_idx on partner_password_resets(token_hash);
create index if not exists partner_password_resets_partner_id_idx on partner_password_resets(partner_id);
