adding usertype filteration
routes
midlewares
php -S 127.0.0.1:8000
ALTER TABLE `users` ADD `category_id` VARCHAR(255) NULL AFTER `type`;
