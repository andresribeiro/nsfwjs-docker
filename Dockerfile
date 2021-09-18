FROM node:alpine

WORKDIR /usr/app

RUN apk add build-base && apk add --no-cache python3 py3-pip

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3333

CMD ["yarn", "start"]
