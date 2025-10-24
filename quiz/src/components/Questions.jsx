import React from 'react';
import { motion } from 'framer-motion';
import useStateContext from '../hooks/useStateContext';
import { BASE_URL } from '../api';

export default function Questions({ question }) {
  const { context, setContext } = useStateContext();
  
  const selectedOption = context.selectedOptions.find(o => o.qnId === question.qnId)?.selectedOption;

  const handleSelect = (index) => {
    const updated = [
      ...context.selectedOptions.filter(o => o.qnId !== question.qnId),
      { qnId: question.qnId, selectedOption: index, selectedOptionText: question.options[index] }
    ];
    setContext({ selectedOptions: updated });
  };

  return (
    <div className="relative mb-6 p-4 rounded-2xl shadow-lg bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 overflow-hidden">
      <motion.div
        className="absolute -top-5 -left-5 w-16 h-16 bg-pink-300 rounded-full opacity-50"
        animate={{ x: [0, 10, 0], y: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'mirror' }}
      />
      <motion.div
        className="absolute -bottom-5 -right-5 w-20 h-20 bg-purple-300 rounded-full opacity-40"
        animate={{ x: [0, -10, 0], y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, repeatType: 'mirror' }}
      />

     



      <motion.h2
        className="font-bold mb-4 text-xl text-gray-800"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >

         {question.imageName && (
        <motion.img
          src={BASE_URL + "Images/" + question.imageName}  
          alt=""
          className="mx-auto mb-4 w-40 h-40 object-contain rounded-xl shadow-md bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
      )}
        {question.qnInWord}
      </motion.h2>

      <div className="grid grid-cols-2 gap-3">
        {question.options.map((opt, i) => (
          <motion.button
            key={i}
            onClick={() => handleSelect(i)}
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95, rotate: -2 }}
            className={`p-3 rounded-lg border font-semibold w-full text-gray-800 shadow-md transform transition ${
              selectedOption === i 
                ? 'bg-blue-300 border-blue-500' 
                : 'bg-white hover:bg-gradient-to-r hover:from-pink-200 hover:via-purple-200 hover:to-indigo-200'
            }`}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
