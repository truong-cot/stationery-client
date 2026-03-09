# ===== BUILD STAGE =====
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build


# ===== PRODUCTION STAGE =====
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3401

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3401

CMD ["yarn", "start", "-p", "3401"]