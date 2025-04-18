ARG NODE_VERSION=20
ARG ALPINE_VERSION=3.19

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS node-base

FROM node-base AS node-dev

RUN mkdir -p /node/app

WORKDIR /node/app

RUN apk add --no-cache --update python3 make g++ git

ENTRYPOINT ["tail", "-f", "/dev/null"]
