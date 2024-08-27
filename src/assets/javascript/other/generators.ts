//getRandomColor
const getRandomColor = () => {
  return Math.random() * 0xffffff;
}

const getRandomPosition = () => {
  return Math.random() * (15 * getRandomPosOrNeg());
}

const getRandomPosOrNeg = () => {
  return Math.random() < 0.5 ? -1 : 1;
}

const getRandomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
}

export { getRandomColor, getRandomPosition, getRandomPosOrNeg, getRandomNumber,  };