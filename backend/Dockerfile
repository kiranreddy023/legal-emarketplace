FROM node:20.19-slim

WORKDIR /backend

COPY backend/package*.json ./

RUN npm install

COPY backend/* ./

EXPOSE 5000

CMD [ "npm", "run", "dev" ]
