FROM maven:3.8.7-openjdk-17 AS build
WORKDIR /app
COPY pom.xml ./
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

FROM gcr.io/distroless/java21-debian12
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
