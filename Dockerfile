# Define the base image
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install dependencies
RUN yarn install

# Bundle app source
COPY . .

# Set env from docker-compose
ENV MONGO_URL=mongodb://typenotes-mongo:27017

# Build the TypeScript app
RUN yarn build
RUN yarn migrate

# Expose port
EXPOSE 4000

# Define the command to run the app
CMD [ "yarn", "start" ]

