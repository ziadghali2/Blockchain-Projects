FROM rust:1.62 as builder

RUN cargo new --bin rust-docker-templete
WORKDIR ./rust-docker-templete
COPY ./Cargo.toml ./Cargo.toml
COPY ./src ./src

RUN cargo build --release

FROM centos:latest
COPY --from=builder /rust-docker-templete/target/release/rust-docker-templete ./rust-docker-templete
CMD [ "./rust-docker-templete" ]
