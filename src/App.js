import React, { useState, useEffect } from "react"
import Loading from "./components/Loading"

import pic1 from "./assets/Bat-Cat.png"
import pic2 from "./assets/Blue-Cat.png"
import pic3 from "./assets/Lion-Cat.png"
import pic4 from "./assets/Mystical-Cat.png"
import pic5 from "./assets/Pig-Cat.png"
import pic6 from "./assets/White-Cat.png"

import Card from "./components/Card"
import convertToBase64 from "./helper/convert"

function App() {
  const [cardImages, setCardImages] = useState([
    { src: pic1, matched: false },
    { src: pic2, matched: false },
    { src: pic3, matched: false },
    { src: pic4, matched: false },
    { src: pic5, matched: false },
    { src: pic6, matched: false },
  ])
  const [loading, setloading] = useState(true)

  const [cards, setcards] = useState([])
  const [truns, settruns] = useState(0)

  // Choices
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)

  const [disabiled, setdisabiled] = useState(false)

  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }))

    setcards(shuffledCards)
    settruns(0)
  }

  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  // ####### New implemetation ######
  const updateSrcValues = async () => {
    const updatedCardImages = await Promise.all(
      cardImages.map(async (card) => {
        try {
          const base64Value = await convertToBase64(card.src)

          return { ...card, src: base64Value }
        } catch (error) {
          console.error(error)
          return card
        }
      })
    )
    setCardImages(updatedCardImages)
  }
  // ####### New implemetation ######

  const resetTrun = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    settruns((prevTrun) => prevTrun + 1)
    setdisabiled(false)
  }

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setdisabiled(true)
      if (choiceOne.src === choiceTwo.src) {
        setcards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true }
            } else {
              return card
            }
          })
        })
        resetTrun()
      } else {
        setTimeout(() => {
          resetTrun()
        }, 1000)
      }
    }
    console.log("rendreing 1")
  }, [choiceOne, choiceTwo])

  useEffect(() => {
    updateSrcValues()
      .then((res) => console.log(res))
      .catch((error) => console.log(error))
    console.log(cardImages)
    setTimeout(() => {
      setloading(false)
    }, 3300)
  }, [])

  return loading ? (
    <Loading />
  ) : (
    <div className="App bg-[#ea580c] text-center">
      <button
        onClick={shuffleCards}
        className="bg-[#fdba74] hover:bg-[#9a3412] px-10 mt-10 py-4 text-sm leading-5 rounded-full font-semibold text-white"
      >
        Start Game
      </button>
      <div className="container mx-auto flex flex-row justify-center items-center flex-wrap	mt-10">
        {cardImages &&
          cards.map((card, idx) => {
            return (
              <Card
                key={idx}
                card={card}
                handleChoice={handleChoice}
                flibed={
                  card === choiceOne || card === choiceTwo || card.matched
                }
                disabled={disabiled}
              />
            )
          })}
      </div>
    </div>
  )
}

export default App
