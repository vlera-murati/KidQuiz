import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createApi, endpoints } from '../api';
import useStateContext from '../hooks/useStateContext';
import Questions from './Questions';
import { motion, AnimatePresence } from 'framer-motion';

export default function Quiz() {
  const { setContext, context, playAudio } = useStateContext();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [timeStart, setTimeStart] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnimals, setShowAnimals] = useState(false); 

  useEffect(() => {
    createApi(endpoints.questions)
      .fetch()
      .then(res => {
        setQuestions(res.data);
        setTimeStart(Date.now());
      })
      .catch(err => console.error('Error loading questions:', err));
  }, []);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleFinish = () => {
    const duration = Math.floor((Date.now() - timeStart) / 1000);
    setContext({ timeTaken: duration });
    navigate('/result');
  };

  if (!context.participantId || context.participantId === 0) {
    navigate("/");
    return null; 
  }

  const animals = [
    { src: '/images/dog.png', sound: '/sound/Dog.mp3', alt: 'Dog' },
    { src: '/images/bird.png', sound: '/sound/Bird.mp3', alt: 'Bird' },
    { src: '/images/eagle.jpeg', sound: '/sound/Eagle.mp3', alt: 'Eagle' },
    { src: '/images/chicken.jpeg', sound: '/sound/Chicken.mp3', alt: 'Chicken' },
    { src: '/images/rabit.jpeg', sound: '/sound/Rabbit.mp3', alt: 'Rabbit' },
    { src: '/images/horse.jpg', sound: '/sound/Horse.mp3', alt: 'Horse' },
    { src: '/images/cat.png', sound: '/sound/Cat.mp3', alt: 'Cat' },
    { src: '/images/cow.jpeg', sound: '/sound/Cow.mp3', alt: 'Cow' },
    { src: '/images/Sheep.png', sound: '/sound/Sheep.mp3', alt: 'Sheep' },
    { src: '/images/snak.jpeg', sound: '/sound/Snak.mp3', alt: 'Snake' },
    { src:'images/ants.png',sound:'/sound/Bug.mp3',alt:'Ants'},
  ];

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-6 overflow-hidden">
      <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-3xl text-center relative overflow-hidden">
        
        <h1 className="text-4xl font-extrabold mb-6 animate-bounce text-gradient bg-clip-text text-transparent from-yellow-400 via-red-500 to-pink-500 bg-gradient-to-r">
          🧩 Quiz Time!
        </h1>

        {!showAnimals && (
          <button
            onClick={() => setShowAnimals(true)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform transition hover:scale-110 animate-pulse mb-6"
          >
            Show Animals
          </button>
        )}

        {showAnimals && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {animals.map((a, i) => (
              <img
                key={i}
                src={a.src}
                alt={a.alt}
                className="w-32 h-32 cursor-pointer rounded-xl shadow-lg hover:scale-105 transition-transform"
                onClick={() => playAudio(a.sound, false)}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {questions[currentIndex] && (
            <motion.div
              key={questions[currentIndex].QnId}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
            >
              <Questions question={questions[currentIndex]} />
              <div className="flex justify-center mt-6 gap-4">
                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform transition hover:scale-110 animate-pulse"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform transition hover:scale-110 animate-pulse"
                  >
                    Finish Quiz
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute -top-10 -left-10 w-24 h-24 bg-pink-300 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-300 rounded-full opacity-40 animate-ping"></div>
        <div className="absolute top-1/4 -right-20 w-40 h-40 bg-yellow-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-1/3 -left-16 w-28 h-28 bg-green-300 rounded-full opacity-40 animate-spin"></div>
      </div>
    </div>
  );
}
