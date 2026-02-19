export const calculateBMI = (weight, height) => {
  return weight / (height * height);
};

export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return "Bajo peso";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Sobrepeso";
  return "Obesidad";
};
