import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["home", "work", "other"],
        default: "home",
    },

    label: {
        type: String,
        trim: true,
        default: "",
    },

    fullName: {
        type: String,
        required: true,
        trim: true,
    },

    phone: {
        type: String,
        required: true,
        trim: true,
        match: [/^[6-9]\d{9}$/, "Invalid phone number"],
    },

    addressLine1: {
        type: String,
        required: true,
        trim: true,
    },

    addressLine2: {
        type: String,
        trim: true,
        default: "",
    },

    city: {
        type: String,
        required: true,
        trim: true,
    },

    state: {
        type: String,
        required: true,
        trim: true,
    },

    pincode: {
        type: String,
        required: true,
        match: [/^\d{6}$/, "Invalid pincode"],
    },

    country: {
        type: String,
        default: "India",
    },

    isDefault: {
        type: Boolean,
        default: false,
    },
},
    {
        timestamps: true,
        _id: true,
    });


const cartItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        quantity: {
            type: Number,
            default: 1,
            min: 1,
        },

        // snapshot of product at time of add-to-cart
        productSnapshot: {
            title: String,
            slug: String,
            defaultImage: String,
            brand: String,
            category: String,

            variant: {
                sku: String,
                price: Number,
                discountedPrice: Number,
            },

            size: String,

            color: {
                name: String,
                hexCode: String,
            },
        },
    },
    {
        _id: false,
    }
);


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
            default: "",
            match: [
                /^[6-9]\d{9}$/,
                "Please enter a valid 10-digit phone number",
            ],
        },
        password: {
            type: String,
            required: function () {
                return !this.googleId; // no password if logging in with Google
            },
            minlength: [6, "Password must be at least 6 characters long"],
        },
        googleId: {
            type: String,
            default: null,
        },

        avatar: {
            type: String,
            default: "",
        },

        addresses: [addressSchema],
        cartItems: [cartItemSchema],
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        ],
        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        otp: String,
        otpExpires: Date,
    },
    { timestamps: true }
);


// Pre-save hook to hash password before saving to database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        // next();
    } catch (error) {
        // next(error);
        console.log("Error hashing password", error.message);
    }
});

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;