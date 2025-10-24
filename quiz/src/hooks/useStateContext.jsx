import { useContext, createContext, useState, useEffect } from 'react';

export const stateContext = createContext();

const getFreshContext = () => {
  if (localStorage.getItem('context') === null)
    localStorage.setItem('context', JSON.stringify({
      participantId: 0,
      timeTaken: 0,
      selectedOptions: []
    }));
  return JSON.parse(localStorage.getItem('context'));
};

export function ContextProvider({ children }) {
  const [context, setContext] = useState(getFreshContext());
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    localStorage.setItem('context', JSON.stringify(context));
  }, [context]);

  const playAudio = (src, loop = true) => {
    if (audio) audio.pause(); 
    const newAudio = new Audio(src);
    newAudio.loop = loop;
    newAudio.play().catch(() => {});
    setAudio(newAudio);
  };

  const stopAudio = () => {
    if (audio) {
      audio.pause();
      setAudio(null);
    }
  };

  return (
    <stateContext.Provider value={{
      context,
      setContext,
      playAudio,
      stopAudio
    }}>
      {children}
    </stateContext.Provider>
  );
}

export default function useStateContext() {
  const { context, setContext, playAudio, stopAudio } = useContext(stateContext);
  return {
    context,
    setContext: (obj) => setContext(prev => ({ ...prev, ...obj })),
    resetContext: () => {
      localStorage.removeItem('context');
      setContext(getFreshContext());
    },
    playAudio,
    stopAudio
  };
}
