FROM node:13.12.0-stretch

WORKDIR /srv
COPY package.json package-lock.json ./
RUN npm install
COPY . .

RUN npm run-script build

FROM node:13.12.0-alpine

EXPOSE 3000
WORKDIR /srv

RUN npm install -g serve

COPY --from=0 /srv/build /srv/build

CMD ["serve", "-l", "tcp://0.0.0.0:3000", "-s", "build"]

