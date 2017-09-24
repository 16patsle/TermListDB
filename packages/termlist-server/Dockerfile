FROM node:boron

# Create app directory
WORKDIR /usr/src/termlist-server

# Install app dependencies
COPY package-lock.json ./
COPY package-docker.json package.json

COPY termlist-web/ .

RUN npm install

# Bundle app source
COPY . .

EXPOSE 80
CMD [ "npm", "start" ]
