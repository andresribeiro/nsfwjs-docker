FROM ubuntu

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --fix-missing --no-install-recommends \
        build-essential \
        curl \
        git-core \
        iputils-ping \
        pkg-config \
        rsync \
        software-properties-common \
        unzip \
        wget

RUN curl --silent --location https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install --yes nodejs
RUN npm install -g yarn

RUN yarn add @tensorflow/tfjs-node

WORKDIR /usr/app

COPY package.json yarn.lock ./
RUN yarn

COPY . .

EXPOSE 3333

CMD ["yarn", "start"]
