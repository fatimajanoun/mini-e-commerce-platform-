# Database 

# Approch decision 

-I chose to use relational data base because the application has several related entities, and specifically postgres because it provides strong relational features and advanced features that can be useful if the application grows in the future.

-I used Sequelize as the ORM because it makes it easier to work with PostgreSQL from the Node.js backend and manage the relationships between the different models.

# Tables 

Overall, I tried to keep each table responsible for one main part of the application and connect them using relationships and foreign keys.

-for orders i separated orders and order_items because the order stores the general information like totalamount,name,phone... while order_items refer to the actual products.
(same idea for cart&cartItems and whishlist&whishlistItems)

-i created a separate table for product-images because one product can have multiple images, and some images can belong to a specific variant, so we can add multiple images without changing the products table 

-For the products table, i added a slug because i wanted the product details URL to be readable instead of using the product UUID.  

-Variants are stored in a separate table because one product can have different options. Each variant can have its own price and stock, which gives us more control over products that have different sizes or options. For products that do not have variants, the stock is stored directly on the product.

-I also added soft delete support to products and variants using deleted_at column. Instead of permanently deleting a product or variant from the database, it can be marked as deleted. This keeps the data available in the database but at the same time it prevents deleted products from appearing in normal queries.

# Relationships

I defined the relationships between the models using Sequelize associations.
For example, a user can have a cart and wishlist, and a user can have multiple orders. A product can have multiple variants and images. A cart, wishlist, and order can also contain multiple items.

#  Seed Data

-I added seed data for the test user and the product catalog so i can have some data to work with during development. The product seeder includes the products, their variants, and their images. I didn't seed carts, wishlists, or orders because these are created based on the user's actions while using the application.

# Notes 

During development, when i needed to change the structure of a table, I sometimes undid the migration, updated the existing migration with the new columns, and ran the migration again. Since the project is still using development and seed data and has not been deployed to production, i preferred keeping the original migrations clean instead of creating a separate migration for every small schema change.

If the application were already in production, i would not modify an existing migration. I would create a new migration so that the existing database structure and migration history would remain safe and consistent.