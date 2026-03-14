FROM node:20

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build -w subscribers/shipping

EXPOSE 5002

CMD ["npm","run","start","-w","subscribers/shipping"]