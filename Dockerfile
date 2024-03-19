FROM node:20.11.1-alpine3.19 AS base

ENV DIR /task-flow-api
WORKDIR ${DIR}
RUN corepack enable
ARG NPM_TOKEN

FROM base AS build

RUN apk update && apk add --no-cache dumb-init

COPY package.json ${DIR}
COPY pnpm-lock.yaml ${DIR}

RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > "${DIR}/.npmrc" && \
    pnpm install --frozen-lockfile && \
    rm -f .npmrc

COPY tsconfig*.json ${DIR}
COPY .swcrc ${DIR}
COPY nest-cli.json ${DIR}
COPY src ${DIR}/src

RUN pnpm build && \
    pnpm prune --prod

FROM base AS production

ENV USER=node

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=build ${DIR}/node_modules ${DIR}/node_modules
COPY --from=build ${DIR}/dist ${DIR}/dist

ENV NODE_ENV=production
EXPOSE ${PORT}
USER ${USER}

CMD ["dumb-init", "node", "dist/main.js"]
