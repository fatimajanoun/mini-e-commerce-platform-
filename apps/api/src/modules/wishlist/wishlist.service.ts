import Wishlist from "../../db/models/Wishlist.js";
import WishlistItem from "../../db/models/WishlistItem.js";
import Product from "../../db/models/Product.js";
import ProductImage from "../../db/models/ProductImage.js";
import Variant from "../../db/models/Variant.js";

type WishlistItemWithProduct = {
  id: string;
  product: {
    id: string;
    slug: string;
    title: string;
    stock: number | null;
    price: string | number;
    images: {
      id: string;
      image_url: string;
    }[];
     variants: {
      id: string;
      name: string;
      value: string;
      price: string | number | null;
      stock: number;
    }[];
  };
};

export const getWishlist = async (userId: string) => {
  const wishlist = await Wishlist.findOne({
    where: {
      user_id: userId,
    },
    include: [
      {
        model: WishlistItem,
        as: "items",
        include: [
          {
            model: Product,
            as: "product",
            attributes: [
              "id",
              "slug",
              "title",
              "stock",
              "price",
            ],
              include: [
              {
                model: Variant,
                as: "variants",

                attributes: [
                  "id",
                  "name",
                  "value",
                  "price",
                  "stock",
                ],
              },
              {
                model: ProductImage,
                as: "images",
                attributes: ["id", "image_url"],
              },
            ],
          },
        ],
      },
    ],
  });

  if (!wishlist) {
    return {
      items: [],
    };
  }

  const items = (
    wishlist.get("items") as WishlistItemWithProduct[]
  ).map((item) => ({
    id: item.id,
    product: {
      id: item.product.id,
      slug: item.product.slug,
      title: item.product.title,
      stock: item.product.stock,
      price: Number(item.product.price),
      image: item.product.images?.[0]
      ? {
          id: item.product.images[0].id,
          url: item.product.images[0].image_url,
        }
      : null,
       variants:
        item.product.variants?.map((variant) => ({
          id: variant.id,
          name: variant.name,
          value: variant.value,
          price:
            variant.price !== null
              ? Number(variant.price)
              : null,
          stock: variant.stock,
        })) ?? [],
    },
  }));

  return {
    items,
  };
};

export const addWishlistItem = async (
  userId: string,
  productId: string,
) => {
  const product = await Product.findByPk(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  let wishlist = await Wishlist.findOne({
    where: {
      user_id: userId,
    },
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user_id: userId,
    });
  }

  const wishlistId = wishlist.get("id") as string;

  const existingItem = await WishlistItem.findOne({
    where: {
      wishlist_id: wishlistId,
      product_id: productId,
    },
  });

  if (existingItem) {
    throw new Error("Product already in wishlist");
  }

  const item = await WishlistItem.create({
    wishlist_id: wishlistId,
    product_id: productId,
  });

  return item;
};

export const deleteWishlistItem = async (
  userId: string,
  itemId: string,
) => {
  const wishlist = await Wishlist.findOne({
    where: {
      user_id: userId,
    },
  });

  if (!wishlist) {
    throw new Error("Wishlist item not found");
  }

  const wishlistId = wishlist.get("id") as string;

  const item = await WishlistItem.findOne({
    where: {
      id: itemId,
      wishlist_id: wishlistId,
    },
  });

  if (!item) {
    throw new Error("Wishlist item not found");
  }

  await item.destroy();
};