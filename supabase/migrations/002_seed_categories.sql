-- 기본 카테고리 seed 데이터
INSERT INTO categories (name, color) VALUES
  ('업무', '#3b82f6'),
  ('개인', '#22c55e'),
  ('학습', '#a855f7'),
  ('건강', '#ef4444'),
  ('기타', '#6b7280')
ON CONFLICT (name) DO NOTHING;
