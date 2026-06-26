const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Fetch all products with filters, sorting, and pagination
// @route   GET /api/v1/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit) || 12;
    const page = parseInt(req.query.page) || 1;

    // Build Query
    const query = { isActive: true };

    // 1. Keyword search
    if (req.query.keyword) {
      query.name = { $regex: req.query.keyword, $options: 'i' };
    }

    // 2. Category filter
    if (req.query.category) {
      // If it's a slug, we need to find the category ID first
      const cat = await Category.findOne({ 
        $or: [{ slug: req.query.category }, { _id: req.query.category }] 
      });
      if (cat) {
        query.category = cat._id;
      }
    }

    // 3. Featured filter
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }

    // 4. Price filters
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // 5. Colors filter
    if (req.query.colors) {
      query.colors = { $in: req.query.colors.split(',') };
    }

    // 6. Sizes filter
    if (req.query.sizes) {
      query.sizes = { $in: req.query.sizes.split(',') };
    }

    // 7. Fabric filter
    if (req.query.fabric) {
      query.fabric = { $regex: req.query.fabric, $options: 'i' };
    }

    // Build Sort
    let sortObj = { createdAt: -1 }; // newest by default
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc':
          sortObj = { price: 1 };
          break;
        case 'price_desc':
          sortObj = { price: -1 };
          break;
        case 'bestseller':
          sortObj = { soldCount: -1 };
          break;
        default:
          sortObj = { createdAt: -1 };
      }
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort(sortObj)
      .lean();

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
      hasMore: page * pageSize < count
    });
  } catch (error) {
    console.error('getProducts Error:', error);
    res.status(500).json({ message: 'Server Error fetching products' });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/v1/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name' }
      });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Fetch single product by slug
// @route   GET /api/v1/products/slug/:slug
// @access  Public
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category', 'name slug')
      .populate({
        path: 'reviews',
        match: { isApproved: true },
        populate: { path: 'user', select: 'name' }
      });

    if (product && product.isActive) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found or inactive' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all products for admin (including drafts/inactive)
// @route   GET /api/v1/products/admin
// @access  Private/Admin
const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a product
// @route   POST /api/v1/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, price, description, images, category, stock, colors, sizes, fabric, tags, isFeatured, isActive } = req.body;
    
    // Auto-generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const product = new Product({
      name,
      slug,
      price,
      description: description || '',
      images: images || [],
      category,
      stock: stock || 0,
      colors: colors || [],
      sizes: sizes || [],
      fabric: fabric || '',
      tags: tags || [],
      isFeatured: isFeatured || false,
      isActive: isActive !== undefined ? isActive : true,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, price, description, images, category, stock, colors, sizes, fabric, tags, isFeatured, isActive, slug } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.slug = slug || product.slug;
      product.price = price !== undefined ? price : product.price;
      product.description = description || product.description;
      product.images = images || product.images;
      product.category = category || product.category;
      product.stock = stock !== undefined ? stock : product.stock;
      product.colors = colors || product.colors;
      product.sizes = sizes || product.sizes;
      product.fabric = fabric || product.fabric;
      product.tags = tags || product.tags;
      product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isActive = isActive !== undefined ? isActive : product.isActive;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getAdminProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
};
