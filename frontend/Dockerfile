FROM node:24.11.1

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

EXPOSE 5173

CMD ["npm","run","dev","--","--host","0.0.0.0"]
