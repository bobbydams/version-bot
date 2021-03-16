FROM node:14-alpine

# ENV DIRECTORY="/scr/"

COPY package.json yarn.lock /version_app/

WORKDIR /version_app/

RUN apk update && \
    apk upgrade && \
    apk add git && \
    yarn install

COPY bin/ /version_app/

ENTRYPOINT [ "node", "/version_app/bin/index.js", "create-release"]