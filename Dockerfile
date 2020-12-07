FROM node
RUN mkdir /RatingsWebService
ADD . /RatingsWebService
WORKDIR /RatingsWebService
RUN npm install

EXPOSE 8000
CMD ["node", "index.js"]