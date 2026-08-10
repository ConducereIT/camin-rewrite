FROM node:24.18.0-alpine as dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci


FROM node:24.18.0-alpine as build

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

RUN npm run build 

RUN npm prune --omit=dev


FROM node:24.18.0-alpine as production

ENV NODE_ENV=production
RUN apk add openssl
WORKDIR /app

USER node

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/build ./dist
COPY --chown=node:node --from=build /app/prisma ./dist/prisma 

COPY --chown=node:node ./web ./dist/client

RUN ls /app
EXPOSE 8881

CMD [ "node", "/app/dist/main.js" ]



















# FROM registry.access.redhat.com/ubi8/nodejs-16:latest

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install npm production packages 
# RUN npm install --production

# COPY . /opt/app-root/src

# ENV NODE_ENV production
# ENV PORT 3000

# EXPOSE 3000

# CMD ["npm", "start"]




# # syntax=docker/dockerfile:1

# ARG NODE_VERSION=22

# # Install dependencies
# FROM node:${NODE_VERSION}-alpine AS dependencies

# WORKDIR /app

# COPY package.json package-lock.json ./
# RUN npm ci

# # Build the application
# FROM node:${NODE_VERSION}-alpine AS build

# WORKDIR /app

# COPY --from=dependencies /app/node_modules ./node_modules
# COPY . .

# # Remove this line if your project does not require a build step
# RUN npm run build

# # Install production-only dependencies
# RUN npm prune --omit=dev

# # Production image
# FROM node:${NODE_VERSION}-alpine AS production

# ENV NODE_ENV=production
# WORKDIR /app

# # Run as the non-root user included in the Node.js image
# USER node

# COPY --chown=node:node package.json package-lock.json ./
# COPY --chown=node:node --from=build /app/node_modules ./node_modules
# COPY --chown=node:node --from=build /app/dist ./dist

# EXPOSE 3000

# CMD ["node", "dist/index.js"]