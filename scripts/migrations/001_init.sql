create table if not exists signups (
  id uuid primary key,
  created_at timestamptz not null default now(),
  status text not null default 'pending_payment',
  plan text not null,
  billing text not null,
  full_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  nearest text not null default '',
  second_user_email text not null default '',
  upload_token text,
  upload_token_expires_at timestamptz,
  verification_status text not null default 'none',
  notes text
);

create table if not exists documents (
  id uuid primary key,
  signup_id uuid not null references signups(id) on delete cascade,
  kind text not null,
  blob_url text not null,
  filename text not null,
  size_bytes bigint not null default 0,
  uploaded_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists audit_log (
  id uuid primary key,
  signup_id uuid not null references signups(id) on delete cascade,
  actor text not null,
  event text not null,
  meta jsonb,
  created_at timestamptz not null default now()
);
