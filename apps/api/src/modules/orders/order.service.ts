import sequelize from "../../db/index.js";

import Cart from "../../db/models/Cart.js";
import CartItem from "../../db/models/CartItem.js";
import Order from "../../db/models/Order.js";
import OrderItem from "../../db/models/OrderItem.js";
import Product from "../../db/models/Product.js";
import Variant from "../../db/models/Variant.js";

import {
    CreateOrderInput,
} from "./order.schema.js";

import {
    SHIPPING_FEE,
} from "../../config/order.js";

export const createOrder = async (
    userId: string,
    data: CreateOrderInput,
) => {
    const transaction = await sequelize.transaction();

    try {
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

                            attributes: [
                                "id",
                                "title",
                                "price",
                            ],
                        },

                        {
                            model: Variant,
                            as: "variant",
                            required: false,

                            attributes: [
                                "id",
                                "name",
                                "value",
                                "price",
                            ],
                        },
                    ],
                },
            ],

            transaction,
        });

        if (!cart) {
            throw new Error("Cart not found");
        }

        const cartData = cart.toJSON() as any;

        if (
            !cartData.items ||
            cartData.items.length === 0
        ) {
            throw new Error("Cart is empty");
        }

        let subtotal = 0;

        const orderItems = cartData.items.map(
            (item: any) => {
                const unitPrice = Number(
                    item.variant?.price ??
                    item.product.price
                );

                const itemSubtotal =
                    unitPrice * item.quantity;

                subtotal += itemSubtotal;

                return {
                    product_id: item.product_id,
                    variant_id: item.variant_id ?? null,

                    product_title:
                        item.product.title,

                    variant_name:
                        item.variant
                            ? `${item.variant.name}: ${item.variant.value}`
                            : null,

                    unit_price: unitPrice,

                    quantity: item.quantity,

                    subtotal: itemSubtotal,
                };
            },
        );

        const totalAmount =
            subtotal + SHIPPING_FEE;

        const order = await Order.create(
            {
                user_id: userId,
                subtotal,
                shipping_fee: SHIPPING_FEE,
                total_amount: totalAmount,
                status: "confirmed",
                name: data.name,
                phone: data.phone,
                address: data.address,
                city: data.city,
            },
            {
                transaction,
            },
        );

        const orderData = order.toJSON() as any;

        await OrderItem.bulkCreate(
            orderItems.map((item: any) => ({
                order_id: orderData.id,

                product_id: item.product_id,
                variant_id: item.variant_id,

                product_title: item.product_title,
                variant_name: item.variant_name,

                unit_price: item.unit_price,
                quantity: item.quantity,
                subtotal: item.subtotal,
            })),

            {
                transaction,
            },
        );

        await CartItem.destroy({
            where: {
                cart_id: cartData.id,
            },

            transaction,
        });

        await transaction.commit();

        return {
            id: orderData.id,

            status: orderData.status,

            items: orderItems,

            subtotal,

            shipping_fee: SHIPPING_FEE,

            total_amount: totalAmount,

            name: orderData.name,
            phone: orderData.phone,
            address: orderData.address,
            city: orderData.city,

            created_at: orderData.created_at,
        };
    } catch (error) {
        await transaction.rollback();

        throw error;
    }
};