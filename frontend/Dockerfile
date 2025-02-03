FROM node:20-alpine AS builder

WORKDIR /app

ARG REACT_APP_API_URL

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENV REACT_APP_API_URL=${REACT_APP_API_URL}

EXPOSE 3000

CMD ["npm", "run", "start"]
