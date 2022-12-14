FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT 3005

EXPOSE ${PORT}

CMD ["npm","run","start"]