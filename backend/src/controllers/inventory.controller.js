import Order from "../models/order.model.js";
import Product from "../models/product.model.js";


export const reduceStockOnOrder = async (orderId) => {
    try {
        const order = await Order.findById(orderId).populate("items.product");
        if (!order) throw new Error("Order not found");

        for (const item of order.items) {
            const product = item.product;
            const { size, colorName } = item.variant || {};

            if (size && colorName) {
                const stockItem = product.variants[0].stockBySizeColor.find(
                    s => s.size === size && s.colorName === colorName
                );
                if (!stockItem) throw new Error("Stock item not found");
                if (stockItem.stock < item.quantity)
                    throw new Error(`Insufficient stock for ${product.title} (${size}-${colorName})`);

                stockItem.stock -= item.quantity;
            } else {
                // fallback if variant not specified
                product.variants[0].stockBySizeColor[0].stock -= item.quantity;
            }

            await product.save();
        }
    } catch (error) {
        console.error("Error reducing stock on order:", error);
    }
};

// Increase stock on order cancel/refund
export const increaseStockOnCancel = async (orderId) => {
    try {
        const order = await Order.findById(orderId).populate("items.product");
        if (!order) throw new Error("Order not found");

        for (const item of order.items) {
            const product = item.product;
            const { size, colorName } = item.variant || {};

            if (size && colorName) {
                const stockItem = product.variants[0].stockBySizeColor.find(
                    s => s.size === size && s.colorName === colorName
                );
                if (!stockItem) continue;
                stockItem.stock += item.quantity;
            } else {
                product.variants[0].stockBySizeColor[0].stock += item.quantity;
            }

            await product.save();
        }
    } catch (error) {
        console.error("Error increasing stock on order cancel:", error);
    }
};

// Check stock before placing order (optional)
export const checkStockAvailability = async (cartItems) => {
    try {
        for (const item of cartItems) {
            const product = await Product.findById(item.product);
            if (!product) throw new Error("Product not found");

            const { size, colorName } = item.variant || {};
            let stockItem;

            if (size && colorName) {
                stockItem = product.variants[0].stockBySizeColor.find(
                    s => s.size === size && s.colorName === colorName
                );
            } else {
                stockItem = product.variants[0].stockBySizeColor[0];
            }

            if (!stockItem || stockItem.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.title}`);
            }
        }
    } catch (error) {
        console.error("Error checking stock availability:", error);
    }
};