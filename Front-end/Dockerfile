FROM node:latest AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM gcr.io/distroless/nodejs:18
WORKDIR /app
COPY --from=build /app/build /app/build
EXPOSE 3000
