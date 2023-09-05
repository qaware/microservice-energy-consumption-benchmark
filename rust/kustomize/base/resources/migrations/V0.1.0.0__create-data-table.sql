CREATE TABLE IF NOT EXISTS public.data
(
    id          TEXT PRIMARY KEY,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    count       BIGINT    NOT NULL DEFAULT 0,
    description TEXT      NOT NULL
)
