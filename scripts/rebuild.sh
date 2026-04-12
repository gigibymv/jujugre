#!/bin/bash

# Clear Next.js build cache
echo "Clearing .next build cache..."
rm -rf /vercel/share/v0-project/.next

# Clear node_modules/.cache if it exists
echo "Clearing node_modules cache..."
rm -rf /vercel/share/v0-project/node_modules/.cache

echo "Build cache cleared successfully. Dev server will rebuild on next request."
