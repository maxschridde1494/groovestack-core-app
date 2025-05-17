###################################################
# Stage 1: Base Ruby Image
# 
# This stage serves as the foundation for all subsequent stages, providing:
# - A consistent Ruby runtime environment (3.1.4)
# - Essential system dependencies for building and running Ruby applications
# - Common configuration settings used across all stages
###################################################
# Make sure RUBY_VERSION matches the Ruby version in .ruby-version and Gemfile
ARG RUBY_VERSION=3.1.4
# https://hub.docker.com/_/ruby/tags?name=3.1.4
# https://hub.docker.com/layers/library/ruby/3.1.4-slim/images/sha256-f8fef2e091480e0d5e091a77ce5b4b6e0619c351e084c5ce73f265e68265c7ac
FROM registry.docker.com/library/ruby:$RUBY_VERSION-slim AS ruby-base
ENV RUBY_VERSION=$RUBY_VERSION

# Install system dependencies
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
        && apt-get -y install --no-install-recommends \
        git \
        curl \
        make \
        build-essential \
        libpq-dev \
        && rm -rf /var/lib/apt/lists/*

# ===============================================
# Stage 2: ASDF Version Manager Builder
# 
# This stage builds the ASDF version manager (v0.16.0) using Go:
# - Uses a minimal Go image to build the ASDF CLI
# - Compiles ASDF from source to ensure version compatibility
# - Keeps Go build dependencies separate from the final image
# ===============================================
FROM golang:1.23.4-bullseye AS asdf-v16-builder

RUN apt-get update && apt-get install -y --no-install-recommends \
        git \
        curl \
        make \
        ca-certificates \
        && rm -rf /var/lib/apt/lists/*

# Build asdf Go CLI
RUN git clone https://github.com/asdf-vm/asdf.git /tmp/asdf --branch v0.16.0 && \
    cd /tmp/asdf && \
    make

# ===============================================
# Stage 3: Ruby and Node.js Base Image
# 
# This stage sets up the core development environment with:
# - Ruby and Node.js managed via ASDF for version control
# - Node.js 22.10.0 for modern JavaScript development
# - ASDF plugins and global version configurations
# - Proper PATH setup for ASDF-managed tools
# ===============================================

FROM ruby-base AS ruby-node-asdf-base
ENV NODE_VERSION=22.10.0

# ensure we use bash for all RUN commands
SHELL ["/bin/bash", "-c"]


# ===== Port in Go-based asdf binary =====
COPY --from=asdf-v16-builder /tmp/asdf /root/.asdf
ENV PATH="/root/.asdf:/root/.asdf/bin:/root/.asdf/shims:$PATH"

# validate asdf is installed
RUN type -a asdf && asdf --version

# install asdf plugins
RUN asdf plugin add ruby && \
        asdf plugin add nodejs

# install asdf versions
RUN asdf install ruby $RUBY_VERSION && \
        asdf install nodejs $NODE_VERSION

# set global versions
RUN asdf global ruby $RUBY_VERSION && \
        asdf global nodejs $NODE_VERSION

###################################################
# Stage 4: Groovestack Core Application Base
# 
# This stage prepares the application environment with:
# - All necessary development tools (pnpm, taskfile)
# - Rails and its dependencies
# - Application-specific gems and npm packages
# - Proper working directory and port configurations
# - Exposed ports: 3000 (Rails) and 5173 (Vite)
###################################################

FROM ruby-node-asdf-base AS groovestack-core-base
WORKDIR /usr/local/groovestack-core-app

# Setup an app user so the container doesn't run as the root user
# RUN useradd app
# USER app

# asdf tool versions
COPY .tool-versions .

# Install pnpm & taskfile
RUN npm install -g @pnpm/exe@latest-10 && \
    npm install -g @go-task/cli

# Install Rails dependencies
RUN gem install rails bundler webdrivers foreman

# Copy Gemfiles and install gems
COPY Gemfile* ./
RUN bundle install

# Copy package.json and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy the rest of the app
COPY . .

# Expose ports for Rails (3000) and Vite (5173 & 3036)
EXPOSE 3000 5173 3036

###################################################
# Stage 5: Groovestack Core Development Environment
# 
# This is the final development stage that:
# - Inherits all configurations from the base application
# - Sets up the development-specific environment
# - Configures the default command to run the development server
# - Ready for local development and testing
###################################################

FROM groovestack-core-base AS groovestack-core-dev
# start rails app

# this is for docker. point smtp host to mailhog service
ENV RAILS_ENV=development
ENV NODE_ENV=development
ENV SMTP_HOST=mailhog

# TODO:
# - IMPL puma-dev .test domains
# - IMPL https
# - FIX vite dev server GET http://localhost:3036/vite-dev/ net::ERR_CONNECTION_RESET