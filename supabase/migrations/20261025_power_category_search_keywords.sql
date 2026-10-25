-- 1. Search keywords: admin-entered, comma-separated aliases used by web search and the chatbot
--    e.g. "шилэн наалт, дэлгэц хамгаалагч" for "STARTRC RC2 Screen Protector"
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_keywords text;

-- 2. New "Power" category
INSERT INTO categories (name, slug)
VALUES ('Power', 'power')
ON CONFLICT (slug) DO NOTHING;

-- 3. Move DJI POWER stations (currently filed under "Дрон") into Power
UPDATE products
SET category_id = (SELECT id FROM categories WHERE slug = 'power')
WHERE name ILIKE 'DJI%POWER%';

-- 4. Starter keywords for the examples raised (admin can edit these afterwards)
UPDATE products SET search_keywords = 'шилэн наалт, дэлгэц хамгаалагч, дэлгэцний наалт, наалт'
WHERE name ILIKE '%screen protector%' AND search_keywords IS NULL;

UPDATE products SET search_keywords = 'линз хамгаалагч, шилэн наалт, камерын наалт, наалт'
WHERE name ILIKE '%lens protector%' AND search_keywords IS NULL;

UPDATE products SET search_keywords = 'хатуу цүнх, хатуу хайрцаг, цүнх, хайрцаг'
WHERE name ILIKE '%hard%case%' AND search_keywords IS NULL;

UPDATE products SET search_keywords = 'цүнх, уут, хадгалах цүнх'
WHERE (name ILIKE '%carry%case%' OR name ILIKE '%storage bag%') AND name NOT ILIKE '%hard%' AND search_keywords IS NULL;

UPDATE products SET search_keywords = 'цахилгаан станц, зөөврийн цэнэг, power station, пауэр'
WHERE name ILIKE 'DJI%POWER%' AND search_keywords IS NULL;
