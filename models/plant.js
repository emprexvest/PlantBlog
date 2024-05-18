// Import dependencies
const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);
const plantImageBasePath = 'uploads/plantImages';


// Define the mongoose schema for the Plant model
const plantSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    markdown: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    sanitizedHtml: {
        type: String,
        required: true,
    },
    imagePath: {
        type: String,
    },
    imageData: {
        type: Buffer,
    },
    imageType: {
        type: String,
    },
    thumbsUp: {
        type: Number,
        default: 0,
    },
    thumbsDown: {
        type: Number,
        default: 0,
    },
    // location: {
    //     type: String,
    //     emum: ["Point"],
    //     default: "Point",
    // },
    coordinates: { 
        type: [Number],
        default: [0, 0],
    }
});


// Pre-save middleware to automatically generate slug and santizedHtml fields
plantSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, {
            lower: true,
            strict: true 
        });
    }

    if (this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown));
    }

    next();
});


// Export the mongoose model for the 'Plant' collection
module.exports = mongoose.model('Plant', plantSchema);


// Export the plantImageBasePath for external use
module.exports.plantImageBasePath = plantImageBasePath;