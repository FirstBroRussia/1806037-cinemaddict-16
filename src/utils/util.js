const getRandomNumber = (min, max, fixed) => {
  if (fixed) {
    const randomFractionalNumber = (Math.random() * (max + 1 - min) + min).toFixed(1);
    return randomFractionalNumber >= 10 ? '10' : randomFractionalNumber;
  }
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

const getConvertedString = (string, specifiedLength) => string.length > specifiedLength ? `${string.slice(0, specifiedLength - 1)}...` : string;


export {getRandomNumber, getConvertedString};
