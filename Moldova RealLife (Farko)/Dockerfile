FROM node:22 AS base
WORKDIR /app
COPY . .
RUN npm install -g pnpm
RUN pnpm install

FROM base as builder
WORKDIR /app
RUN pnpm run build:all

FROM disinterpreter/ragemp-server AS final
WORKDIR /ragemp/ragemp-srv
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server/client_packages ./client_packages
COPY --from=builder /app/server/packages ./packages
COPY --from=builder /app/nosql ./nosql
ENTRYPOINT ["./start_server.sh"]

