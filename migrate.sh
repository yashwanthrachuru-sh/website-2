#!/bin/bash
# EduNet Database Migration Script
# Run from project root: bash migrate.sh

MYSQL_CMD="mysql -u root -pMyRoot@2026#Strong1 edunet"

echo "=== EduNet DB Migration ==="

# Function to add column if it doesn't exist
add_column_if_missing() {
  local table=$1
  local column=$2
  local definition=$3
  local after=$4
  
  exists=$($MYSQL_CMD -e "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='edunet' AND TABLE_NAME='$table' AND COLUMN_NAME='$column';" 2>/dev/null | tail -1)
  
  if [ "$exists" -eq "0" ]; then
    echo "  Adding column: $table.$column"
    $MYSQL_CMD -e "ALTER TABLE $table ADD COLUMN $column $definition AFTER $after;" 2>&1
  else
    echo "  Column exists: $table.$column (skip)"
  fi
}

# Add missing video columns
add_column_if_missing "videos" "video_id" "VARCHAR(20) NULL" "youtube_url"
add_column_if_missing "videos" "embed_url" "VARCHAR(500) NULL" "video_id"
add_column_if_missing "videos" "tags" "TEXT NULL" "category"
add_column_if_missing "videos" "instructor" "VARCHAR(200) NULL" "tags"
add_column_if_missing "videos" "duration" "VARCHAR(50) NULL" "instructor"

# Backfill video_id from youtube_url
echo "  Backfilling video_id from youtube_url..."
$MYSQL_CMD -e "
UPDATE videos 
SET video_id = (
  CASE 
    WHEN youtube_url LIKE '%watch?v=%' THEN SUBSTRING(youtube_url, LOCATE('v=', youtube_url)+2, 11)
    WHEN youtube_url LIKE '%youtu.be/%' THEN SUBSTRING(youtube_url, LOCATE('youtu.be/', youtube_url)+9, 11)
    ELSE NULL
  END
),
embed_url = CONCAT('https://www.youtube.com/embed/', CASE 
    WHEN youtube_url LIKE '%watch?v=%' THEN SUBSTRING(youtube_url, LOCATE('v=', youtube_url)+2, 11)
    WHEN youtube_url LIKE '%youtu.be/%' THEN SUBSTRING(youtube_url, LOCATE('youtu.be/', youtube_url)+9, 11)
    ELSE ''
  END)
WHERE video_id IS NULL OR video_id = '';
" 2>&1

# Create indexes
echo "  Creating indexes..."
$MYSQL_CMD -e "CREATE INDEX idx_videos_category ON videos(category);" 2>/dev/null && echo "  Created idx_videos_category" || echo "  Index idx_videos_category already exists"
$MYSQL_CMD -e "CREATE INDEX idx_videos_status ON videos(status);" 2>/dev/null && echo "  Created idx_videos_status" || echo "  Index idx_videos_status already exists"
$MYSQL_CMD -e "CREATE INDEX idx_videos_pinned ON videos(pinned);" 2>/dev/null && echo "  Created idx_videos_pinned" || echo "  Index idx_videos_pinned already exists"

echo ""
echo "=== Final videos table schema ==="
$MYSQL_CMD -e "DESCRIBE videos;" 2>/dev/null

echo ""
echo "=== Migration complete! ==="
