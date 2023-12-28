import React, { useState, useEffect } from "react";
import Loading from "./components/Loading";
import Card from "./components/Card";
import { images } from "./data/images";

const cardImages = [
  { matched: false, name: "pic1" },
  { matched: false, name: "pic2" },
  { matched: false, name: "pic3" },
  { matched: false, name: "pic4" },
  { matched: false, name: "pic5" },
  { matched: false, name: "pic6" },
];

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [loading, setLoading] = useState(true);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const loadImage = (image) => {
      return new Promise((resolve, reject) => {
        const loadImg = new Image();
        loadImg.src = image;
        loadImg.onload = () =>
          setTimeout(() => {
            resolve(image);
          }, 2000);

        loadImg.onerror = (err) => reject(err);
      });
    };

    Promise.all(images.map((image) => loadImage(image)))
      .then(() => setLoading(false))
      .catch((err) => console.log("Failed to load images", err));
  }, []);

  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card, i) => ({ ...card, id: i }));

    setCards(shuffledCards);
    setTurns(1);
  };

  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);

    if (choiceOne) {
      setDisabled(true);
      if (choiceOne.name === card.name) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.name === choiceOne.name) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => {
          resetTurn();
        }, 1000);
      }
    }
  };

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurn) => prevTurn + 1);
    setDisabled(false);
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="App bg-[#ea580c] text-center">
      {!turns && (
        <button
          onClick={shuffleCards}
          className="bg-[#fdba74] hover:bg-[#9a3412] px-10 mt-10 py-4 text-sm leading-5 rounded-full font-semibold text-white"
        >
          Start Game
        </button>
      )}
      <div className="container mx-auto flex flex-row justify-center items-center flex-wrap	mt-10">
        {cardImages &&
          cards.map((card, idx) => {
            return (
              <Card
                imageSrc={images[+card.name.slice(-1) - 1]}
                key={idx}
                card={card}
                handleChoice={handleChoice}
                flibed={
                  (card.name === choiceOne?.name &&
                    card.id === choiceOne?.id) ||
                  (card.name === choiceTwo?.name &&
                    card.id === choiceTwo?.id) ||
                  card.matched
                }
                disabled={disabled}
              />
            );
          })}
      </div>
    </div>
  );
}

export default App;
