FROM denoland/deno:alpine-2.0.4 as builder

ARG APP_NAME=api

WORKDIR /app

COPY . .

RUN deno install -A --entrypoint "apps/${APP_NAME}/main.ts"

RUN deno compile --output output "apps/${APP_NAME}/main.ts"


FROM gcr.io/distroless/cc-debian12 as runner

COPY --from=builder /app/output /

CMD ["/output"]