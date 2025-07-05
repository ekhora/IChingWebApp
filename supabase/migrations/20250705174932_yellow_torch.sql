/*
  # I Ching Divinations Database Schema

  1. New Tables
    - `divinations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `hexagram_number` (integer, 1-64)
      - `hexagram_name` (text)
      - `hexagram_binary` (text, 6-digit binary representation)
      - `interpretation` (text)
      - `question` (text, optional user question)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `divinations` table
    - Add policy for users to read their own divinations
    - Add policy for users to insert their own divinations
*/

CREATE TABLE IF NOT EXISTS divinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hexagram_number integer NOT NULL CHECK (hexagram_number >= 1 AND hexagram_number <= 64),
  hexagram_name text NOT NULL,
  hexagram_binary text NOT NULL,
  interpretation text NOT NULL,
  question text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE divinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own divinations"
  ON divinations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own divinations"
  ON divinations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_divinations_user_id ON divinations(user_id);
CREATE INDEX idx_divinations_created_at ON divinations(created_at DESC);