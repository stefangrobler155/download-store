// src/utils/wishlist.js

export const getWishlist = () => {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
};

export const addToWishlist = (product) => {
  const wishlist = getWishlist();
  if (!wishlist.find((item) => item.id === product.id)) {
    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }
  return wishlist;
};

export const removeFromWishlist = (productId) => {
  let wishlist = getWishlist();
  wishlist = wishlist.filter((item) => item.id !== productId);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  return wishlist;
};

export const isInWishlist = (productId) => {
  const wishlist = getWishlist();
  return wishlist.some((item) => item.id === productId);
};
