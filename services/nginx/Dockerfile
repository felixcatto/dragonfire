FROM nginx:1.19

COPY --from=blizzard_app /blizzard/dist/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
