FROM node:9-slim
ENV PORT 4000
EXPOSE 4000
WORKDIR /usr/src/app
COPY . .
CMD ["npm", "start"]
