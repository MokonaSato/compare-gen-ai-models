# FROM node:16
FROM node:22

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

# RUN npm run build

# CMD ["npm", "run", "preview"]
CMD ["npm", "run", "dev"]