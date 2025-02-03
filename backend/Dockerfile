FROM oven/bun:1.2.2

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --production

COPY . .

ENV NODE_ENV=production

EXPOSE 8080

CMD ["bun", "start"]