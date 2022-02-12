FROM node:lts
WORKDIR /src
RUN /usr/local/bin/npm config set registry https://registry.npmmirror.com
ADD startApp.sh /
ENTRYPOINT ["/startApp.sh"]