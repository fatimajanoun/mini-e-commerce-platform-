import Cart from "../../db/models/Cart.js";
import CartItem from "../../db/models/CartItem.js";
import Product from "../../db/models/Product.js";
import Variant from "../../db/models/Variant.js";

type CartItemWithRelations = {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: string | number;
  };
  variant: {
    id: string;
    name: string;
    value: string;
    price: string | number | null;
  } | null;
};

type AddCartItemInput = {
  productId: string;
  variantId?: string;
  quantity: number;
};

type UpdateCartItemInput = {
  quantity?: number;
  variantId?: string | null;
};

export const getCart = async (userId: string) => {
  const cart = await Cart.findOne({
    where: {
      user_id: userId,
    },
    include: [
      {
        model: CartItem,
        as: "items",
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "title", "price"],
          },
          {
            model: Variant,
            as: "variant",
            attributes: ["id", "name", "value", "price"],
          },
        ],
      },
    ],
  });

  if (!cart) {
    return {
      items: [],
      total: 0,
    };
  }

  const items = (
    cart.get("items") as CartItemWithRelations[]
  ).map((item) => {
    const unitPrice =
      item.variant?.price ?? item.product.price;

    const subtotal =
      Number(unitPrice) * item.quantity;

    return {
      id: item.id,

      product: {
        id: item.product.id,
        title: item.product.title,
        price: Number(item.product.price),
      },

      variant: item.variant
        ? {
            id: item.variant.id,
            name: item.variant.name,
            value: item.variant.value,
            price:
              item.variant.price !== null
                ? Number(item.variant.price)
                : null,
          }
        : null,

      quantity: item.quantity,
      unit_price: Number(unitPrice),
      subtotal,
    };
  });

  const total = items.reduce(
    (sum, item) => sum + item.subtotal,
    0,
  );

  return {
    items,
    total,
  };
};

export const addCartItem = async (
  userId: string,
  data: AddCartItemInput,
) => {
  const { productId, variantId, quantity } = data;

  const product = await Product.findByPk(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  let variant = null;

  if (variantId) {
    variant = await Variant.findOne({
      where: {
        id: variantId,
        product_id: productId,
      },
    });

    if (!variant) {
      throw new Error("Variant not found");
    }
  }

  const availableStock = variant
    ? variant.get("stock") as number
    : product.get("stock") as number;

  if (availableStock < quantity) {
    throw new Error("Insufficient stock");
  }

  let cart = await Cart.findOne({
    where: {
      user_id: userId,
    },
  });

  if (!cart) {
    cart = await Cart.create({
      user_id: userId,
    });
  }

  const existingItem = await CartItem.findOne({
    where: {
      cart_id: cart.get("id") as string,
      product_id: productId,
      variant_id: variantId ?? null,
    },
  });

  if (existingItem) {
    const currentQuantity =
      existingItem.get("quantity") as number;

    const newQuantity = currentQuantity + quantity;

    if (newQuantity > availableStock) {
      throw new Error("Insufficient stock");
    }

    await existingItem.update({
      quantity: newQuantity,
    });

    return existingItem;
  }

  const cartItem = await CartItem.create({
    cart_id: cart.get("id") as string,
    product_id: productId,
    variant_id: variantId ?? null,
    quantity,
  });

  return cartItem;
};

export const deleteCartItem = async (
  userId: string,
  itemId: string,
) => {
  const cart = await Cart.findOne({
    where: { user_id: userId },
  });

  if (!cart) {
    throw new Error("Cart item not found");
  }

  const cartId = cart.get("id") as string;

  const item = await CartItem.findOne({
    where: {
      id: itemId,
      cart_id: cartId,
    },
  });

  if (!item) {
    throw new Error("Cart item not found");
  }

  await item.destroy();
};

export const updateCartItem = async (
  userId: string,
  itemId: string,
  data: UpdateCartItemInput,
) => {
  const cart = await Cart.findOne({
    where: { user_id: userId },
  });

  if (!cart) {
    throw new Error("Cart item not found");
  }

  const cartId = cart.get("id") as string;

  const item = await CartItem.findOne({
    where: {
      id: itemId,
      cart_id: cartId,
    },
  });

  if (!item) {
    throw new Error("Cart item not found");
  }

  const productId = item.get("product_id") as string;

  const variantId =
    data.variantId !== undefined
      ? data.variantId
      : (item.get("variant_id") as string | null);

  let variant = null;

  if (variantId) {
    variant = await Variant.findOne({
      where: {
        id: variantId,
        product_id: productId,
      },
    });

    if (!variant) {
      throw new Error("Variant not found");
    }
  }

  const product = await Product.findByPk(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const availableStock = variant
    ? (variant.get("stock") as number)
    : (product.get("stock") as number);

  const quantity =
    data.quantity !== undefined
      ? data.quantity
      : (item.get("quantity") as number);

  if (quantity > availableStock) {
    throw new Error("Insufficient stock");
  }

  await item.update({
    quantity,
    variant_id: variantId,
  });

  return item;
};