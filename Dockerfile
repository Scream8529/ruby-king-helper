#docker build -f Dockerfile -t ruby-help .
#docker run -p 3004:80 -t ruby-help

FROM mirror.gcr.io/node:alpine AS builder

RUN npm install -g corepack
RUN corepack enable 
RUN corepack prepare yarn@4.3.1 --activate
RUN ls && yarn -v
RUN mkdir -p /tmp
COPY . ./tmp
WORKDIR /tmp

RUN yarn install --immutable
RUN yarn build


# Production Stage
FROM nginx:stable-alpine AS production
WORKDIR /app
COPY --from=builder /tmp/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
