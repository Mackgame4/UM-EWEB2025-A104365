FROM node:22-alpine

WORKDIR /usr/src/app

COPY . .

RUN apk update && apk upgrade && \
	npm install && \
	npm install -g nodemon

EXPOSE 25000

CMD ["npm", "start"]