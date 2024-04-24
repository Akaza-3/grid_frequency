import React, { useState, useEffect } from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';
const Chatbot = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const alan = alanBtn({
      key: '105b25fb962e7143cedcf7ddf806779c2e956eca572e1d8b807a3e2338fdd0dc/stage',
      onCommand: ({ command, payload }) => {
        if (command === 'chat') {
          setMessages([...messages, { text: payload.text, from: 'alan' }]);
        }
      },
    });

    return () => {
      alan.deactivate();
    };
  }, [messages]);

  const sendMessage = (text) => {
    setMessages([...messages, { text, from: 'user' }]);

    alanBtn().callProjectApi('chat', { message: text });
  };

  return (
    <div></div>
  );
};

export default Chatbot;
