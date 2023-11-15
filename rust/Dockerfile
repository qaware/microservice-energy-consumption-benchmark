FROM lukemathwalker/cargo-chef:latest-rust-1 AS chef
WORKDIR /app

FROM chef AS planner
COPY Cargo.lock .
COPY Cargo.toml .
COPY src/ /app/src
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
# Build dependencies - this is the caching Docker layer!
RUN cargo chef cook --release --recipe-path recipe.json
# Build application
COPY Cargo.lock .
COPY Cargo.toml .
COPY src/ /app/src
RUN cargo build --release --bin app

# The final container image is based on a ready-made "distro-less" image.
FROM gcr.io/distroless/cc-debian12 AS runtime

# Provide default values for language and locale.
ENV LANG=en_US.UTF-8 LANGUAGE=en_US:en LC_ALL=en_US.UTF-8

# Copy the application.
COPY --from=builder /app/target/release/app /usr/local/bin/

# Use an unprivileged user for executing processes in the container.
USER nonroot
WORKDIR /home/nonroot

ENTRYPOINT ["/usr/local/bin/app"]
