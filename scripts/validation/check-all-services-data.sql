-- Check all 4 active services data
SELECT
  id,
  title,
  slug,
  status,
  image_url IS NOT NULL as has_image,
  jsonb_array_length(images) as image_count,
  jsonb_array_length(features) as feature_count,
  LEFT(description, 50) || '...' as description_preview
FROM services
WHERE slug IN ('mvp', 'fullstack', 'design', 'operations')
ORDER BY
  CASE slug
    WHEN 'mvp' THEN 1
    WHEN 'fullstack' THEN 2
    WHEN 'design' THEN 3
    WHEN 'operations' THEN 4
  END;
