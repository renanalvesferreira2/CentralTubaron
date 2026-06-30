FROM node:22-alpine

ENV NODE_ENV=production

WORKDIR /app

ARG VITE_API_URL=http://localhost:4000/api
ARG VITE_WHATSAPP_NUMBER=555195624380
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WHATSAPP_NUMBER=$VITE_WHATSAPP_NUMBER

COPY package*.json ./
RUN npm install && npm cache clean --force

COPY . .
RUN npm run build

USER node

EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
