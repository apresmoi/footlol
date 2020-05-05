FROM node:10.19
WORKDIR /server
COPY package.json .
RUN npm set strict-ssl false
RUN npm install
COPY . /server
CMD ["npm", "run", "start-dev"]
