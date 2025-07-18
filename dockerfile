# Base image
FROM node:20

# yt-dlp üçün lazımi paketlər
RUN apt-get update && \
    apt-get install -y ffmpeg python3-pip && \
    pip install yt-dlp

# İş qovluğu
WORKDIR /app

# Paketləri kopyala
COPY package*.json ./

# NPM paketləri quraşdır
RUN npm install

# Kodları kopyala
COPY . .

# Port ayarla
EXPOSE 5000

# Serveri işə sal
CMD ["node", "index.js"]
