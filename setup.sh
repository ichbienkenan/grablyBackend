#!/bin/bash

echo "yt-dlp endirilir..."
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o yt-dlp
chmod +x yt-dlp
echo "yt-dlp hazırdır."

node index.js
