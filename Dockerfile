FROM node:buster-slim as builder

WORKDIR /usr/app

RUN apt-get update && \ 
  apt-get install -y build-essential \
  wget \
  python3 \
  make \
  gcc \ 
  libc6-dev 

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN yarn build

FROM node:buster-slim

WORKDIR /app

RUN apt-get update && \ 
  apt-get install -y build-essential \
  wget \
  python3 \
  make \
  gcc \ 
  libc6-dev 

COPY --from=builder /usr/app /app/

EXPOSE 3333

CMD ["yarn", "start"]
