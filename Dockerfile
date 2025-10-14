FROM nginx:alpine

# put our static site into nginx's default web root
COPY site/ /usr/share/nginx/html

# ensure nginx knows how to serve JavaScript modules (.mjs) with the proper MIME type
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

