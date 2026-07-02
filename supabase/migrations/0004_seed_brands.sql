-- Seed the 4 known brands in the Toonetic product family.
-- Toonetic gets real brand data (documented in toonetic/docs/AMOS-VISION-SPEC.md + project memory).
-- The other 3 get minimal seed — expand as each brand gets dogfooded through AI Marketing Team.

insert into brands (slug, name, business_type, website_url, brand_identity, brand_voice, target_audience, marketing_goals, seo_keywords, social_accounts) values
(
  'toonetic',
  'Toonetic AMOS',
  'SaaS / ระบบการตลาด AI',
  'https://www.toonetic.com',
  '{
    "mission": "ทำให้เจ้าของธุรกิจไทยทุกคนมีทีมการตลาด AI เป็นของตัวเอง แม้จะไม่มีงบจ้างทีมการตลาดมืออาชีพ",
    "values": ["ช่วยคิด ไม่ตัดสินใจแทน", "AI Operating System ไม่ใช่แค่ Content Tool"],
    "visual_style": "dark theme, gold (#f5a623) accent, Apple/OpenAI/Stripe-inspired premium SaaS aesthetic",
    "logo_url": null
  }'::jsonb,
  '{
    "tone": "professional, empowering, confident — พูดกับเจ้าของธุรกิจ SME ไทยเหมือนที่ปรึกษาที่เข้าใจปัญหาจริง",
    "vocabulary_dos": ["ทีมการตลาด AI", "24/7", "AI Marketing Operating System", "Limitless Business. Connected."],
    "vocabulary_donts": ["รับประกันยอดขาย", "ตัดสินใจแทนเจ้าของธุรกิจ"],
    "sample_phrases": ["AMOS — Your AI Marketing Team. 24/7. Limitless Business. Connected."]
  }'::jsonb,
  '{
    "personas": [
      {"name": "เจ้าของธุรกิจ SME ไทย", "demographics": "อายุ 25-45, ทำธุรกิจออนไลน์/ออฟไลน์ ไม่มีทีมการตลาด", "pain_points": ["ไม่มีเวลาคิดคอนเทนต์", "ไม่มีงบจ้างทีมการตลาด", "ไม่รู้จะวางแผนการตลาดยังไง"], "goals": ["เพิ่มยอดขาย", "สร้าง brand awareness", "ประหยัดเวลา"]}
    ]
  }'::jsonb,
  '{"primary_goal": "ช่วย SME ไทยทำการตลาดได้อย่างมืออาชีพโดยไม่ต้องมีทีม", "kpis": ["MAU", "content generated per user", "retention"], "timeframe": "ongoing"}'::jsonb,
  array['AI การตลาด', 'ระบบการตลาดออนไลน์', 'SME ไทย', 'AI Marketing Operating System'],
  '{"website": {"url": "https://www.toonetic.com"}}'::jsonb
),
(
  'atlas-office',
  'ATLAS Office',
  'Windows Productivity SaaS',
  'https://office.toonetic.com',
  '{
    "mission": "The AI Productivity Operating System",
    "values": [],
    "visual_style": "light-first, follow Windows theme, semantic design tokens",
    "logo_url": null
  }'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  array[]::text[],
  '{}'::jsonb
),
(
  'atlas-guardian',
  'ATLAS Guardian',
  'Windows System Protection SaaS',
  'https://guardian.toonetic.com',
  '{
    "mission": "The AI System Protection Operating System",
    "values": [],
    "visual_style": "light-first, follow Windows theme, semantic design tokens",
    "logo_url": null
  }'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  array[]::text[],
  '{}'::jsonb
),
(
  'usaxresearch',
  'USAXresearch',
  null,
  null,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  array[]::text[],
  '{}'::jsonb
);
