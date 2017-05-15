FROM node:7.10.0

RUN apt-get update -y && \
    apt-get install -y ocaml libelf1 && \
    rm -rf /var/lib/apt/lists/* && \
    curl -o- -L https://yarnpkg.com/install.sh | bash
