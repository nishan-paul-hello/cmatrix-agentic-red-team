#!/bin/sh
set -e

# Clean and recreate .next directory with proper permissions
echo "Setting up .next directory..."
rm -rf /app/.next
mkdir -p /app/.next
chmod -R 777 /app/.next

# Execute the main command
exec "$@"
