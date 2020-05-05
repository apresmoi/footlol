FROM node:10.19
WORKDIR /client
COPY package.json .
RUN npm set strict-ssl false
RUN npm install
RUN npm rebuild node-sass
COPY . /client
CMD ["npm", "run", "start"]
