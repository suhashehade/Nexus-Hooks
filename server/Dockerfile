FROM node:20

WORKDIR /app

# Copy all the project because I use workspaces
COPY . .

RUN npm install

# build db library
RUN npm run build -w db

# build server
RUN npm run build -w server

EXPOSE 4000

CMD ["npm","run","start","-w","server"]