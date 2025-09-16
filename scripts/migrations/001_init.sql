-- Create minimal tables for signups, documents, audit
create table if not exists signups (
  id uuid primary key,
  created_at timestamptz not null default now(),
  status text not null default 'pending_payment', -- pending_payment|paid|active|cancelled
  plan text not null,                              -- 2c|4c
  billing text not null,                           -- monthly|annual
  full_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  nearest text not null default '',
  second_user_email text not null default '',
  upload_token text,
  upload_token_expires_at timestamptz,
  verification_status text not null default 'none', -- none|pending_review|verified|rejected
  notes text
);

create table if not exists documents (
  id uuid primary key,
  signup_id uuid not null references signups(id) on delete cascade,
  kind text not null, -- id|proof
  blob_url text not null,
  filename text not null,
  size_bytes bigint not null default 0,
  uploaded_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists audit_log (
  id uuid primary key,
  signup_id uuid not null references signups(id) on delete cascade,
  actor text not null, -- system|admin|user
  event text not null,
  meta jsonb,
  created_at timestamptz not null default now()
);
