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
