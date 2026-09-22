# API Documentation

# Overview

The backend API is built with Node.js, Fastify, Sequelize, and PostgreSQL. I followed a REST-style approach and organized the API by resources such as products, cart, wishlist, authentication, and orders.

The main goal was to keep the backend simple, organized, and easy to extend.

# API Structure

I used a layered structure:

Routes → Middleware → Controllers → Services → Models → Database

* Routes define the available endpoints.
* Middleware handles common checks such as authentication and validation.
* Controllers receive requests and return responses.
* Services contain the main business logic.
* Models handle the database entities through Sequelize.
* PostgreSQL stores the application data.

I followed this structure separation to keep each part focused on one responsibility and to make the code easier to test.


# Validation & Error Handling

I used authenticate middleware to check if the user is authenticated before reaching the business logic.

The service checks rules such as product availability, stock, duplication...

The API returns appropriate HTTP status codes for invalid requests, unauthorized access, missing resources, and unexpected errors.

# Performance

I focused on reducing unnecessary database queries and avoiding retrieving data that the frontend does not need.

Created separate lightweight endpoints for cart and wishlist counts. Instead of loading the entire cart or wishlist just to display the number of items in the header, the frontend requests only the count.

# Note 

For the Place Order operation, I used a database transaction to make sure all related changes succeed or fail together.

When an order is placed:

Validate cart -> Check stock -> Create order -> Create order items -> update stock -> clear cart -> commit transaction 

# Testing

The APIs were tested using Postman, also I implemented test files including both normal requests and unexpected cases. 

