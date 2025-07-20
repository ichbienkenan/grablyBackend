#!/bin/bash

echo "Setup script başladı..."

apt-get update
apt-get install -y python3-pip ffmpeg

echo "Python3-pip və ffmpeg quraşdırıldı."

pip3 install yt-dlp

echo "yt-dlp pip ilə quraşdırıldı."

npm install

echo "npm paketləri quraşdırıldı."

echo "Setup script tamamlandı."
