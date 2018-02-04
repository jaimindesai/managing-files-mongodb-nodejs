FROM node:6.10.3-alpine
# https://hub.docker.com/_/node/
LABEL Description="" Vendor="Jaimin Desai" Version="1.2"  Maintainer="judesai@gmail.com"

# Install app and dependencies, install first to take advantage of
# Docker layers to cache the npm install
WORKDIR /
ADD package.json /app/
RUN cp /app/package.json / \
  && npm install \
  # Use Nodemon to observe filesystem for developers
  && npm install -g nodemon

WORKDIR /app

# Now add app code
ADD . /app

RUN chown -R node:node /app

EXPOSE  3000
EXPOSE  5862

USER node
CMD [ "node", "src/app/app.js" ]