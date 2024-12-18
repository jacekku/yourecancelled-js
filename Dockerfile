FROM node:20-alpine AS dependencies

ENV NODE_ENV=build

WORKDIR /app 

COPY package.json /app/
COPY package-lock.json /app/
RUN npm install

FROM node:20-alpine AS builder

WORKDIR /app
COPY --from=dependencies /app/node_modules /app/node_modules
COPY ./src /app/src
COPY ./*.json /app/ 

RUN yarn build

# ---

FROM node:20-alpine

ENV NODE_ENV=production

USER node
WORKDIR /app

COPY --from=builder /app/*.json /app/
COPY --from=builder /app/dist/ /app/dist/
COPY --from=builder /app/node_modules /app/node_modules

CMD ["node", "dist/main"]