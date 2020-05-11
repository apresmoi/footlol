FROM node:10.19
WORKDIR /server
COPY package.json .
RUN npm set strict-ssl false
RUN npm install
COPY . /server
RUN npm run build
CMD ["npm", "run", "start"]
