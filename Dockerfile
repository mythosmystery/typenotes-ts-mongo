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

# Build the TypeScript app
RUN yarn build

# Expose port
EXPOSE 3000

# Define the command to run the app
CMD [ "yarn", "start" ]

