FROM golang:1.22-bullseye

# Install required dependencies
RUN apt-get update && apt-get install -y \
    git \
    gcc \
    g++ \
    make \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Clone and build Hugo from source
RUN git clone --depth 1 --branch v0.136.4 https://github.com/gohugoio/hugo.git && \
    cd hugo && \
    go install --tags extended

RUN mkdir -p hygraph
COPY ./hygraph/github-hygraph-sync.mjs /hygraph/
COPY docker/.env ./hygraph/
WORKDIR /hygraph
RUN npm init -y
RUN npm install dotenv graphql-request @octokit/rest
RUN node github-hygraph-sync.mjs

WORKDIR /src

# Set working directory
# hugo server --bind 0.0.0.0 --buildDrafts --buildFuture --disableFastRender

ENTRYPOINT ["bash"]