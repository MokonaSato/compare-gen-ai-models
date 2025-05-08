FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# curlをインストール
RUN apk add --no-cache curl

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]