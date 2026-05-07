# Project Work

## Tabelle principali:

**products**
- id INT PRIMARY KEY AUTO_INCREMENT,
- name VARCHAR(100) NOT NULL,
- description TEXT NULL,
- genre VARCHAR(25) NULL,
- author VARCHAR(150) NULL,
- release_date DATE NULL,
- publisher VARCHAR(50) NULL,
- binding VARCHAR(15) NULL,
- ean VARCHAR(13) NOT NULL UNIQUE,
- price DECIMAL(5, 2) NOT NULL,
- original_price DECIMAL(5, 2) NULL,
- stock_quantity INT NOT NULL DEFAULT 0,
- image_url VARCHAR(255) NULL,
- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
- updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

**categories**
- id INT PRIMARY KEY AUTO_INCREMENT,
- name VARCHAR(50) NOT NULL,
- slug VARCHAR(50) NOT NULL,

**category_products**
- id INT PRIMARY KEY AUTO_INCREMENT,
- product_id INT NOT NULL FOREIGN KEY
- category_id INT NOT NULL FOREIGN KEY


## Ordini e checkout:

**orders**
- id INT PRIMARY KEY AUTO_INCREMENT,
- first_name VARCHAR(50) NOT NULL,
- last_name VARCHAR(50) NOT NULL,
- email VARCHAR(100) NOT NULL,
- status VARCHAR(20) NOT NULL,
- total_price DECIMAL(6, 2) NOT NULL DEFAULT 0,
- shipping_address INT NOT NULL FOREIGN KEY,
- billing_address INT NOT NULL FOREIGN KEY,
- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

**order_items**
- id INT PRIMARY KEY AUTO_INCREMENT,
- order_id INT NOT NULL FOREIGN KEY,
- product_id INT NOT NULL FOREIGN KEY,
- quantity INT NOT NULL,
- price_at_purchase DECIMAL(5, 2) NOT NULL

## Indirizzi

***addresses**
- id INT PRIMARY KEY AUTO_INCREMENT,
- street VARCHAR(255) NOT NULL,
- city VARCHAR(100) NOT NULL,
- state VARCHAR(50) NOT NULL,
- zip_code VARCHAR(10) NOT NULL,
- country VARCHAR(50) NOT NULL,

### Funzionalità extra:

**discount_codes**
- id INT PRIMARY KEY AUTO_INCREMENT,
- code VARCHAR(10) NOT NULL UNIQUE,
- discount_percentage DECIMAL(5, 2) NOT NULL,
- valid_from TIMESTAMP NOT NULL,
- valid_to TIMESTAMP NOT NULL,
- is_active BOOLEAN NOT NULL

---

### Relazioni principali:
- products → categories (N:1)
- products → products_category → category (N:N tramite tabella ponte)
- orders → order_product → products (N:N tramite tabella ponte)
- orders → addresses (N:1) (shipping_address, billing_address)
- orders → discount_codes (N:1)