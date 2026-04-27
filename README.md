# Yetinder

Symfony 8 REST API + Next.js 15 frontend, databáze MySQL 8.

---

## Požadavky

- [Docker](https://www.docker.com/) + Docker Compose
- [Make](https://www.gnu.org/software/make/)

---

## Instalace a spuštění

```bash
# 1. Klonování repozitáře
git clone https://github.com/rychnal/wpj-yeti.git
cd wpj-yeti

# 2. Build PHP image
make build

# 3. Spuštění všech služeb
make up

# 4. Instalace závislostí (Composer + npm) – vyžaduje běžící kontejnery
make install

# 5. Nahrát databázi se seed daty
make seed
```

Aplikace běží na:

| Služba    | URL                        |
|-----------|----------------------------|
| Frontend  | http://localhost:3000      |
| API       | http://localhost:8000/api  |
| Databáze  | localhost:3306             |

---

## Make příkazy

| Příkaz                      | Popis                              |
|-----------------------------|------------------------------------|
| `make build`                | Sestaví PHP Docker image           |
| `make up`                   | Spustí všechny kontejnery          |
| `make down`                 | Zastaví všechny kontejnery         |
| `make install`              | Nainstaluje Composer + npm závislosti |
| `make seed`                 | Nahraje seed data do databáze         |
| `make shell-php`            | Bash uvnitř PHP kontejneru         |
| `make shell-frontend`       | Shell uvnitř Next.js kontejneru    |
| `make console CMD="<cmd>"`  | Spustí Symfony console příkaz      |
| `make logs`                 | Sleduje logy všech služeb          |
| `make logs-php`             | Sleduje logy PHP služby            |
| `make logs-frontend`        | Sleduje logy frontend služby       |

---

## Architektura

```
wpj-yeti/
├── api/          # Symfony 8 REST API
│   └── src/
│       ├── Controller/   # HTTP vrstva
│       ├── Service/      # Business logika
│       ├── Repository/   # Doctrine DBAL dotazy
│       └── DTO/          # Request/Response objekty
├── frontend/     # Next.js 15 (App Router)
│   └── app/
│       ├── ui/           # Sdílené komponenty
│       ├── lib/          # API funkce, typy, auth
│       └── */page.tsx    # Stránky
├── db/           # SQL schema
├── docker/       # PHP konfigurace
└── docker-compose.yml
```

---

## Databázové schéma

```sql
-- Profily yetů
CREATE TABLE yeti (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    gender      ENUM('male','female','unknown') DEFAULT 'unknown',
    height_cm   SMALLINT UNSIGNED,
    weight_kg   SMALLINT UNSIGNED,
    location    VARCHAR(255) NOT NULL,
    description TEXT,
    photo       VARCHAR(255),
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Uživatelé (přihlášení přes e-mail)
CREATE TABLE user (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email      VARCHAR(255) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Hodnocení
CREATE TABLE rating (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    yeti_id    INT UNSIGNED NOT NULL REFERENCES yeti(id) ON DELETE CASCADE,
    user_id    INT UNSIGNED NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    score      TINYINT UNSIGNED NOT NULL CHECK (score BETWEEN 1 AND 5),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## API endpointy

| Metoda | URL                          | Popis                                  |
|--------|------------------------------|----------------------------------------|
| GET    | `/api/yeti`                  | Top 10 nejlépe hodnocených yetů        |
| GET    | `/api/yeti/match`            | Náhodný yeti pro Yetinder              |
| GET    | `/api/yeti/match/batch`      | Dávka neohodnocených yetů (`?user_id`) |
| POST   | `/api/yeti`                  | Přidat nového yetiho                   |
| POST   | `/api/yeti/{id}/photo`       | Nahrát fotku yetiho                    |
| POST   | `/api/rating/{id}/rate`      | Ohodnotit yetiho                       |
| POST   | `/api/rating/{id}/skip`      | Přeskočit yetiho                       |
| GET    | `/api/stats/monthly`         | Graf hodnocení (`?period=day\|month\|year`) |
| GET    | `/api/stats/summary`         | Přehled hodnocení yetů (`?period=...`) |
| GET    | `/api/stats/user/{id}`       | Statistiky konkrétního uživatele       |
| POST   | `/api/auth/login`            | Přihlášení / registrace přes e-mail   |

---

## Přihlášení

Aplikace nepoužívá hesla — stačí zadat e-mail. Pokud účet neexistuje, automaticky se vytvoří.

---

## Prostředí (dev)

Přihlašovací údaje do databáze pro lokální vývoj:

| Parametr | Hodnota      |
|----------|--------------|
| Host     | `localhost`  |
| Port     | `3306`       |
| Databáze | `yetinder`   |
| Uživatel | `yeti`       |
| Heslo    | `yeti`       |

Env proměnné jsou nastavené přímo v `docker-compose.yml` — žádný `.env` soubor není potřeba pro lokální spuštění.
