import { motion } from "framer-motion";

function DashboardCards() {

  const cards = [
    { title: "Total Products", value: 25 },
    { title: "Low Stock", value: 4 },
    { title: "AI Demand", value: "High" }
  ];

  return (
    <div className="grid grid-cols-3 gap-6 mt-6">

      {cards.map((card, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.05 }}
          className="bg-white shadow-lg rounded-xl p-6"
        >
          <h2 className="text-gray-500">{card.title}</h2>

          <p className="text-3xl font-bold">
            {card.value}
          </p>
        </motion.div>
      ))}

    </div>
  );
}

export default DashboardCards;