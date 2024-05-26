FROM node:20

WORKDIR /app
COPY package.json .
COPY tsconfig.json .

RUN npm install
COPY /src ./src
COPY .env .

ENTRYPOINT npm run migration