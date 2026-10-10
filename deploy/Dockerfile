FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY deploy/site.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY assets/ /usr/share/nginx/html/assets/
