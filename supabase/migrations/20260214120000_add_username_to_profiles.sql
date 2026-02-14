-- Add username field to profiles table
ALTER TABLE profiles 
ADD username NVARCHAR(255) UNIQUE;

-- Create an index on username for faster lookups
CREATE INDEX idx_profiles_username ON profiles(username);
