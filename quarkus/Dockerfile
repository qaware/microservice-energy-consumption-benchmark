FROM azul/zulu-openjdk-debian:21-latest AS java

# Update the system to obtain the latest versions of dependencies.
RUN apt-get update && apt-get -y upgrade

# Install coreutils, required for sleep (we need it for the green metrics tool measurement setup)
RUN apt-get install coreutils

# Copy all required dependencies of Java into the target Java home folder.
RUN case `uname -m` in \
        x86_64) LINUX_ARCH=x86_64; JAVA_ARCH=amd64 ;; \
        aarch64) LINUX_ARCH=aarch64 ; JAVA_ARCH=arm64 ;; \
        *) echo "unsupported architecture, exiting ..."; exit 1; ;; \
    esac \
  && mkdir -p /opt/java \
  && cp -r /usr/lib/jvm/zulu21/* /opt/java \
  && cp /lib/${LINUX_ARCH}-linux-gnu/libz.* /opt/java/lib/

# The application is built from its artifacts.
COPY gradle /app/gradle
COPY build.gradle gradlew gradle.properties lombok.config settings.gradle /app/
COPY src/main/java /app/src/main/java
COPY src/main/resources /app/src/main/resources
WORKDIR /app
RUN /app/gradlew assemble

# The final container image is based on a ready-made "distro-less" image.
FROM gcr.io/distroless/base-debian12

# Provide default values for language and locale.
ENV LANG=en_US.UTF-8 LANGUAGE=en_US:en LC_ALL=en_US.UTF-8

# Copy Java and its dependencies from the Java container image.
ENV JAVA_HOME=/opt/java PATH="/opt/java/bin/:${PATH}"
COPY --from=java /opt/java /opt/java

# Copy the application.
COPY --from=java /app/build/quarkus-app/lib/boot/* /app/lib/boot/
COPY --from=java /app/build/quarkus-app/lib/main/* /app/lib/main/
COPY --from=java /app/build/quarkus-app/quarkus/* /app/quarkus/
COPY --from=java /app/build/quarkus-app/quarkus-*.* /app/
COPY --from=java /app/build/quarkus-app/app/* /app/app/

# Use an unprivileged user for executing processes in the container.
USER nonroot
WORKDIR /home/nonroot

ENTRYPOINT [ "/opt/java/bin/java", "-jar", "/app/quarkus-run.jar" ]
