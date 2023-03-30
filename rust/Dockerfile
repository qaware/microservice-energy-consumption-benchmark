FROM lukemathwalker/cargo-chef:latest-rust-1 AS chef
WORKDIR app

FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json

# build all required dependencies
RUN cargo chef cook --release --recipe-path recipe.json
# RUN cargo chef cook --recipe-path recipe.json

# build the application
COPY . .
RUN cargo build --release --bin app
# RUN cargo build --bin app

FROM gcr.io/distroless/cc AS runtime

WORKDIR app
COPY --from=builder /app/target/release/app /usr/local/bin/
# COPY --from=builder /app/target/debug/app /usr/local/bin/
COPY Rocket.toml /app/
ENTRYPOINT ["/usr/local/bin/app"]
