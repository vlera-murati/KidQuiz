import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createApi, endpoints, BASE_URL } from '../api';
import useStateContext from '../hooks/useStateContext';
import { motion } from 'framer-motion';

export default function Result() {
  const { context, playAudio, stopAudio } = useStateContext();
  const [score, setScore] = useState(0);
  const [questionsAnswer, setQuestionsAnswer] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!context.participantId || context.participantId === 0) {
      alert("Se pari duhet të kycesh dhe pastaj të vazhdosh lojën.");
      navigate("/");
    }
  }, [context, navigate]);

  useEffect(() => {
  if (score === 0) return; 
  if (score === 5) {
    playAudio("/sound/Win.mp3");
  } else {
    playAudio("/sound/Lose.mp3");
  }
}, [score, playAudio, stopAudio]);


  useEffect(() => {
    const ids = context.selectedOptions.map(x => x.qnId);
    createApi(endpoints.getAnswers)
      .post(ids)
      .then(res => {
        const qna = context.selectedOptions.map(x => {
          const match = res.data.find(y => y.qnId === x.qnId || y.QnId === x.qnId);
          return {
            ...x,
            options: match?.options || [],
            answer: match?.answer !== undefined ? match.answer - 1 : null, 
            qnInWord: match?.qnInWord,
            imageName: match?.imageName
          };
        });
        setQuestionsAnswer(qna);
        calculateScore(qna);
      })
      .catch(err => console.log(err));
  }, [context.selectedOptions]);

  const calculateScore = (qna) => {
    const tempScore = qna.reduce((acc, curr) => {
      return acc + (curr.selectedOption === curr.answer ? 1 : 0);
    }, 0);
    setScore(tempScore);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 p-6 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-8">

        <h1 className="text-4xl font-extrabold mb-6 text-center">🏆 Rezultati i juaj </h1>

        <div className="text-center mb-6">
          {score === 5 ? (
            <motion.h2
              className="text-3xl font-bold text-yellow-400"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: 'mirror' }}
            >
              🎉 Urime,keni fituar! 🎉
            </motion.h2>
          ) : (
            <motion.h2
              className="text-2xl font-semibold text-red-400"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: 'mirror' }}
            >
              ❌ Provoni perseri ❌
            </motion.h2>
          )}
        </div>

        {/* Score */}
        <p className="text-xl font-semibold text-center mb-6">
          Score: <span className="text-green-600">{score}</span> / {questionsAnswer.length}
        </p>

        {/* Pyetjet, fotot dhe opsionet */}
        <div className="space-y-4">
          {questionsAnswer.map((item, idx) => (
            <div key={idx} className="bg-white shadow-lg rounded-2xl p-4 mb-4">
              <h3 className="font-semibold mb-3">{idx + 1}. {item.qnInWord}</h3>

              {/* Foto */}
              {item.imageName && (
                <motion.img
                  src={BASE_URL + "Images/" + item.imageName}
                  alt=""
                  className="mx-auto mb-4 w-40 h-40 object-contain rounded-xl shadow-md bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                />
              )}

              <div className="grid grid-cols-2 gap-3">
                {item.options.map((opt, i) => {
                  let bg = '';
                  if (item.selectedOption === i && item.answer !== i) bg = 'bg-red-300'; // zgjedhja gabim
                  if (item.answer === i) bg = 'bg-green-300'; // përgjigja e saktë
                  return (
                    <motion.div
                      key={i}
                      className={`p-2 rounded-lg border ${bg}`}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      {opt}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
