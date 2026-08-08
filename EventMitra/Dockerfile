FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
RUN addgroup --system eventmitra && adduser --system --ingroup eventmitra eventmitra

COPY --from=build /app/target/*.jar app.jar
RUN mkdir -p /app/uploads/events && chown -R eventmitra:eventmitra /app

USER eventmitra
EXPOSE 8080

ENV SERVER_PORT=8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
