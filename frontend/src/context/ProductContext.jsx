import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo
} from 'react';

const ProductContext = createContext();

const API_URL = '/api';

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search and Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 1000
  });
  const [sortBy, setSortBy] = useState('popular');

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const result = await response.json();

        const formattedProducts = result.data.map((product) => ({
          ...product,

          // Convert MySQL field names to frontend-friendly names
          price: Number(product.price),
          originalPrice: Number(product.original_price),
          rating: Number(product.rating),

          category: product.category_name,

          categorySlug: product.category_name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/&/g, 'and'),

          // Backend does not currently provide this field
          isNewArrival: false
        }));

        setProducts(formattedProducts);
      } catch (err) {
        console.error('Product API Error:', err);
        setError('Unable to load products from server.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const result = await response.json();

        setCategories(result.data);
      } catch (err) {
        console.error('Category API Error:', err);
      }
    };

    fetchCategories();
  }, []);

  
  // Search + Filter + Sort
const filteredProducts = useMemo(() => {
  const normalizedSearch = String(searchQuery || '').toLowerCase();
  const normalizedCategory = String(selectedCategory || 'all').toLowerCase();

  return products
    .filter((prod) => {
      const productName = String(prod.name || '').toLowerCase();
      const productDescription = String(prod.description || '').toLowerCase();
      const productCategory = String(prod.category || '').toLowerCase();
      const productCategorySlug = String(prod.categorySlug || '').toLowerCase();

      const matchesSearch =
        normalizedSearch === '' ||
        productName.includes(normalizedSearch) ||
        productDescription.includes(normalizedSearch) ||
        productCategory.includes(normalizedSearch);

      const matchesCategory =
        normalizedCategory === 'all' ||
        productCategory === normalizedCategory ||
        productCategorySlug === normalizedCategory;

      const minPrice = priceRange.min === '' ? 0 : Number(priceRange.min);
      const maxPrice = Number(priceRange.max);

      const matchesPrice =
        prod.price >= minPrice &&
        prod.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') {
        return a.price - b.price;
      }

      if (sortBy === 'price-high') {
        return b.price - a.price;
      }

      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }

      if (sortBy === 'newest') {
        return b.id - a.id;
      }

      // Popular
      return (
        b.rating * b.reviews -
        a.rating * a.reviews
      );
    });
}, [
  products,
  searchQuery,
  selectedCategory,
  priceRange,
  sortBy
]);

  const getProductById = (id) => {
    return products.find(
      (product) => String(product.id) === String(id)
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange({
      min: 0,
      max: 1000
    });
    setSortBy('popular');
  };

  // Add new product to backend
const addProduct = async (productData) => {
  try {
    const token = localStorage.getItem('shopsphere_token');

    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
     body: JSON.stringify({
  ...productData,
  category_id: getCategoryId(productData.category),
  original_price: productData.originalPrice
})
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create product');
    }

    const product = result.data;

    const formattedProduct = {
      ...product,
      price: Number(product.price),
      originalPrice: Number(product.original_price),
      rating: Number(product.rating),
      category: product.category_name,
      categorySlug: product.category_name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/&/g, 'and'),
      isNewArrival: false
    };

    setProducts((prevProducts) => [
      formattedProduct,
      ...prevProducts
    ]);

    return {
      success: true,
      product: formattedProduct
    };

  } catch (error) {
    console.error('Add Product API Error:', error);

    return {
      success: false,
      message: error.message
    };
  }
};

const getCategoryId = (categoryName) => {
  const category = categories.find(
    (item) =>
      item.name.toLowerCase() === categoryName.toLowerCase()
  );

  return category ? category.id : null;
};

// Update existing product in backend
const updateProduct = async (id, productData) => {
  try {
    const token = localStorage.getItem('shopsphere_token');

    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
  ...productData,
  category_id: getCategoryId(productData.category),
  original_price: productData.originalPrice
})
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update product');
    }

    const product = result.data;

    const formattedProduct = {
      ...product,
      price: Number(product.price),
      originalPrice: Number(product.original_price),
      rating: Number(product.rating),
      category: product.category_name,
      categorySlug: product.category_name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/&/g, 'and'),
      isNewArrival: false
    };

    setProducts((prevProducts) =>
      prevProducts.map((item) =>
        String(item.id) === String(id)
          ? formattedProduct
          : item
      )
    );

    return {
      success: true,
      product: formattedProduct
    };

  } catch (error) {
    console.error('Update Product API Error:', error);

    return {
      success: false,
      message: error.message
    };
  }
};

// Delete product from backend
const deleteProduct = async (id) => {
  try {
    const token = localStorage.getItem('shopsphere_token');

    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete product');
    }

    setProducts((prevProducts) =>
      prevProducts.filter(
        (product) => String(product.id) !== String(id)
      )
    );

    return {
      success: true,
      message: result.message
    };

  } catch (error) {
    console.error('Delete Product API Error:', error);

    return {
      success: false,
      message: error.message
    };
  }
};

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        filteredProducts,
        
        addProduct,
        updateProduct,
        deleteProduct,

        searchQuery,
        setSearchQuery,

        selectedCategory,
        setSelectedCategory,

        priceRange,
        setPriceRange,

        sortBy,
        setSortBy,

        loading,
        error,

        resetFilters,
        getProductById
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error(
      'useProducts must be used within a ProductProvider'
    );
  }

  return context;
};