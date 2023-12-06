CREATE TABLE IF NOT EXISTS spring.items
(
    id          TEXT PRIMARY KEY,
    user_id     TEXT      NOT NULL,
    title       TEXT      NOT NULL,
    description TEXT      NOT NULL,
    status      TEXT      NOT NULL,
    color       TEXT      NOT NULL,
    iteration  BIGINT    NOT NULL,
    updated_at  TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS spring.previews
(
    id         TEXT PRIMARY KEY,
    item_id    TEXT REFERENCES items (id),
    data       TEXT NOT NULL,
    created_at TIMESTAMP
)
