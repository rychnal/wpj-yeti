CREATE TABLE IF NOT EXISTS yeti (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)                        NOT NULL,
    gender      ENUM('male', 'female', 'unknown')   NOT NULL DEFAULT 'unknown',
    height_cm   SMALLINT UNSIGNED                   NOT NULL,
    weight_kg   SMALLINT UNSIGNED                   NOT NULL,
    location    VARCHAR(255)                        NOT NULL,
    description TEXT                                NULL,
    photo       VARCHAR(255)                        NULL,
    created_at  DATETIME                            NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS user (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    email      VARCHAR(255)                        NOT NULL UNIQUE,
    created_at DATETIME                            NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS rating (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    yeti_id    INT                                 NOT NULL,
    user_id    INT                                 NOT NULL,
    score      TINYINT UNSIGNED                    NOT NULL,
    created_at DATETIME                            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rating_yeti FOREIGN KEY (yeti_id) REFERENCES yeti (id) ON DELETE CASCADE,
    CONSTRAINT fk_rating_user FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE,
    CONSTRAINT chk_score CHECK (score BETWEEN 1 AND 5)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;
