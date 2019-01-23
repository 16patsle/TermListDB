FROM node:boron

# Create app directory
WORKDIR /usr/src/termlist

# Install app dependencies
WORKDIR /usr/src/termlist/termlist-server
COPY packages/termlist-server/package-lock.json ./
COPY packages/termlist-server/package-docker.json package.json

WORKDIR /usr/src/termlist/termlist-web
COPY packages/termlist-web ./

WORKDIR /usr/src/termlist/termlist-server
RUN npm install

WORKDIR /usr/src/termlist/termlist-web
RUN npm rebuild node-sass --force
RUN npm run prepare

WORKDIR /usr/src/termlist/termlist-server

# Bundle app source
COPY packages/termlist-server ./

EXPOSE 80
CMD [ "npm", "start" ]
