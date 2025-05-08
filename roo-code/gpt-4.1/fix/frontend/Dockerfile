# build stage
FROM node:20-alpine AS build

WORKDIR /app

# COPY package.json yarn.lock ./
# RUN yarn install
COPY package.json package-lock.json ./
RUN npm install

COPY . .
# RUN yarn build
RUN npm run build

# production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
# COPY package.json yarn.lock ./
COPY package.json package-lock.json ./

EXPOSE 3000

# CMD ["yarn", "preview", "--host", "0.0.0.0", "--port", "3000"]
# CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
CMD ["npm", "run", "dev"]