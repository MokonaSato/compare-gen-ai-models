# FROM node:16
FROM node:22

WORKDIR /app

# COPY frontend/package.json frontend/package-lock.json ./
COPY ./package.json ./package-lock.json ./

RUN npm install

# COPY frontend ./
COPY . ./

RUN npm run build

EXPOSE 3000

# CMD ["npm", "run", "preview"]
CMD ["npm", "run", "dev"]