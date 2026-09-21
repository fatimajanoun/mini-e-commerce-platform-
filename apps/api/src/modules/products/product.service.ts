import { ProductListInput } from "./product.schema.js";

import Product from "../../db/models/Product.js";
import Variant from "../../db/models/Variant.js";
import ProductImage from "../../db/models/ProductImage.js";

export const getProducts = async ({
    page,
    limit,
}: ProductListInput) => {
    const offset = (page - 1) * limit;

    const { rows, count } = await Product.findAndCountAll({
        attributes: [
            "id",
            "slug",
            "title",
            "stock",
            "price",
            "created_at",
        ],

        include: [
            {
                model: Variant,
                as: "variants",
                attributes: [
                    "id",
                    "name",
                    "value",
                    "stock",
                ],
            },
            {
                model: ProductImage,
                as: "images",
                attributes: [
                    "id",
                    "image_url",
                ],
                where: {
                    variant_id: null,
                    is_primary: true,
                },
                required: false,
            },
        ],

        order: [["created_at", "DESC"]],

        limit,
        offset,

        distinct: true,
    });

    const totalPages = Math.ceil(count / limit);

    const data = rows.map((product) => {
        const productData = product.toJSON() as any;

        return {
            id: productData.id,
            slug: productData.slug,
            title: productData.title,
            price: productData.price,
            stock: productData.stock,
            image: productData.images?.[0]
                ? {
                    id: productData.images[0].id,
                    url: productData.images[0].image_url,
                }
                : null,

            variants: productData.variants ?? [],
        };
    });

    return {
        data,

        pagination: {
            page,
            limit,
            total: count,
            totalPages,
        },
    };
};

export const getProductBySlug = async (slug: string) => {
    const product = await Product.findOne({
        where: {
            slug,
        },

        attributes: [
            "id",
            "slug",
            "title",
            "description",
            "price",
            "stock",
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
                include: [
                    {
                        model: ProductImage,
                        as: "images",
                        attributes: [
                            "id",
                            "image_url",
                            "is_primary",
                        ],
                    },
                ],
            },
            {
                model: ProductImage,
                as: "images",
                attributes: [
                    "id",
                    "image_url",
                    "is_primary",
                ],
                where: {
                    variant_id: null,
                },
                required: false,
            },
        ],
    });

    if (!product) {
        throw new Error("Product not found");
    }

    return product;
};