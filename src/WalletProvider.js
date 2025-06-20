import React from "react";

// This is a simple wrapper component since the original wallet provider is not needed
const WalletContextProvider = ({ children }) => {
  return <>{children}</>;
};

export default WalletContextProvider;
