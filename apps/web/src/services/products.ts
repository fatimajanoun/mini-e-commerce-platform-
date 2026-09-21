export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  stock:number;
}

export interface ProductImage {
  id: string;
  url: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  price: string;
  stock: number | null;
  image: ProductImage | null;
  variants: ProductVariant[];
}

export interface ProductPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  data: Product[];
  pagination: ProductPagination;
}

export interface ProductDetails {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: string;
  stock: number | null;
  images: ProductImage[];
  variants: ProductVariant[];
}

const API_URL = "http://localhost:3000";

export async function getProducts(
  page = 1,
  limit = 10,
): Promise<ProductsResponse> {
  const response = await fetch(
    `${API_URL}/products?page=${page}&limit=${limit}`,
    {
      credentials: "include",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch products");
  }

  return result;
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductDetails> {
  const response = await fetch(
    `${API_URL}/products/${slug}`,
    {
      credentials: "include",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch product",
    );
  }

  const product = result.product;

  return {
    ...product,

    images:
      product.images?.map((image: any) => ({
        id: image.id,
        url: image.image_url,
      })) ?? [],
  };
}