# Stage 1: Build the frontend
FROM node:20.19-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]