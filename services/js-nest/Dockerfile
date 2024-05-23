FROM node:20 AS build

RUN npm install --global @nestjs/cli
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
COPY . /app/
RUN nest build

# The final container image is based on a ready-made "distro-less" image.
FROM gcr.io/distroless/nodejs20-debian12

# Provide default values for language and locale.
ENV LANG=en_US.UTF-8 LANGUAGE=en_US:en LC_ALL=en_US.UTF-8

# Copy the application.
COPY --from=build /app /app

# Use an unprivileged user for executing processes in the container.
USER nonroot
WORKDIR /home/nonroot

CMD ["/app/dist/main"]
