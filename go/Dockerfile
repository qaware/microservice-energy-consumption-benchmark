FROM golang:1.21 AS build

WORKDIR /go/src/app

COPY go.mod go.sum /go/src/app/
RUN go mod download

COPY . /go/src/app/
#RUN CGO_ENABLED=0 go build -ldflags '-w -s' -o /app main.go
RUN CGO_ENABLED=0 go build -o /app ./cmd/app/

# The final container image is based on a ready-made "distro-less" image.
FROM gcr.io/distroless/static-debian12 AS runtime

# Provide default values for language and locale.
ENV LANG=en_US.UTF-8 LANGUAGE=en_US:en LC_ALL=en_US.UTF-8

# Copy the application.
COPY --from=build /app /usr/local/bin/

# Use an unprivileged user for executing processes in the container.
USER nonroot
WORKDIR /home/nonroot

ENTRYPOINT ["/usr/local/bin/app"]
