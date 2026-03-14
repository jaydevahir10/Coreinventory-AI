import { useState } from "react";
import axios from "axios";

function AddProduct() {

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    await axios.post(
      "http://localhost:5000/api/products",
      { name, quantity }
    );

    alert("Product Added");

    setName("");
    setQuantity("");
  };

  return (

    <div className="ml-72 p-10">

      <h1 className="text-2xl mb-6">
        Add Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-80"
      >

        <input
          className="border p-2 rounded"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button className="bg-blue-500 text-white p-2 rounded">
          Add Product
        </button>

      </form>

    </div>
  );
}

export default AddProduct;