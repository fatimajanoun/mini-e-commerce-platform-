import User from "./User.js";
import Product from "./Product.js";
import Variant from "./Variant.js";
import ProductImage from "./ProductImage.js";
import Cart from "./Cart.js";
import CartItem from "./CartItem.js";
import Wishlist from "./Wishlist.js";
import WishlistItem from "./WishlistItem.js";
import Order from "./Order.js";
import OrderItem from "./OrderItem.js";

// User relationships
User.hasOne(Cart, {
  foreignKey: "user_id",
  as: "cart",
});

Cart.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasOne(Wishlist, {
  foreignKey: "user_id",
  as: "wishlist",
});

Wishlist.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasMany(Order, {
  foreignKey: "user_id",
  as: "orders",
});

Order.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// Product relationships
Product.hasMany(Variant, {
  foreignKey: "product_id",
  as: "variants",
});

Variant.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

Product.hasMany(ProductImage, {
  foreignKey: "product_id",
  as: "images",
});

ProductImage.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

Variant.hasMany(ProductImage, {
  foreignKey: "variant_id",
  as: "images",
});

ProductImage.belongsTo(Variant, {
  foreignKey: "variant_id",
  as: "variant",
});

// Cart relationships
Cart.hasMany(CartItem, {
  foreignKey: "cart_id",
  as: "items",
});

CartItem.belongsTo(Cart, {
  foreignKey: "cart_id",
  as: "cart",
});

CartItem.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

Product.hasMany(CartItem, {
  foreignKey: "product_id",
  as: "cartItems",
});

CartItem.belongsTo(Variant, {
  foreignKey: "variant_id",
  as: "variant",
});

Variant.hasMany(CartItem, {
  foreignKey: "variant_id",
  as: "cartItems",
});

// Wishlist relationships
Wishlist.hasMany(WishlistItem, {
  foreignKey: "wishlist_id",
  as: "items",
});

WishlistItem.belongsTo(Wishlist, {
  foreignKey: "wishlist_id",
  as: "wishlist",
});

WishlistItem.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

Product.hasMany(WishlistItem, {
  foreignKey: "product_id",
  as: "wishlistItems",
});

WishlistItem.belongsTo(Variant, {
  foreignKey: "variant_id",
  as: "variant",
});

Variant.hasMany(WishlistItem, {
  foreignKey: "variant_id",
  as: "wishlistItems",
});

// Order relationships
Order.hasMany(OrderItem, {
  foreignKey: "order_id",
  as: "items",
});

OrderItem.belongsTo(Order, {
  foreignKey: "order_id",
  as: "order",
});

OrderItem.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

Product.hasMany(OrderItem, {
  foreignKey: "product_id",
  as: "orderItems",
});

OrderItem.belongsTo(Variant, {
  foreignKey: "variant_id",
  as: "variant",
});

Variant.hasMany(OrderItem, {
  foreignKey: "variant_id",
  as: "orderItems",
});