import { useEffect, useState } from "react";
import { getAllProducts } from "../services/productsService";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await getAllProducts();
    setProducts(data.products);
  };

  return (
    <div className="product-list">
      {products.map((p) => (
        <div key={p.id_producto} className="card">
          <h3>{p.nombre}</h3>
          <p>{p.descripcion}</p>
          <small>Stock: {p.stock_total}</small>
        </div>
      ))}
    </div>
  );
}
