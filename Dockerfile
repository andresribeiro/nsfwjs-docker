FROM node:lts

WORKDIR /usr/app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3333

CMD ["yarn", "start"]
