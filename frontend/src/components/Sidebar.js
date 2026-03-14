import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-6 fixed">

      <h1 className="text-2xl font-bold mb-8">
        CoreInventory AI
      </h1>

      <div className="flex flex-col gap-4">

        <Link to="/" className="hover:text-blue-400">
          Dashboard
        </Link>

        <Link to="/add" className="hover:text-blue-400">
          Add Product
        </Link>

        <Link to="/stock" className="hover:text-blue-400">
          Inventory
        </Link>

      </div>

    </div>
  );
}

export default Sidebar;