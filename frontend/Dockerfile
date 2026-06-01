FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --only=production

COPY --from=build /app/build ./build

EXPOSE 3000

CMD ["npm", "start"]
