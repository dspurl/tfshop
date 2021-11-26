FROM php:7.4-fpm

# bcmath bz2 calendar ctype curl dba dom enchant exif fileinfo filter ftp gd
# gettext gmp hash iconv imap interbase intl json ldap mbstring mysqli oci8
# odbc opcache pcntl pdo pdo_dblib pdo_firebird pdo_mysql pdo_oci pdo_odbc
# pdo_pgsql pdo_sqlite pgsql phar posix pspell readline recode reflection
# session shmop simplexml snmp soap sockets sodium spl standard sysvmsg sysvsem
# sysvshm tidy tokenizer wddx xml xmlreader xmlrpc xmlwriter xsl zend_test zip
COPY sources.list.stretch /etc/apt/sources.list
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y nano \
    && apt-get install -y libfreetype6-dev \
    && apt-get install -y zlib1g-dev \
    && apt-get install -y libzip-dev \
    && apt-get install -y libjpeg62-turbo-dev \
    && apt-get install -y libpng-dev \
    && apt-get install -y zip \
    && apt-get install -y git \
    && apt-get install -y supervisor \
    && apt-get install -y mariadb-client \
    && docker-php-ext-install bcmath \
    && docker-php-ext-install ctype \
    && docker-php-ext-configure gd \
    && docker-php-ext-install gd \
    && docker-php-ext-install mysqli \
    && docker-php-ext-install zip \
    && docker-php-ext-install pdo \
    && docker-php-ext-install pdo_mysql
RUN cp /usr/local/etc/php/php.ini-production /usr/local/etc/php/php.ini
RUN php -r "copy('https://install.phpcomposer.com/installer', 'composer-setup.php');"
RUN php composer-setup.php
RUN mv composer.phar /usr/local/bin/composer
RUN composer config -g repo.packagist composer https://mirrors.aliyun.com/composer/

# RUN pecl install mongodb
# RUN echo "extension=mongodb.so" > $PHP_INI_DIR/conf.d/mongodb.ini
RUN pecl install redis
RUN echo "extension=redis.so" > $PHP_INI_DIR/conf.d/redis.ini

CMD service supervisor start \
    && php-fpm

EXPOSE 9000
