# Use an OpenJDK runtime as the base image
FROM amazoncorretto:21.0.1

# Set the working directory inside the container
WORKDIR /app

# Copy the JAR file from the local build context to the container
COPY target/spring-0.0.1-SNAPSHOT.jar /app/app.jar

# Expose the port that the Spring Boot application will run on
EXPOSE 8080

# Specify the command to run the application when the container starts
CMD ["java", "-jar", "app.jar"]