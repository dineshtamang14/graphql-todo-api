FROM node:16-alpine
LABEL Name="graphql-api"
WORKDIR /app 
COPY package.json .
COPY pnpm-lock.yaml .
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm add -D nodemon
COPY . .
ENV PORT 4000
EXPOSE $PORT
CMD ["npm", "run", "dev"]