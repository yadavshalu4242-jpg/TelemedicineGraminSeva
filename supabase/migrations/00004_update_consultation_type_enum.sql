-- Add new consultation types to the enum
ALTER TYPE consultation_type ADD VALUE IF NOT EXISTS 'chat';
ALTER TYPE consultation_type ADD VALUE IF NOT EXISTS 'in_person';