export const formatNumberUSD = (value) => {
  const numberValue = parseFloat(+value || 0);
  if (isNaN(numberValue) || value == undefined) {
    return value;
  }

  const decimalPlaces = (value.toString().split(".")[1] || "").length;

  const formattedNumber = numberValue.toLocaleString(undefined, {
    maximumFractionDigits: decimalPlaces > 2 ? 4 : decimalPlaces,
  });

  return formattedNumber;
};

export const formatNumberCrypto = (value) => {
  // const decimalPlaces = (value.toString().split(".")[1] || "").length;
  // return parseFloat(value).toFixed(decimalPlaces > 4 ? 4 : decimalPlaces);
  const numberValue = parseFloat(+value || 0);
  if (isNaN(numberValue) || value == undefined) {
    return value;
  }

  const decimalPlaces = (value.toString().split(".")[1] || "").length;

  const formattedNumber = numberValue.toLocaleString(undefined, {
    maximumFractionDigits: decimalPlaces > 6 ? 6 : decimalPlaces,
  });

  return formattedNumber;
};

// Display-only: up to 8 decimals, thousands separators, trailing zeros dropped.
export const formatCryptoAmount = (value) => {
  const numberValue = Number(value);
  if (value === null || value === undefined || value === "" || isNaN(numberValue)) {
    return value;
  }
  if (numberValue !== 0 && Math.abs(numberValue) < 0.00000001) {
    return "<0.00000001";
  }
  return numberValue.toLocaleString("en-US", {
    maximumFractionDigits: 8,
  });
};
