-- ========================================================
-- ShopSphere Database Schema & Seed Data
-- Database Engine: MySQL 8.0+
-- ========================================================

CREATE DATABASE IF NOT EXISTS `shopsphere` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `shopsphere`;

-- Disable Foreign Key Checks temporarily for clean setup
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `cart`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
-- 1. Table Structure: users
-- --------------------------------------------------------
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. Table Structure: categories
-- --------------------------------------------------------
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. Table Structure: products
-- --------------------------------------------------------
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10, 2) NOT NULL,
  `original_price` DECIMAL(10, 2) NOT NULL,
  `discount` INT DEFAULT 0,
  `rating` DECIMAL(3, 2) DEFAULT 0.00,
  `reviews` INT DEFAULT 0,
  `stock` INT DEFAULT 0,
  `image` VARCHAR(500),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. Table Structure: cart
-- --------------------------------------------------------
CREATE TABLE `cart` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. Table Structure: cart_items
-- --------------------------------------------------------
CREATE TABLE `cart_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `cart_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  UNIQUE KEY `unique_cart_product` (`cart_id`, `product_id`),
  FOREIGN KEY (`cart_id`) REFERENCES `cart`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. Table Structure: orders
-- --------------------------------------------------------
CREATE TABLE `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
  `shipping_address` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 7. Table Structure: order_items
-- --------------------------------------------------------
CREATE TABLE `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ========================================================
-- SEED DATA
-- Note: User passwords below are hashed for "password123"
-- Hash: $2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW
-- ========================================================

-- Seed Users
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'Admin User', 'admin@shopsphere.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'admin'),
(2, 'John Doe', 'john@example.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'user');

-- Seed Carts for Initial Users
INSERT INTO `cart` (`id`, `user_id`) VALUES
(1, 1),
(2, 2);

-- Seed Categories
INSERT INTO `categories` (`id`, `name`, `description`) VALUES
(1, 'Electronics', 'Gadgets, smartphones, audio gear, and modern accessories'),
(2, 'Fashion', 'Apparel, footwear, and stylish accessories for everyone'),
(3, 'Home & Living', 'Furniture, home decor, kitchenware, and lifestyle goods'),
(4, 'Books', 'Best-selling fiction, non-fiction, technical, and lifestyle books'),
(5, 'Sports & Fitness', 'Gym equipment, activewear, outdoor gear, and accessories');

-- Seed 20 Realistic Products
INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `price`, `original_price`, `discount`, `rating`, `reviews`, `stock`, `image`) VALUES
(1, 1, 'Noise-Canceling Wireless Headphones', 'Immersive over-ear Bluetooth headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio quality.', 199.99, 249.99, 20, 4.80, 142, 45, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80'),
(2, 1, 'Ultra-Slim Mechanical Keyboard', 'Low-profile mechanical gaming and typing keyboard with customizable RGB backlighting and tactile switches.', 89.99, 119.99, 25, 4.70, 89, 30, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80'),
(3, 1, '4K Ultra HD Smart Monitor 27"', 'Stunning 27-inch IPS display featuring 4K resolution, HDR10 support, ultra-thin bezels, and USB-C connectivity.', 349.99, 429.99, 18, 4.60, 64, 20, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80'),
(4, 1, 'Ergonomic Wireless Gaming Mouse', 'Precision wireless mouse with high DPI optical sensor, customizable side buttons, and lightweight ergonomic grip.', 49.99, 69.99, 28, 4.50, 112, 50, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80'),
(5, 2, 'Classic Minimalist Denim Jacket', 'Timeless unisex blue denim jacket crafted from premium durable cotton with modern tailored fit.', 79.99, 99.99, 20, 4.40, 53, 35, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80'),
(6, 2, 'Breathable Performance Running Shoes', 'Lightweight mesh running sneakers engineered for maximum comfort, shock absorption, and flexibility.', 119.99, 149.99, 20, 4.90, 210, 60, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'),
(7, 2, 'Vintage Leather Crossbody Bag', 'Handcrafted genuine leather shoulder bag featuring multi-compartment storage and antique brass hardware.', 129.99, 169.99, 23, 4.75, 48, 25, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80'),
(8, 2, 'Polarized Aviator Sunglasses', 'Classic metal frame sunglasses equipped with UV400 polarized lenses for maximum glare reduction.', 39.99, 59.99, 33, 4.30, 95, 80, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80'),
(9, 3, 'Smart Ceramic Pour-Over Coffee Maker', 'Elegant heat-resistant ceramic coffee dripper with reusable stainless steel mesh filter for artisan brewing.', 34.99, 44.99, 22, 4.85, 78, 40, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80'),
(10, 3, 'Minimalist Wooden Desk Lamp', 'Adjustable warm-LED desk lamp built with natural solid wood base and soft glare-free illumination.', 59.99, 79.99, 25, 4.65, 37, 28, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80'),
(11, 3, 'Aromatic Diffuser & Essential Oils Set', 'Ultrasonic mist humidifier with 7 LED color lights and a starter kit of 6 organic essential oils.', 44.99, 59.99, 25, 4.55, 120, 55, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80'),
(12, 3, 'Cozy Knit Throw Blanket', 'Luxuriously soft acrylic cable-knit throw blanket perfect for sofas, armchairs, and cozy bedroom decor.', 49.99, 64.99, 23, 4.70, 82, 32, 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80'),
(13, 4, 'Designing Data-Intensive Applications', 'The definitive guide to the architecture, storage, and processing principles behind modern scalable software systems.', 45.00, 55.00, 18, 4.95, 310, 100, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80'),
(14, 4, 'Clean Code: Handbook of Agile Software Craftsmanship', 'A must-read reference filled with practical examples for writing clean, readable, and maintainable software.', 42.50, 49.99, 15, 4.88, 245, 85, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80'),
(15, 4, 'Atomic Habits by James Clear', 'An easy and proven framework for building good habits, breaking bad ones, and mastering tiny behaviors.', 22.00, 28.00, 21, 4.92, 530, 150, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80'),
(16, 4, 'The Psychology of Money', 'Timeless lessons on wealth, greed, and happiness exploring how human emotions shape financial decisions.', 19.99, 24.99, 20, 4.80, 190, 75, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80'),
(17, 5, 'Anti-Slip High-Density Yoga Mat', '6mm eco-friendly TPE fitness mat with alignment markings and carrying strap for yoga, pilates, and floor workouts.', 39.99, 49.99, 20, 4.75, 115, 65, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80'),
(18, 5, 'Adjustable Dumbbell Set (50 lbs)', 'Compact space-saving quick-select dumbbell system ranging from 5 to 50 lbs for versatile strength training.', 299.99, 399.99, 25, 4.85, 74, 15, 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&q=80'),
(19, 5, 'Smart Fitness Tracker & Heart Rate Monitor', 'Waterproof activity tracker featuring continuous heart rate monitoring, sleep tracking, and 14-day battery life.', 69.99, 89.99, 22, 4.40, 160, 40, 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&q=80'),
(20, 5, 'Insulated Stainless Steel Water Bottle 32oz', 'Double-wall vacuum insulated sports bottle that keeps drinks icy cold for 24 hours or hot for 12 hours.', 27.99, 34.99, 20, 4.90, 280, 90, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80');

-- Seed Sample Orders
INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `shipping_address`) VALUES
(1, 2, 239.98, 'delivered', '123 Main St, Apt 4B, New York, NY 10001'),
(2, 2, 45.00, 'processing', '123 Main St, Apt 4B, New York, NY 10001');

-- Seed Order Items
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 1, 1, 199.99),
(2, 1, 8, 1, 39.99),
(3, 2, 13, 1, 45.00);
