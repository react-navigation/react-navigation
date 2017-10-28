FROM node:8.4.0

RUN apt-get update -y && \
    apt-get install -y ocaml libelf1 && \
    rm -rf /var/lib/apt/lists/* && \
    curl -o- -L https://yarnpkg.com/install.sh | bash && \
    yarn global add exp
    
RUN git clone https://github.com/facebook/watchman.git \
    && cd watchman \
    && git checkout v4.7.0 \
    && apt-get update -y \
    && apt-get install -y autoconf automake build-essential python-dev \
    && ./autogen.sh \
    && ./configure \
    && make \
    && make install \
    && apt-get remove --purge -y autoconf automake build-essential python-dev \
    && rm -rf /var/lib/apt/lists/*
