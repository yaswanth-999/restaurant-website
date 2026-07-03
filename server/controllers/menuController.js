const MenuItem = require('../models/MenuItem');

// Get all menu items or filter by category
exports.getAllMenuItems = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// Get single menu item
exports.getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// Create menu item (admin only)
exports.createMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, category, prepTime, spicyLevel, isVegetarian } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const menuItem = await MenuItem.create({
      name,
      description,
      price: parseFloat(price),
      category,
      image: imageUrl,
      prepTime: prepTime ? parseInt(prepTime) : 20,
      spicyLevel: spicyLevel || 'Medium',
      isVegetarian: isVegetarian === 'true' || isVegetarian === true
    });

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};

// Update menu item (admin only)
exports.updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, available, prepTime, spicyLevel, isVegetarian } = req.body;

    const updateData = {
      name,
      description,
      price: parseFloat(price),
      category,
      available,
      prepTime: prepTime ? parseInt(prepTime) : undefined,
      spicyLevel,
      isVegetarian
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const menuItem = await MenuItem.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};

// Delete menu item (admin only)
exports.deleteMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};

// Get menu categories with item count
exports.getMenuCategories = async (req, res, next) => {
  try {
    const categories = await MenuItem.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};
