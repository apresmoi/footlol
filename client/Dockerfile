FROM node:10.19
WORKDIR /client
COPY package.json .
RUN yarn config set strict-ssl false
RUN yarn
RUN npm rebuild node-sass
COPY . /client
CMD ["yarn", "start"]
