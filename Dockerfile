FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg python3 python3-qrcode fonts-dejavu-core fonts-liberation && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force
COPY . .
ENV NODE_ENV=production HOST=0.0.0.0 PORT=10000 PIXBOOTH_FFMPEG=/usr/bin/ffmpeg PIXBOOTH_PYTHON=python3 PIXBOOTH_DATA_DIR=/tmp/pixbooth-data PIXBOOTH_ACCESS_FILE=/tmp/pixbooth-access.txt
EXPOSE 10000
USER node
CMD ["node", "server-v2.cjs"]
