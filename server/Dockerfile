FROM node:22-alpine
WORKDIR /server
COPY package*.json ./
RUN npm ci
COPY . /server
RUN npm run build
CMD ["npm", "run", "start"]
