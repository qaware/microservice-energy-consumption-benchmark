INSERT INTO nest.items(id, user_id, title, description, status, color, iteration, updated_at)
SELECT 'item-id-' || (i::text),
       'user-' || lpad((i % 10)::text, 2, '0'),
       'title ' || (i::text),
       array_to_string(ARRAY(SELECT substring('abcdefghijklmnopqrstuvwxyz               ', round(random() * 40)::integer, 1) FROM generate_series(1, greatest(i % 503, i % 701))), ''),
       CASE WHEN i % 3 = 0 THEN 'SUCCESS' WHEN i % 3 = 1 THEN 'WARNING' ELSE 'FAILURE' END,
       CASE WHEN i % 3 = 0 THEN 'GREEN' WHEN i % 3 = 1 THEN 'YELLOW' ELSE 'RED' END,
       i % 5,
       date '2023-11-13' + time '14:50' - make_interval(mins := i * 3)
FROM generate_series(1000, 6000) as t(i);

INSERT INTO nest.previews(id, item_id, data, created_at)
SELECT 'preview-id-' || (i::text),
       'item-id-' || ((i / 3)::text),
       encode(sha512((random()::text)::bytea) || sha512((random()::text)::bytea) || sha512((random()::text)::bytea) ||
              sha512((random()::text)::bytea), 'base64'),
       date '2023-11-13' + time '14:50' - make_interval(mins := i)
FROM generate_series(3000, 18000) as t(i);
