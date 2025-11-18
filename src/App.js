import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

const cardImages = {
  diamante: "♦️",
  corazón: "♥️",
  trébol: "♣️",
  pica: "♠️",
};



function App() {
  const [cards, setCards] = useState([]);
  const [number, setNumber] = useState("");
  const [suit, setSuit] = useState("diamante");
  const [message, setMessage] = useState("");

  const handleAddCard = () => {
    if (number.trim() === "") return;
    setCards([...cards, { number, suit }]);
    setNumber("");
  };

  const handleRemoveCard = (index) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const validateGame = async () => {
  console.log("🔵 validateGame called");
  
  setMessage(""); 

  if (cards.length < 9) {
    console.log("❌ No hay suficientes cartas:", cards.length);
    setMessage("Se requieren al menos 9 cartas");
    return;
  }

  console.log("🟢 Cartas presentes:", cards);

  const groupedByNumber = {};
  const groupedBySuit = {};

  cards.forEach((card) => {
    groupedByNumber[card.number] = (groupedByNumber[card.number] || 0) + 1;
    if (!groupedBySuit[card.suit]) groupedBySuit[card.suit] = [];
    groupedBySuit[card.suit].push(parseInt(card.number));
  });

  console.log("🔧 groupedByNumber:", groupedByNumber);
  console.log("🔧 groupedBySuit:", groupedBySuit);

  const hasTrio = Object.values(groupedByNumber).some(count => count >= 3);
  console.log("🟡 Tiene trío:", hasTrio);

  let scaleCount = 0;
  for (const suit in groupedBySuit) {
    const nums = groupedBySuit[suit].sort((a, b) => a - b);
    let seq = 1;
    for (let i = 1; i < nums.length; i++) {
      if (nums[i] === nums[i - 1] + 1) {
        seq++;
        if (seq === 3) {
          scaleCount++;
          seq = 1; 
        }
      } else {
        seq = 1;
      }
    }
  }

  console.log("🟢 Escalas detectadas:", scaleCount);

  if (hasTrio && scaleCount >= 2) {
    console.log("🎉 Jugada válida detected");

    try {
      const ref = collection(db, "jugadascarioca");
      await addDoc(ref, { jugada: cards, fecha: new Date().toLocaleString() });
      console.log("🟢 Jugada guardada en Firebase");
      setMessage("¡JUEGO VÁLIDO (2 ESCALAS Y 1 TRÍO)! 🎉");
    } catch (err) {
      console.error("❌ Error al guardar:", err);
      setMessage("Error al guardar jugada");
    }
  } else {
    console.log("❌ No es jugada válida");
    setMessage("NO FORMA JUEGO CARIÓCA :C");
  }
};


  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Juego de Carioca</h1>

      <div>
        <input
          type="text"
          placeholder="Número"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <select value={suit} onChange={(e) => setSuit(e.target.value)}>
          {Object.keys(cardImages).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <motion.button whileTap={{ scale: 0.9 }} onClick={handleAddCard}>
          Agregar
        </motion.button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <AnimatePresence>
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: 100 }}
              style={{
                display: "inline-block",
                margin: "10px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                position: "relative",
                fontSize: "24px",
              }}
            >
              {card.number} {cardImages[card.suit]}
              <span
                onClick={() => handleRemoveCard(index)}
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  cursor: "pointer",
                  color: "red",
                }}
              >
                ❌
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.button
  onClick={() => {
    console.log("Validar jugada presionado"); 
    validateGame();
  }}
  whileHover={{ scale: 1.1 }}
  style={{ marginTop: "20px", padding: "10px 20px" }}
>
  Validar Juego
</motion.button>


      {message && (
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: [0, 1.2, 1] }}
          style={{ marginTop: "20px", color: message.includes("NO") ? "red" : "green" }}
        >
          {message}
        </motion.h1>
      )}
    </div>
  );
}

export default App;
