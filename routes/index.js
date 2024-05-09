var express = require('express');
const { isAuthenticated, userHasStore } = require('../middleware/auth');
const Product = require("../model/product");
const Category = require('../model/category');
const Order = require('../model/order-history')
const About = require('../model/Pages/About')
const csrf = require('csurf');
const shippingAdressModel = require('../model/shipping-address');
const Artist = require('../model/artistSchema');
const productCatergoryMain = require('../model/productMainCategory');
const productSubCatergoryMain = require('../model/productmainSubCategoruy');
const HomeSiteModel = require('../model/Site/HomeSite');
const ProductMockup = require('../model/productMockup');
const bankAccount = require('../model/bankAccount')
const whishListSchema = require('../model/Site/whislist')
const Cart = require("../model/cart");
const StoreInfo = require("../model/storeInfo");
const StoreProduct = require('../model/storeProduct')
const countries = require('../model/country');
const stateData = require('../model/Site/state');
const AuthModel = require('../model/auth');
const ArtistSchema = require('../model/artistSchema');
const designModel = require('../model/Site/CheckDesign');
const bankModel = require('../model/bankAccount');
const desigModel = require('../model/Pages/designModelSchema');
const couponDesign = require('../model/Site/coupon');
const DesignAlbum = require('../model/Site/albumModel');

var router = express.Router();
const csrfProtection = csrf({ cookie: true });


// =========== FRONT END =================

router.get('/', async function (req, res, next) {
  const productData = await Product.find();
  const getAllArtist = await Artist.find().populate("userId");
  const categoryData = await Category.find();
  const subCategory = await productSubCatergoryMain.find();
  const originalproduct = await StoreProduct.find().populate('productId');
  const whishList = await whishListSchema.find().populate('user').populate('whishList');

  // Create a map of product _ids and their corresponding original collection ids for faster lookup
  const productMap = {};
  originalproduct.forEach(item => {
    productMap[item._id.toString()] = item; // Store the product item itself
  });

  // Create a map of wishlist _ids and their corresponding collection ids for faster lookup
  const whishListMap = {};
  whishList.forEach(item => {
    whishListMap[item.whishList._id.toString()] = item.whishList; // Store the wishlist item itself
  });

  // Add whishList field and whishListCollectionId to each product in originalproduct
  const updatedProductData = originalproduct.map(product => {
    const whishListItem = whishListMap[product._id.toString()];
    const isWhishListed = !!whishListItem; // Check if wishlist item is found
    return { ...product.toObject(), whishList: isWhishListed, whishListCollectionId: whishListItem };
  });

  console.log(updatedProductData);
  // Now updatedProductData contains originalproduct items with additional fields whishList and whishListCollectionId



  const homeSite = await HomeSiteModel.find({ homeId: 'homepage' });
  console.log(homeSite[0])
  productData.forEach(async (product) => {
    // Generate slug from the name field (you might want to customize this as per your requirements)
    const slug = product.productName.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');

    // Update the product with the generated slug
    await Product.findByIdAndUpdate(product._id, { slug: slug }, { new: true });
  });



  console.log(originalproduct)

  // console.log(productData)
  res.render('frontend/index', { title: 'Express', originalproduct: updatedProductData, categoryData: categoryData, subCategory, homeSite: homeSite, productData: productData, getAllArtist: getAllArtist });
});

router.get('/about', async function (req, res, next) {
  const AboutPage = await About.find();
  res.render('frontend/about', { title: 'Express', AboutPage });
});

router.get('/cart', isAuthenticated, async function (req, res, next) {
  const userId = req.cookies.user._id;

  try {
    const allCarts = await Cart.find({ user: userId }).populate('user').populate({
      path: 'product',
      populate: {
        path: 'productId',
      }
    });

    const updatedCarts = allCarts.map(cart => {
      const designPrice = +cart.product.designPrice;
      const basePrice = +cart.product.productId.pdocutBasePrice;
      const totalPrice = (designPrice + basePrice) * cart.quantity;
      return { ...cart.toObject(), totalPrice };
    });

    const totalPriceVal = updatedCarts.reduce((acc, curr) => acc + curr.totalPrice, 0);

    res.render('frontend/cart', { title: 'Express', allCarts: updatedCarts, totalPriceVal });
  } catch (err) {
    next(err);
  }
});


router.get('/checkout-success', function (req, res, next) {
  res.render('frontend/checkout-success', { title: 'Express' });
});

router.get('/checkout', csrfProtection, async function (req, res, next) {
  const userId = req.cookies.user._id;
  const userData = req.cookies.user;
  const countriesData = await countries.find().sort({ countryName: 1 });
  const allCarts = await Cart.find({ user: userId }).populate('user').populate({
    path: 'product',
    populate: {
      path: 'productId',
    }
  });

  const updatedCarts = allCarts.map(cart => {
    const designPrice = +cart.product.designPrice;
    const basePrice = +cart.product.productId.pdocutBasePrice;
    const totalPrice = (designPrice + basePrice) * cart.quantity;
    return { ...cart.toObject(), totalPrice };
  });

  const totalPriceVal = updatedCarts.reduce((acc, curr) => acc + curr.totalPrice, 0);
  res.render('frontend/checkout', { title: 'Express', userData, countriesData, errors: null, updatedCarts, totalPriceVal, csrfToken: req.csrfToken() });
});

router.get('/edit', function (req, res, next) {
  res.render('frontend/edit', { title: 'Express' });
});


router.get('/contact', csrfProtection, function (req, res, next) {
  res.render('frontend/contact', { title: 'Express', success: "", error: "", csrfToken: req.csrfToken() });
});

router.get('/marketplace-artist', async function (req, res, next) {
  const PAGE_SIZE = 3;
  let query = {};

  if (req.query.search) {
    // If search query is provided, construct a regex pattern to match artist names
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    query = { "name": regex }; // Modify the query to filter by artist name
  }

  // Fetch total number of artists matching the search criteria
  const totalArtists = await Artist.countDocuments(query);
  const totalPages = Math.ceil(totalArtists / PAGE_SIZE);

  // Fetch artists for the current page and search criteria
  const currentPage = parseInt(req.query.page) || 1;
  const artists = await Artist.find(query)
    .skip((currentPage - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE);

  res.render('frontend/marketplace-artist', { title: 'Express', artist: artists, totalPages, currentPage });
});

// Function to escape special characters for regex
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


router.get('/marketplace-design', async function (req, res, next) {
  try {
    let query = {};
    const searchQuery = req.query.search;
    if (searchQuery) {
      query = { title: { $regex: new RegExp(searchQuery, 'i') } };
    }

    const perPage = 3; // Number of items per page
    const page = parseInt(req.query.page) || 1; // Current page number
    const totalItems = await desigModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / perPage);

    const ProductData = await desigModel.find(query)
      .skip((perPage * page) - perPage)
      .limit(perPage);

    res.render('frontend/marketplace-design', {
      title: 'Express',
      ProductData: ProductData,
      currentPage: page,
      totalPages: totalPages,
      searchQuery: searchQuery // Pass the search query to the view
    });
  } catch (err) {
    next(err);
  }
});


const PAGE_SIZE_MARKET_PLACE = 3; // Number of items per page

router.get('/marketplace', async function (req, res, next) {
  const page = parseInt(req.query.page) || 1;
  const pageSize = PAGE_SIZE_MARKET_PLACE;
  const query = {}; // Include productType condition
  let sortQuery = {};

  try {
    // Fetch categories
    const CategoryData = await Category.find();
    const subCategory = await productSubCatergoryMain.find();

    // Handle sorting
    if (req.query.sorting === 'popularity') {
      sortQuery = { popularity: -1 };
    } else if (req.query.sorting === 'latest') {
      sortQuery = { createdAt: -1 };
    } else if (req.query.sorting === 'lowToHigh') {
      sortQuery = { salePrice: 1 };
    } else if (req.query.sorting === 'highToLow') {
      sortQuery = { salePrice: -1 };
    }

    // Modify query to include search term if provided
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    // Handle artist filter if provided
    if (req.query.artist) {
      const artistId = req.query.artist;
      const artistProducts = await StoreProduct.find({ userId: artistId }).populate('userId');
      const matchedProductIds = artistProducts.map(product => product._id); // Assuming productId is the correct field
      query._id = { $in: matchedProductIds }; // Modify this line if productId is different
    }

    const totalProductsCount = await StoreProduct.countDocuments(query);
    const totalPages = Math.ceil(totalProductsCount / pageSize);
    const skip = (page - 1) * pageSize;
    const ProductData = await StoreProduct.find(query).sort(sortQuery).skip(skip).limit(pageSize).exec();
    const whishList = await whishListSchema.find().populate('user').populate('whishList');
    const whishListMap = {};
    whishList.forEach(item => {
      whishListMap[item.whishList._id.toString()] = item._id; // Store the wishlist item's collection id
    });

    // Add whishList field and whishListCollectionId to each item in ProductData
    const updatedProductData = ProductData.map(product => {
      const whishListFoundId = whishListMap[product._id.toString()];
      const isWhishListed = !!whishListFoundId; // Check if wishlist item is found
      return { ...product.toObject(), whishList: isWhishListed, whishListCollectionId: whishListFoundId };
    });

    console.log(updatedProductData);

    res.render('frontend/marketplace', {
      title: 'Express',
      ProductData: updatedProductData,
      currentPage: page,
      totalPages: totalPages,
      CategoryData: CategoryData,
      subCategory: subCategory
    });
  } catch (err) {
    next(err);
  }
});






router.get('/product-detail/:id', csrfProtection, async function (req, res, next) {
  try {
    const { id } = req.params;

    // Retrieve the product details by ID and populate related data
    const product = await StoreProduct.findById(id).populate('productId');

    // Retrieve wishlist data
    const whishList = await whishListSchema.find().populate('user').populate('whishList');

    // Create a map of product _id and its corresponding original collection id for faster lookup
    const productMap = {};
    productMap[product._id.toString()] = product; // Store the product item itself

    // Create a map of wishlist _ids and their corresponding collection ids for faster lookup
    const whishListMap = {};
    whishList.forEach(item => {
      whishListMap[item.whishList._id.toString()] = item.whishList; // Store the wishlist item itself
    });

    // Check if the product exists
    if (!product) {
      // Handle case where product is not found
      return res.status(404).send('Product not found');
    }

    // Retrieve the wishlist collection for the product
    const whishListItem = whishListMap[product._id.toString()];

    // Check if the product is in the wishlist
    const isWhishListed = !!whishListItem; // Check if wishlist item is found

    console.log(whishListItem)
    console.log(isWhishListed)

    // Render the product detail view with the product and wishlist information
    res.render('frontend/product-detail', {
      title: 'Express',
      product: product,
      whishList: isWhishListed, // Pass whether the product is in the wishlist
      whishListCollection: whishListItem, // Pass the wishlist collection if the product is in the wishlist
      csrfToken: req.csrfToken()
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



router.get('/desgin-detail/:id', csrfProtection, async function (req, res, next) {
  const { id } = req.params;
  console.log(id)
  const product = await desigModel.findById(id);
  console.log(product)
  res.render('frontend/design-preview', { title: 'Express', product: product, csrfToken: req.csrfToken() });
});

router.get('/wishlist', isAuthenticated, async function (req, res, next) {
  const userId = req.cookies.user._id;
  const whishList = await whishListSchema.find({ user: userId }).populate('user').populate('whishList');
  console.log(whishList)
  res.render('frontend/wishlist', { title: 'Express', whishList });
});
// =========== FRONT END =================

// =========== SELLER DASHBOARD  END =================
router.get('/seller', isAuthenticated, function (req, res, next) {
  res.render('Seller/index', { title: 'Express' });
});

router.get('/album', async function (req, res, next) {
  const userId = req.cookies.user._id;

  const designAlbum = await DesignAlbum.find({ userId: userId });


  res.render('Seller/album', { title: 'Express',designAlbum });
});

router.get('/artist-info', async function (req, res, next) {

  const userId = req.cookies.user._id;

  const ArtistModel = await ArtistSchema.findOne({ userId });



  res.render('Seller/artist-info', { title: 'Express', ArtistModel });
});
router.get('/create-album', async function (req, res, next) {
  const userId = req.cookies.user._id;
  console.log(userId)
  const designs = await desigModel.find({ userUniqueId: userId }).populate('userId').populate('productId');


  console.log(designs)


  res.render('Seller/create-album', { title: 'Express', designs });
});


router.get('/edit_album/:id', async function (req, res, next) {
  const { id } = req.params;
  const singleAlbum = await DesignAlbum.findById(id);
  console.log(singleAlbum)
  res.render('Seller/edit_album', { title: 'Express',singleAlbum });
});

router.get('/upload', isAuthenticated, async function (req, res, next) {
  const allProduct = await Product.find();
  const currentShop = req.query.category;
  const MocuckUp = await ProductMockup.find();
  res.render('Seller/upload', { title: 'Express', allProduct: allProduct, currentShop, MocuckUp });
});

router.get('/upload-v2', isAuthenticated, async function (req, res, next) {

  const userId = req.cookies.user._id;

  const allProduct = await Product.find();
  const MocuckUp = await ProductMockup.find();
  const deisgnis = await designModel.find();
  const artistData = await Artist.find({ userId: userId })
  // console.log(artistData)


  const currentShop = req.query.category;
  const designUpload = req.query.designUpload;
  const design_upload = req.query.design_upload;

  console.log(design_upload)

  if (artistData.length == 0) {
    res.redirect('/artist-info')
  }


  res.render('Seller/uploade-v2', { title: 'Express', artistData, design_upload, allProduct: allProduct, MocuckUp, currentShop, designUpload });
});

router.get('/order-history', async function (req, res, next) {
  const OrderData = await Order.find({ userId: "432342142342423" })
  res.render('Seller/order-history', { title: 'Express', OrderData: OrderData });
});

router.get('/setting', async function (req, res, next) {
  const currentActiveUser = req.cookies.user;
  console.log(currentActiveUser)
  const bankAccountModel = await bankAccount.find({ userId: currentActiveUser._id }).populate('userId');
  const AuthUser = await AuthModel.find({ _id: currentActiveUser._id })
  const countryData = await countries.find().sort({ countryName: 1 })
  console.log(AuthUser)

  res.render('Seller/setting', { title: 'Express', countryData, AuthUser, currentActiveUser, bankAccountModel, });
});

router.get('/shipping-add', async function (req, res, next) {
  const userId = req.cookies.user._id;
  const shippingAdress = await shippingAdressModel.findOne({ userId });
  const countryInfo = await countries.find().sort({ countryName: 1 });
  const stateModel = await stateData.find().sort({ stateName: 1 });
  console.log(shippingAdress)

  res.render('Seller/shipping-add', { title: 'Express', shippingAdress, stateModel, countryInfo });
});
router.get('/store-detail', async function (req, res, next) {

  const userID = req.cookies.user._id;
  const storeInfo = await StoreInfo.find({ userid: userID });
  console.log(storeInfo)


  res.render('Seller/store-detail', { title: 'Express', storeInfo: storeInfo[0] });
});

router.get('/watermarking', function (req, res, next) {
  res.render('Seller/watermarking', { title: 'Express' });
});

router.get('/login', function (req, res, next) {


  res.render('Seller/login', { title: 'Express' });
});


router.get('/forgot-password', function (req, res, next) {


  res.render('Seller/forgot-password', { title: 'Express' });
});







router.get('/signup', async function (req, res, next) {
  const countryData = await countries.find().sort({ countryName: 1 });
  res.render('Seller/signup', { title: 'Express', countryData: countryData });
});

// =========== SELLER DASHBOARD  END =================






router.get('/admin', function (req, res, next) {
  res.render('admin/index', { title: 'Express' });
});


router.get('/admin-marketplace', async function (req, res, next) {
  const originalproduct = await StoreProduct.find().populate('productId');
  res.render('admin/marketplace', { originalproduct });
});


router.get('/bank-account', async function (req, res, next) {
  const bankAccount = await bankModel.find().populate('userId');
  console.log(bankAccount)
  res.render('admin/bank-account', { bankAccount });
});

router.get('/product-preview/:id', async function (req, res, next) {
  const { id } = req.params;
  const originalproduct = await StoreProduct.find({ _id: id }).populate('productId');
  console.log(originalproduct)
  res.render('admin/product-preview', { originalproduct: originalproduct[0] });
});




router.get('/store', async function (req, res, next) {

  const infoStore = await StoreInfo.find();



  res.render('admin/store', { title: 'Express', storeInfo: infoStore });
});


router.get("/store-info/:storeName", async function (req, res) {

  const { storeName } = req.params;
  const infoStore = await StoreInfo.find({ storeName: storeName });
  console.log(infoStore)
  res.render('admin/store-detail', { title: 'Express', infoStore });
})


router.get('/shipping-adress', async function (req, res, next) {
  const shippingData = await shippingAdressModel.find().sort({ createdAt: -1 });;
  console.log(shippingData)
  res.render('admin/shipping-adress', { title: 'Express', shippingData: shippingData });
});

router.get('/category', async function (req, res, next) {
  const categories = await Category.find();
  console.log(categories)
  res.render('admin/category', { title: 'Express', categories });
});
router.get('/order', async function (req, res, next) {
  const orderData = await Order.find();
  res.render('admin/order', { title: 'Express', orderData: orderData });
});

router.get('/sub-category', function (req, res, next) {
  res.render('admin/sub-category', { title: 'Express' });
});

router.get('/admin-about', function (req, res, next) {
  res.render('admin/about', { title: 'Express' });
});

router.get('/product', csrfProtection, async function (req, res, next) {
  const categoryMain = await productCatergoryMain.find();
  const Mockup = await ProductMockup.find();

  res.render('admin/product', { title: 'Express', Mockup, categoryMain: categoryMain, csrfToken: req.csrfToken() });
});



router.get('/admin-product-detail/:id', async (req, res) => {
  const { id } = req.params;
  const Mockup = await ProductMockup.find({ _id: id });
  console.log(Mockup)
  res.render('admin/productDetail', { singleProduct: Mockup, })
})


router.get('/users', function (req, res, next) {
  res.render('admin/users', { title: 'Express' });
});

router.get('/coupon', async function (req, res, next) {
  const coupon = await couponDesign.find();

  res.render('admin/coupon', { title: 'Express', coupon });
});

router.get('/edit-product/:id', async function (req, res, next) {
  const { id } = req.params;
  const Mockup = await ProductMockup.find({ _id: id });
  console.log(Mockup)
  res.render('admin/edit-product', { title: 'Express', Mockup });
});

router.get('/site', async function (req, res, next) {
  const homeSite = await HomeSiteModel.find({ homeId: 'homepage' });
  console.log(homeSite[0])
  res.render('admin/site', { title: 'Express', homeSite: homeSite[0] });
});

router.get('/product-categories', csrfProtection, async function (req, res, next) {
  const categoryMain = await productCatergoryMain.find();
  const subCategory = await productSubCatergoryMain.find();
  res.render('admin/product-categories', { title: 'Express', subCategory: subCategory, categoryMain: categoryMain, csrfToken: req.csrfToken() });
});

router.get('/sign-in', function (req, res, next) {
  res.render('admin/sign-in', { title: 'Express' });
});

router.get('/sign-up', function (req, res, next) {
  res.render('admin/sign-up', { title: 'Express' });
});

module.exports = router;
