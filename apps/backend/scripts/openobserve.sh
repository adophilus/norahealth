#!/usr/bin/env bash

docker run \
  -v $PWD/.openobserve:/data \
  -p 5080:5080 \
  -e ZO_ROOT_USER_EMAIL="$ZO_ROOT_USER_EMAIL" \
  -e ZO_ROOT_USER_PASSWORD="$ZO_ROOT_USER_PASSWORD" \
  -e ZO_DATA_DIR="$ZO_DATA_DIR" \
  openobserve/openobserve:latest
