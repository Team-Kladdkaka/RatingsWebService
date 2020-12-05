FROM node:8.0
RUN mkdir /RatingsWebService
ADD . /RatingsWebService
WORKDIR /RatingsWebService
RUN npm install

EXPOSE 8000
CMD ["node", "server/index.js"]