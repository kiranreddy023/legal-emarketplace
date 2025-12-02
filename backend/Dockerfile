FROM node:20.19-slim

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

ENTRYPOINT [ "npm", "run", "seed" ]
CMD [ "npm", "run", "dev" ]
