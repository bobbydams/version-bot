FROM node:14-alpine

# ENV DIRECTORY="/src"

COPY package.json yarn.lock /version_app/

WORKDIR /version_app/

RUN apk update && \
    apk upgrade && \
    apk add git && \
    yarn install

COPY bin/index.js /version_app/

ENTRYPOINT [ "node", "/version_app/index.js", "set-version"]