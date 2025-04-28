import { motion } from "framer-motion";
import {
  FaUserPlus,
  FaTachometerAlt,
  FaLeaf,
  FaSeedling,
  FaShoppingCart,
  FaRobot,
} from "react-icons/fa"; // Added FaRobot for chatbot

const steps = [
  {
    title: "User Registration",
    icon: <FaUserPlus />,
    description: "Sign up to access features.",
  },
  {
    title: "Dashboard Access",
    icon: <FaTachometerAlt />,
    description: "Explore your personalized dashboard.",
  },
  {
    title: "Find Plant Disease",
    icon: <FaLeaf />,
    description: "Analyze plant diseases and get solutions.",
  },
  {
    title: "Buy Subscription",
    icon: <FaShoppingCart />,
    description: "Get access to advanced predictions.",
  },
  {
    title: "Chat with AI",
    icon: <FaRobot />,
    description: "Interact with our AI-powered chatbot for instant help.",
  },
];

export default function Timeline() {
  return (
    <div className="flex flex-col items-center w-full py-10 text-white">
      <h2 className="text-3xl font-bold mb-8">How It Works</h2>
      <div className="relative w-3/4 max-w-3xl">
        <div className="absolute left-1/2 w-1 bg-gray-600 h-full transform -translate-x-1/2"></div>
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.3 }}
            className={`flex items-center w-full mb-10 ${
              index % 2 === 0 ? "justify-start" : "justify-end"
            }`}
          >
            <div className="w-1/2 flex flex-col items-center text-center">
              <div
                className={`p-6 rounded-lg shadow-xl ${
                  step.title === "Chat with AI" ? "mb-12" : ""
                }`} // Add margin specifically to the Chatbot card
              >
                <div className="text-4xl mb-2 text-green-400">{step.icon}</div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-sm text-gray-300">{step.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
