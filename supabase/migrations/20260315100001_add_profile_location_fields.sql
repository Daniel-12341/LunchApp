-- Migration: Add location fields to profiles table
-- Plan: 02-01 (Name Selector - Data Foundation)
-- Adds 5 new nullable columns for map display and fun labels.

alter table public.profiles
  add column if not exists location_name text,
  add column if not exists lat           double precision,
  add column if not exists lng           double precision,
  add column if not exists emoji         text,
  add column if not exists fun_label     text;
