FROM node:20

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build -w db
RUN npm run build -w worker

CMD ["npm","run","start","-w","worker"]