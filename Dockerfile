FROM php:8.4-cli

# System dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
    libzip-dev \
    libicu-dev \
    libxml2-dev \
    libonig-dev \
    && rm -rf /var/lib/apt/lists/*

# PHP extensions required by Symfony
RUN docker-php-ext-install \
    pdo_mysql \
    zip \
    intl \
    xml \
    mbstring \
    opcache

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Symfony CLI
RUN curl -sS https://get.symfony.com/cli/installer | bash && \
    mv /root/.symfony*/bin/symfony /usr/local/bin/symfony

WORKDIR /var/www/app

EXPOSE 8000

# Start Symfony dev server (binds to 0.0.0.0 so Docker port mapping works)
CMD ["symfony", "server:start", "--no-tls", "--port=8000", "--allow-http"]
