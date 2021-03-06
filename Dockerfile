FROM node:8.0-alpine AS builder

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
COPY public/ /app/public
COPY src/ /app/src

# Creating tar of productions dependencies
RUN npm install --production && cp -rp ./node_modules /tmp/node_modules

# Installing all dependencies
RUN npm install

# Copying application code
# COPY . /app

# Running tests
# RUN npm test

# Build
RUN npm run build && cp -rp ./dist /tmp/dist && cp -rp ./public /tmp/public

FROM node AS runner

EXPOSE 3000
WORKDIR /app

# Adding production dependencies to image
COPY --from=builder /tmp/node_modules /app/node_modules
COPY --from=builder /tmp/dist /app/dist
COPY --from=builder /tmp/public /app/public

# Copying application code
COPY package.json /app/package.json

CMD npm start