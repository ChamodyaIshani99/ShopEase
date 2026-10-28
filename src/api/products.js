const BASE = 'https://fakestoreapi.com';

export const fetchProducts = async () => {
  const res = await fetch(`${BASE}/products`);
  if (!res.ok) throw new Error('Failed to load products');
  return res.json();
};

export const fetchCategories = async () => {
  const res = await fetch(`${BASE}/products/categories`);
  if (!res.ok) throw new Error('Failed to load categories');
  return res.json();
};