-- # Create Entrepreneur AI System Database Schema
--
-- ## Overview
-- This migration creates the database structure for LOUA IA, an AI assistant designed to help 
-- entrepreneurs in Guinea solve business problems through technical data analysis.
--
-- ## New Tables
--
-- ### 1. entrepreneurs
-- Stores entrepreneur profile information
-- - id (uuid, primary key) - Unique identifier, linked to auth.users
-- - email (text) - User email address
-- - full_name (text) - Entrepreneur's full name
-- - business_name (text) - Name of their business
-- - business_sector (text) - Industry/sector of business
-- - business_description (text) - Brief description of business
-- - created_at (timestamptz) - Account creation timestamp
-- - updated_at (timestamptz) - Last update timestamp
--
-- ### 2. business_analyses
-- Stores AI analysis requests and results
-- - id (uuid, primary key) - Unique identifier
-- - entrepreneur_id (uuid, foreign key) - References entrepreneurs table
-- - analysis_type (text) - Type of analysis (market, financial, operational, strategic)
-- - business_data (jsonb) - Technical business data provided by entrepreneur
-- - analysis_result (jsonb) - AI-generated analysis and recommendations
-- - status (text) - Analysis status (pending, processing, completed, failed)
-- - created_at (timestamptz) - Request creation timestamp
-- - completed_at (timestamptz) - Analysis completion timestamp
--
-- ### 3. ai_conversations
-- Stores conversation history between entrepreneurs and AI
-- - id (uuid, primary key) - Unique identifier
-- - entrepreneur_id (uuid, foreign key) - References entrepreneurs table
-- - message (text) - Message content
-- - is_ai_response (boolean) - True if message is from AI, false if from user
-- - created_at (timestamptz) - Message timestamp
--
-- ## Security
-- - Row Level Security (RLS) enabled on all tables
-- - Entrepreneurs can only access their own data
-- - Authenticated users required for all operations
-- - Policies enforce data isolation between users
--
-- ## Important Notes
-- 1. All timestamps use timestamptz for proper timezone handling
-- 2. JSONB used for flexible data storage of business metrics and analysis results
-- 3. Foreign key constraints ensure data integrity
-- 4. Indexes added for common query patterns

-- Create entrepreneurs table
CREATE TABLE IF NOT EXISTS entrepreneurs (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  business_name text,
  business_sector text,
  business_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create business_analyses table
CREATE TABLE IF NOT EXISTS business_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entrepreneur_id uuid NOT NULL REFERENCES entrepreneurs(id) ON DELETE CASCADE,
  analysis_type text NOT NULL,
  business_data jsonb NOT NULL DEFAULT '{}',
  analysis_result jsonb DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create ai_conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entrepreneur_id uuid NOT NULL REFERENCES entrepreneurs(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_ai_response boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE entrepreneurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for entrepreneurs table
CREATE POLICY "Users can view own profile"
  ON entrepreneurs FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON entrepreneurs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON entrepreneurs FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for business_analyses table
CREATE POLICY "Users can view own analyses"
  ON business_analyses FOR SELECT
  TO authenticated
  USING (entrepreneur_id = auth.uid());

CREATE POLICY "Users can create own analyses"
  ON business_analyses FOR INSERT
  TO authenticated
  WITH CHECK (entrepreneur_id = auth.uid());

CREATE POLICY "Users can update own analyses"
  ON business_analyses FOR UPDATE
  TO authenticated
  USING (entrepreneur_id = auth.uid())
  WITH CHECK (entrepreneur_id = auth.uid());

CREATE POLICY "Users can delete own analyses"
  ON business_analyses FOR DELETE
  TO authenticated
  USING (entrepreneur_id = auth.uid());

-- RLS Policies for ai_conversations table
CREATE POLICY "Users can view own conversations"
  ON ai_conversations FOR SELECT
  TO authenticated
  USING (entrepreneur_id = auth.uid());

CREATE POLICY "Users can create own conversations"
  ON ai_conversations FOR INSERT
  TO authenticated
  WITH CHECK (entrepreneur_id = auth.uid());

CREATE POLICY "Users can delete own conversations"
  ON ai_conversations FOR DELETE
  TO authenticated
  USING (entrepreneur_id = auth.uid());

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_business_analyses_entrepreneur_id ON business_analyses(entrepreneur_id);
CREATE INDEX IF NOT EXISTS idx_business_analyses_status ON business_analyses(status);
CREATE INDEX IF NOT EXISTS idx_business_analyses_created_at ON business_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_entrepreneur_id ON ai_conversations(entrepreneur_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created_at ON ai_conversations(created_at DESC);
