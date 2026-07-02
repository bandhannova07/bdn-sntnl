#!/bin/bash
echo "Starting Sentinel Frontend on port 7860..."
npx serve -s dist -l 7860 &

if [ -n "$CLOUDFLARE_TOKEN" ]; then
    echo "CLOUDFLARE_TOKEN found. Starting Cloudflare Tunnel..."
    cloudflared tunnel --no-autoupdate run --token $CLOUDFLARE_TOKEN
else
    echo "CLOUDFLARE_TOKEN is not set. The frontend is running locally only."
    # Wait for the serve background process so the container doesn't exit
    wait -n
fi
