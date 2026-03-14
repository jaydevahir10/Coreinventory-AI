import { useEffect, useState } from "react";
import axios from "axios";

function Stock() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {

    const res = await axios.get(
      "http://localhost:5000/api/products"
    );

    setProducts(res.data);
  };

  return (

    <div className="ml-72 p-10">

      <h1 className="text-2xl mb-6">
        Inventory
      </h1>

      <table className="w-full border">

        <thead>

          <tr className="bg-gray-200">

            <th className="p-2">ID</th>
            <th className="p-2">Product</th>
            <th className="p-2">Quantity</th>

          </tr>

        </thead>

        <tbody>

          {products.map((p) => (

            <tr key={p.id}>

              <td className="p-2">{p.id}</td>
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.quantity}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}

export default Stock;