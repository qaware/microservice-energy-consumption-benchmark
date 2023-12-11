# cache dependencies
FROM gradle:jdk21-alpine AS cache
WORKDIR /code
COPY gradlew .
COPY build.gradle gradle.properties settings.gradle ./
ENV GRADLE_USER_HOME /cache
RUN gradle build --no-daemon --stacktrace

# build app
FROM  gradle:jdk21-alpine AS builder
WORKDIR /code
COPY --from=cache /cache /home/gradle/.gradle
COPY . $BUILD_HOME/
COPY build.gradle gradle.properties settings.gradle lombok.config ./
COPY src/ /code/src
RUN gradle --no-daemon clean assemble --stacktrace

CMD ["java", "-jar", "build/quarkus-app/quarkus-run.jar", "-Dquarkus.http.host=0.0.0.0"]
