const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    Size: {
        type: String,
        required: true
    },
    carouselImages: [{
        type: String,
        required :true
    }]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
