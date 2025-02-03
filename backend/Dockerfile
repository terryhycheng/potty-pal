FROM oven/bun:1.2.2

ARG MONGODB_URL
ARG JWT_SECRET

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --production

COPY . .

ENV NODE_ENV=production
ENV MONGODB_URL=${MONGODB_URL}
ENV JWT_SECRET=${JWT_SECRET}

EXPOSE 8080

CMD ["bun", "start"]
