FROM node:20-alpine

WORKDIR /app
COPY package.json .
COPY tsconfig.json .

RUN npm install
COPY /src ./src
COPY .env .
COPY /docs .

ENTRYPOINT npm run migration