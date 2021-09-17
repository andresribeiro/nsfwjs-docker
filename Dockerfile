FROM node:lts

WORKDIR /usr/app

COPY package.json yarn.lock ./
RUN yarn install --prod

COPY . .

EXPOSE 3333

CMD ["yarn", "start"]
