FROM node:lts
WORKDIR /src
RUN /usr/local/bin/npm config set registry https://registry.npmmirror.com
RUN npm i pm2 -g
EXPOSE 3005
