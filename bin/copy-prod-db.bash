#!/usr/bin/env bash
set -eux -o pipefail

script_path="$(cd "$(dirname "$0")" ; pwd)"

# Required env variables
EC2_HOST="${EC2_HOST:-slant_aws}"

DB_PATH="$script_path/../db"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"

destination="$DB_PATH/db.json"
destination_save="$DB_PATH/save/db.prod.$TIMESTAMP.json"

# Copy to current directory
scp $EC2_HOST:~/db/db.json "$destination_save"
cp "$destination_save" "$destination"

exit 0
