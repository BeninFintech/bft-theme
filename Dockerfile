ARG KEYCLOAK_VERSION=latest

# Stage 1: Build Keycloak theme JAR
FROM node:18-alpine AS keycloakify_jar_builder

# Install JDK and Maven
RUN apk update && \
    apk add --no-cache openjdk17-jdk maven

# Install dependencies first for better layer caching
WORKDIR /opt/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source and build
COPY . .
RUN yarn build-keycloak-theme

# Stage 2: Build Keycloak server with the theme
FROM quay.io/keycloak/keycloak:${KEYCLOAK_VERSION} AS builder

# Copy theme JAR
COPY --from=keycloakify_jar_builder /opt/app/dist_keycloak/*.jar /opt/keycloak/providers/

# Build server
RUN /opt/keycloak/bin/kc.sh build

# Stage 3: Final image using slim variant
FROM quay.io/keycloak/keycloak:${KEYCLOAK_VERSION}

# Copy built server from builder
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Use recommended production entrypoint
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
