const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Menu item name is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      validate: {
        validator: function(value) {
          return value > 0;
        },
        message: 'Price must be greater than 0'
      }
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Appetizers', 'Mains', 'Desserts', 'Drinks'],
        message: 'Category must be one of: Appetizers, Mains, Desserts, Drinks'
      }
    },
    image: {
      type: String,
      required: [true, 'Image URL is required']
    },
    available: {
      type: Boolean,
      default: true
    },
    prepTime: {
      type: Number,
      default: 20,
      min: [5, 'Prep time must be at least 5 minutes'],
      max: [120, 'Prep time cannot exceed 120 minutes']
    },
    spicyLevel: {
      type: String,
      enum: {
        values: ['Mild', 'Medium', 'Spicy'],
        message: 'Spicy level must be Mild, Medium, or Spicy'
      },
      default: 'Medium'
    },
    isVegetarian: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
