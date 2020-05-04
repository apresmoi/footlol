FROM node:10.19 as build-stage

FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/public /etc/nginx/html
COPY ./nginx/nginx.pro.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]
