# TODO check https://chemidy.medium.com/create-the-smallest-and-secured-golang-docker-image-based-on-scratch-4752223b7324

FROM golang:1.20 AS build

WORKDIR /go/src/app

COPY go.mod go.sum /go/src/app/
RUN go mod download

COPY . /go/src/app/
#RUN CGO_ENABLED=0 go build -ldflags '-w -s' -o /app main.go
RUN CGO_ENABLED=0 go build -o /app main.go

FROM gcr.io/distroless/base AS runtime

WORKDIR app
COPY --from=build /app /usr/local/bin/
ENTRYPOINT ["/usr/local/bin/app"]
