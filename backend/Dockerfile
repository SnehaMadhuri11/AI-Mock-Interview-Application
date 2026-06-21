# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and package (skip tests for faster builds)
COPY src ./src
RUN mvn package -B -DskipTests

# Stage 2: Run
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
