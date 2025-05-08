# FROM mysql:5.7
FROM mysql:8.0

ENV MYSQL_DATABASE=vocabulary_manager
ENV MYSQL_ROOT_PASSWORD=root_password
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=user_password

COPY ./init.sql /docker-entrypoint-initdb.d/