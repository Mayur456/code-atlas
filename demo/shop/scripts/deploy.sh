#!/bin/sh
set -e
build() {
  go build ./api
}
echo "deploying"
build
python3 scripts/report.py
