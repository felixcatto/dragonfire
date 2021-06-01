FROM nginx:1.19

COPY --from=dragonfire_app /app/dist/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
