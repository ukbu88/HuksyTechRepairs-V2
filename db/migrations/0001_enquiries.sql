-- Husky Tech Repairs — enquiries table (Neon Postgres).
-- Run once against the production database (see docs/DEPLOY.md):
--   psql "$DATABASE_URL" -f db/migrations/0001_enquiries.sql
--
-- The case reference is issued by the database on insert: HUS- plus six digits,
-- from a sequence, so two concurrent inserts can never share a reference.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SEQUENCE IF NOT EXISTS enquiry_reference_seq
  AS integer
  START WITH 1001
  INCREMENT BY 1
  MINVALUE 1001
  MAXVALUE 999999
  NO CYCLE;

CREATE TABLE IF NOT EXISTS enquiries (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  reference          text        NOT NULL UNIQUE
                                 DEFAULT ('HUS-' || lpad(nextval('enquiry_reference_seq')::text, 6, '0')),
  created_at         timestamptz NOT NULL DEFAULT now(),

  intent             text        NOT NULL,
  device_category    text        NOT NULL,
  brand              text,
  model              text,
  model_unknown      boolean     NOT NULL DEFAULT false,
  symptoms           text[]      NOT NULL DEFAULT '{}',
  description        text        NOT NULL,
  prior_repair       text        NOT NULL,
  prior_repair_notes text,
  logistics          text        NOT NULL,
  suburb             text,

  contact_name       text        NOT NULL,
  contact_email      text        NOT NULL,
  contact_phone      text,
  consent            boolean     NOT NULL,

  status             text        NOT NULL DEFAULT 'submitted',
  notified_at        timestamptz,
  notification_error text,
  meta               jsonb       NOT NULL DEFAULT '{}'::jsonb,

  CONSTRAINT enquiries_reference_format CHECK (reference ~ '^HUS-[0-9]{6}$'),
  CONSTRAINT enquiries_consent_given CHECK (consent = true)
);

CREATE INDEX IF NOT EXISTS enquiries_created_at_idx ON enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS enquiries_contact_email_idx ON enquiries (lower(contact_email));
