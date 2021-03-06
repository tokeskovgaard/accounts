FROM node:9-slim
ENV PORT 4000
EXPOSE 4000
WORKDIR /usr/src/app
COPY . .

RUN npm run install

CMD ["npm", "start"]
