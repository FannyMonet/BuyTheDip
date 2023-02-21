FROM node:16-slim as builder

WORKDIR /home/build

COPY package.json .
COPY yarn.lock .
RUN yarn

COPY public ./public
COPY src ./src
COPY tsconfig.json .
RUN yarn build

FROM node:16-slim as runner

WORKDIR /home/app

COPY --from=builder /home/build ./

COPY package.json .
COPY yarn.lock .

RUN yarn install --production
RUN yarn global add serve

EXPOSE 3000

ENTRYPOINT ["npm", "run", "serve"]