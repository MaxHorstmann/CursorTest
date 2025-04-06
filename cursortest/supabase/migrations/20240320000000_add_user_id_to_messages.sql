-- First add the user_id column as nullable
ALTER TABLE messages
ADD COLUMN user_id TEXT;

-- Set default values for existing messages
UPDATE messages
SET user_id = 'anonymous-' || id,
    sender = 'user'
WHERE user_id IS NULL;

-- Now make the columns NOT NULL
ALTER TABLE messages
ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE messages
ALTER COLUMN sender SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE messages
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE; 