FROM node:18-slim as builder

WORKDIR /home/node

COPY package.json .
COPY yarn.lock .
RUN yarn

COPY schema.prisma .
RUN yarn prisma generate

COPY src ./src
COPY tsconfig.json .
RUN yarn build

COPY migrations ./migrations
RUN yarn prisma migrate

FROM node:18-slim as runner

WORKDIR /home/server

COPY --from=builder /home/node/dist/src ./dist
COPY schema.prisma .

COPY package.json .
COPY yarn.lock .

RUN yarn install --production
RUN yarn prisma generate


EXPOSE 8080

ENTRYPOINT ["yarn", "start"]