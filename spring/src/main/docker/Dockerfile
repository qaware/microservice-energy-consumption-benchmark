# Use an OpenJDK runtime as the base image
FROM azul/zulu-openjdk-debian:21-latest

# Set the working directory inside the container
WORKDIR /app

# Copy the JAR file from the local build context to the container
# In maven/ the files as specified in the <assembly> section is stored
# and need to be added manually
COPY maven/spring-*.jar /app/app.jar

# Expose the port that the Spring Boot application will run on
EXPOSE 8080

# Specify the command to run the application when the container starts
CMD ["java", "-jar", "app.jar"]