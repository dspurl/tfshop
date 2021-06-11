FROM node:lts
WORKDIR /src
RUN /usr/local/bin/npm config set registry https://registry.npm.taobao.org
ADD startApp.sh /
ENTRYPOINT ["/startApp.sh"]