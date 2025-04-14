FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "start"]

##  docker build -t easy-market .
##  docker run -p 8000:8000 easy-market
