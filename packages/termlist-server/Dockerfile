FROM node:boron

# Create app directory
WORKDIR /usr/src/termlist-server

# Install app dependencies
COPY package.json package-lock.json ./

COPY ../packages/termlist-web/ termlist-web/

RUN npm install termlist-web/ && npm install

# Bundle app source
COPY . .

EXPOSE 80
CMD [ "npm", "start" ]
