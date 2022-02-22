import React, { createContext, useState } from "react";

export const ValueContext = createContext();

const ValueProvider = ({ children }) => {
  const [message, setmessage] = useState("");
  const saveMessage = (message) => {
    setmessage(message);
    return false;
  };
  return (
    <ValueContext.Provider value={{ message, saveMessage }}>
      {children}
    </ValueContext.Provider>
  );
};

export default ValueProvider;
