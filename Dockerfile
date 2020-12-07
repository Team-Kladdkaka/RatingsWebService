FROM node:8.0
RUN mkdir /RatingsWebService
WORKDIR /RatingsWebService
COPY . /RatingsWebService
RUN npm install

EXPOSE 8000
CMD ["node", "server/index.js"]