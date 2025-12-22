# Use a lightweight Node.js base image
FROM node:22-alpine

WORKDIR /app


COPY ./package*.json /app

RUN npm ci

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
