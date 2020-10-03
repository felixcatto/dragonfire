FROM node:12.18.4

RUN mkdir app
WORKDIR app
COPY package.json package-lock.json /app/
RUN npm i
COPY . .
RUN make build
EXPOSE 4000

CMD ["node", "dist/bin/server.js"]
