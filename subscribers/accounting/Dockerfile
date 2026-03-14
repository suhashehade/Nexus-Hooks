FROM node:20

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build -w subscribers/accounting

EXPOSE 5001

CMD ["npm","run","start","-w","subscribers/accounting"]