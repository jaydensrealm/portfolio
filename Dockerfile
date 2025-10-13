FROM nginx:alpine
# put our static site into nginx's default web root
COPY site/ /usr/share/nginx/html
EXPOSE 80

