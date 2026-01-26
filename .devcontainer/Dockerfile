FROM node:20-bookworm-slim

# Install git + minimal tooling, keep image small
RUN apt-get update \
 && apt-get install -y --no-install-recommends git ca-certificates openssh-client \
 && rm -rf /var/lib/apt/lists/*

# (optional) set a default working directory
WORKDIR /app
