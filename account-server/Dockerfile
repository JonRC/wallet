FROM node:20-alpine

WORKDIR /app
COPY package.json .
COPY tsconfig.json .
COPY .env .

RUN npm install
COPY /src ./src

ENTRYPOINT npm run watch
