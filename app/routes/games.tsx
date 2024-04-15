import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
  return json([
    { id: "1", name: "Pants" },
    { id: "2", name: "Jacket" },
  ]);
};

export default function Products() {
  const products = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
