FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/public /etc/nginx/html
COPY ./nginx/cert /etc/nginx/cert
COPY ./nginx/nginx.pro.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]
