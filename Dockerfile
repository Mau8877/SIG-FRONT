# =============================================================================
# Dockerfile — SIG-FRONT (Vite + React + TypeScript)
# =============================================================================
# Multi-stage: build → nginx production
# =============================================================================

# ---- Stage 1: Build ----
FROM node:22-alpine AS builder

WORKDIR /app

# Dependencies first (capa de caché de Docker)
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

# Source code
COPY . .

# Build
RUN pnpm build

# ---- Stage 2: Production (nginx) ----
FROM nginx:stable-alpine AS production

# Copiar el build al directorio servido por nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración personalizada de nginx para SPA (Vite)
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen       80;
    server_name  localhost;

    root   /usr/share/nginx/html;
    index  index.html;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript image/svg+xml;
    gzip_min_length 256;

    # SPA: todas las rutas al index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache de assets estáticos con hash
    location ~* \.(?:ico|css|js|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
