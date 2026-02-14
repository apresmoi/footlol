FROM node:22-alpine
WORKDIR /client
COPY package*.json ./
RUN npm ci
COPY . /client
CMD ["npm", "run", "start"]
