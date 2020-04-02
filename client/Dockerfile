FROM node:13.12.0-stretch

EXPOSE 3000
WORKDIR /srv

COPY package.json package-lock.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]

