CREATE DATABASE IF NOT EXISTS `boolcomics`;
USE `boolcomics`;

-- 1. PRODUCTS
CREATE TABLE IF NOT EXISTS `products` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    genre VARCHAR(25) NULL,
    author VARCHAR(150) NULL,
    release_date DATE NULL,
    publisher VARCHAR(50) NULL,
    binding VARCHAR(15) NULL,
    ean VARCHAR(13) NOT NULL UNIQUE,
    price DECIMAL(5,2) NOT NULL,
    original_price DECIMAL(5,2) NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    image_url VARCHAR(255) NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS `categories` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL
);

-- 3. CATEGORY_PRODUCTS (Pivot Table)
CREATE TABLE IF NOT EXISTS `category_products` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    product_id INT NOT NULL,
    -- Added CASCADE to both so if a product OR category is deleted, the link is removed
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 4. ADDRESSES
CREATE TABLE IF NOT EXISTS `addresses` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    country VARCHAR(50) NOT NULL
);

-- 5. ORDERS
CREATE TABLE IF NOT EXISTS `orders` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,
    total_price DECIMAL(6,2) NOT NULL DEFAULT 0,
    shipping_address INT NOT NULL,
    billing_address INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Added CASCADE here: if an address is deleted, the order is removed
    -- (Note: In real-world apps, you might prefer 'SET NULL' for addresses to keep order history)
    FOREIGN KEY (shipping_address) REFERENCES addresses(id) ON DELETE CASCADE,
    FOREIGN KEY (billing_address) REFERENCES addresses(id) ON DELETE CASCADE
);

-- 6. ORDER_ITEMS
CREATE TABLE IF NOT EXISTS `order_items` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(5,2) NOT NULL,
    -- Crucial: if order is deleted, items are deleted. 
    -- If product is deleted, items are deleted.
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 7. DISCOUNT_CODES
CREATE TABLE IF NOT EXISTS `discount_codes` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    discount_percentage DECIMAL(5,2) NOT NULL,
    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP NOT NULL,
    is_active BOOLEAN NOT NULL
);

/* Generated data */

-- Populating `categories` table
INSERT INTO `categories` (`name`, `slug`) VALUES
('Manga', 'manga'),
('Supereroi', 'supereroi'),
('Graphic Novel', 'graphic-novel'),
('Fantasy', 'fantasy'),
('Avventura', 'avventura');

-- Populating `products` table
INSERT INTO `products` (`name`, `description`, `genre`, `author`, `release_date`, `publisher`, `binding`, `ean`, `price`, `original_price`, `stock_quantity`, `image_url`, `slug`) VALUES 
('Naruto Vol. 1', 'L''inizio del cammino di Naruto Uzumaki per diventare Hokage.', 'Manga', 'Masashi Kishimoto', '1999-09-21', 'Planet Manga', 'Brossurato', '9788863041934', 5.20, 5.20, 150, 'https://example.com/naruto1.jpg', 'naruto-vol-1'),
('Spider-Man: Blue', 'Peter Parker ricorda il suo primo grande amore, Gwen Stacy.', 'Supereroi', 'Jeph Loeb, Tim Sale', '2002-07-01', 'Panini Comics', 'Cartonato', '9788891234567', 19.00, 21.00, 40, 'https://example.com/spidermanblue.jpg', 'spider-man-blue'),
('V for Vendetta', 'In una Gran Bretagna distopica, un misterioso rivoluzionario combatte il regime.', 'Graphic Novel', 'Alan Moore, David Lloyd', '1982-05-01', 'DC Comics', 'Cartonato', '9781401208417', 20.00, 20.00, 60, 'https://example.com/vvendetta.jpg', 'v-for-vendetta'),
('Berserk Vol. 1', 'Le avventure di Gatsu, il guerriero nero, in un mondo dark fantasy.', 'Manga', 'Kentaro Miura', '1990-11-26', 'Panini Comics', 'Brossurato', '9788863467650', 5.20, 5.20, 200, 'https://example.com/berserk1.jpg', 'berserk-vol-1'),
('Dragon Ball Vol. 1', 'Goku e Bulma partono alla ricerca delle sette Sfere del Drago.', 'Manga', 'Akira Toriyama', '1984-11-20', 'Star Comics', 'Brossurato', '9788822605413', 4.30, 4.30, 300, 'https://example.com/dragonball1.jpg', 'dragon-ball-vol-1'),
('Sandman Vol. 1', 'Il ritorno di Morfeo, il signore dei sogni, nel suo regno.', 'Fantasy', 'Neil Gaiman', '1989-01-01', 'DC Comics', 'Cartonato', '9781401225759', 25.00, 30.00, 25, 'https://example.com/sandman1.jpg', 'sandman-vol-1'),
('Kingdom Come', 'Una lotta epica tra la vecchia e la nuova generazione di supereroi.', 'Supereroi', 'Mark Waid, Alex Ross', '1996-05-01', 'DC Comics', 'Cartonato', '9781401220341', 30.00, 35.00, 20, 'https://example.com/kingdomcome.jpg', 'kingdom-come'),
('Blankets', 'Un''autobiografia a fumetti sulla crescita e il primo amore.', 'Graphic Novel', 'Craig Thompson', '2003-01-01', 'Rizzoli Lizard', 'Brossurato', '9788817011402', 24.00, 24.00, 35, 'https://example.com/blankets.jpg', 'blankets'),
('Death Note Vol. 1', 'Light Yagami trova un quaderno in grado di uccidere chiunque.', 'Manga', 'Tsugumi Ohba, Takeshi Obata', '2003-12-01', 'Planet Manga', 'Brossurato', '9788863461238', 5.20, 5.20, 120, 'https://example.com/deathnote1.jpg', 'death-note-vol-1'),
('Black Hammer Vol. 1', 'Eroi dimenticati vivono in una fattoria misteriosa.', 'Supereroi', 'Jeff Lemire, Dean Ormston', '2016-07-20', 'Bao Publishing', 'Brossurato', '9788865438466', 18.00, 18.00, 45, 'https://example.com/blackhammer1.jpg', 'black-hammer-vol-1');

-- Populating `category_products` table
INSERT INTO `category_products` (`product_id`, `category_id`) VALUES 
(1, 1), (1, 5), (2, 2), (2, 3), (3, 3), (4, 1), (4, 4), (5, 1), (5, 5), 
(6, 3), (6, 4), (7, 2), (7, 3), (8, 3), (9, 1), (10, 2), (10, 3);

-- Populating `addresses` table
INSERT INTO `addresses` (`street`, `city`, `state`, `zip_code`, `country`) VALUES 
('Via Dante 12', 'Firenze', 'FI', '50122', 'Italia'),
('Via Garibaldi 4', 'Genova', 'GE', '16124', 'Italia'),
('Piazza Grande 10', 'Modena', 'MO', '41121', 'Italia'),
('Via Etnea 50', 'Catania', 'CT', '95100', 'Italia'),
('Corso Cavour 15', 'Bari', 'BA', '70121', 'Italia');

-- Populating `orders` table
INSERT INTO `orders` (`first_name`, `last_name`, `email`, `status`, `total_price`, `shipping_address`, `billing_address`) VALUES 
('Giovanni', 'Verdi', 'giovanni.verdi@email.com', 'delivered', 18.00, 1, 1),
('Anna', 'Neri', 'anna.neri@email.com', 'shipped', 40.00, 2, 2),
('Luca', 'Bruni', 'luca.bruni@email.com', 'shipped', 18.00, 3, 3),
('Elena', 'Gialli', 'elena.gialli@email.com', 'pending', 25.00, 4, 4),
('Paolo', 'Viola', 'paolo.viola@email.com', 'shipped', 10.40, 5, 5);

-- Populating `order_items` table
INSERT INTO `order_items` (`order_id`, `product_id`, `quantity`, `price_at_purchase`) VALUES 
(1, 10, 1, 18.00), -- Ordine 3: Black Hammer
(2, 8, 2, 20.00),  -- Ordine 4: V for Vendetta (2 copie)
(3, 5, 1, 18.00), -- Ordine 5: Black Hammer
(4, 2, 1, 25.00), -- Ordine 6: Sandman
(5, 9, 2, 5.20);   -- Ordine 7: Berserk (2 copie)

-- Populating `discount_codes` table
INSERT INTO `discount_codes` (`code`, `discount_percentage`, `valid_from`, `valid_to`, `is_active`) VALUES
('SUMMER24', 20.00, '2024-06-01 00:00:00', '2024-08-31 23:59:59', 1),
('WINTER23', 15.00, '2023-12-01 00:00:00', '2024-01-31 23:59:59', 0),
('SPRING25', 25.00, '2025-03-01 00:00:00', '2025-05-31 23:59:59', 1),
('FALL22', 10.00, '2022-09-01 00:00:00', '2022-11-30 23:59:59', 1),
('FREESALE', 50.00, '2023-01-01 00:00:00', '2023-12-31 23:59:59', 1);

-- Populating `products` table
INSERT INTO `products` (`name`, `description`, `genre`, `author`, `release_date`, `publisher`, `binding`, `ean`, `price`, `original_price`, `stock_quantity`, `image_url`, `slug`) VALUES 
('One Piece Vol. 1', 'L''inizio dell’avventura di Monkey D. Rufy e della ciurma di Cappello di Paglia.', 'Manga', 'Eiichiro Oda', '1997-07-22', 'Star Comics', 'Brossurato', '9788822611111', 5.20, 5.20, 180, 'https://example.com/onepiece1.jpg', 'one-piece-vol-1'),
('Attack on Titan Vol. 1', 'L’umanità combatte per sopravvivere contro gigantesche creature chiamate Titani.', 'Manga', 'Hajime Isayama', '2009-03-17', 'Planet Manga', 'Brossurato', '9788869200014', 5.90, 5.90, 140, 'https://example.com/aot1.jpg', 'attack-on-titan-vol-1'),
('Batman: Year One', 'Le origini di Batman e del commissario Gordon in una Gotham corrotta.', 'Supereroi', 'Frank Miller', '1987-02-01', 'DC Comics', 'Cartonato', '9781401207526', 22.00, 25.00, 35, 'https://example.com/batmanyearone.jpg', 'batman-year-one'),
('Watchmen', 'Un thriller supereroistico che ha rivoluzionato il mondo del fumetto.', 'Graphic Novel', 'Alan Moore', '1986-09-01', 'DC Comics', 'Cartonato', '9781401245252', 28.00, 30.00, 50, 'https://example.com/watchmen.jpg', 'watchmen'),
('The Walking Dead Vol. 1', 'Rick Grimes si risveglia in un mondo devastato dagli zombie.', 'Fantasy', 'Robert Kirkman', '2003-10-08', 'Saldapress', 'Brossurato', '9788869190018', 14.90, 16.90, 60, 'https://example.com/twd1.jpg', 'the-walking-dead-vol-1'),
('Jujutsu Kaisen Vol. 1', 'Yuji Itadori entra nel pericoloso mondo delle maledizioni.', 'Manga', 'Gege Akutami', '2018-07-04', 'Planet Manga', 'Brossurato', '9788891290012', 5.20, 5.20, 170, 'https://example.com/jjk1.jpg', 'jujutsu-kaisen-vol-1');

-- Populating `category_products` table
INSERT INTO `category_products` (`product_id`, `category_id`) VALUES 
(11, 1), (11, 5), (12, 1), (12, 4), (13, 2), (14, 3), (15, 4), (16, 1);

UPDATE `products` SET `image_url` = '/img/products/naruto-vol-1.jpg' WHERE `slug` = 'naruto-vol-1';
UPDATE `products` SET `image_url` = '/img/products/spider-man-blue.jpg' WHERE `slug` = 'spider-man-blue';
UPDATE `products` SET `image_url` = '/img/products/v-for-vendetta.jpg' WHERE `slug` = 'v-for-vendetta';
UPDATE `products` SET `image_url` = '/img/products/berserk-vol-1.jpg' WHERE `slug` = 'berserk-vol-1';
UPDATE `products` SET `image_url` = '/img/products/dragon-ball-vol-1.jpg' WHERE `slug` = 'dragon-ball-vol-1';
UPDATE `products` SET `image_url` = '/img/products/sandman-vol-1.jpg' WHERE `slug` = 'sandman-vol-1';
UPDATE `products` SET `image_url` = '/img/products/kingdom-come.jpg' WHERE `slug` = 'kingdom-come';
UPDATE `products` SET `image_url` = '/img/products/blankets.jpg' WHERE `slug` = 'blankets';
UPDATE `products` SET `image_url` = '/img/products/death-note-vol-1.jpg' WHERE `slug` = 'death-note-vol-1';
UPDATE `products` SET `image_url` = '/img/products/black-hammer-vol-1.jpg' WHERE `slug` = 'black-hammer-vol-1';
UPDATE `products` SET `image_url` = '/img/products/one-piece-vol-1.jpg' WHERE `slug` = 'one-piece-vol-1';
UPDATE `products` SET `image_url` = '/img/products/attack-on-titan-vol-1.jpg' WHERE `slug` = 'attack-on-titan-vol-1';
UPDATE `products` SET `image_url` = '/img/products/batman-year-one.jpg' WHERE `slug` = 'batman-year-one';
UPDATE `products` SET `image_url` = '/img/products/watchmen.jpg' WHERE `slug` = 'watchmen';
UPDATE `products` SET `image_url` = '/img/products/the-walking-dead-vol-1.jpg' WHERE `slug` = 'the-walking-dead-vol-1';
UPDATE `products` SET `image_url` = '/img/products/jujutsu-kaisen-vol-1.jpg' WHERE `slug` = 'jujutsu-kaisen-vol-1';