FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
# RUN npm uninstall bcrypt
# RUN apk add --no-cache python3 make g++
# RUN apk add --no-cache --virtual .build-deps build-base python3-dev
# RUN npm install bcrypt

COPY . .

RUN npm run build

EXPOSE 3001

# Start the application
CMD ["npm", "run", "dev"]