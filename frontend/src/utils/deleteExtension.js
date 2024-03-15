export const deleteExtension = (filename) => {
  return filename.replace(/\.txt$/, ""); // Esto eliminará la subcadena ".txt" al final de la cadena
};
