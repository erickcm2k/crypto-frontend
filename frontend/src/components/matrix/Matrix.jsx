import React, { useState } from 'react';
import { mod, multiply, inv, matrix, index } from 'mathjs';

const ModularMatrixCalculator = () => {
  const [matrixA, setMatrixA] = useState(Array(3).fill().map(() => Array(3).fill(0)));
  const [matrixB, setMatrixB] = useState(Array(3).fill().map(() => Array(3).fill(0)));
  const [modulus, setModulus] = useState(1);
  const [result, setResult] = useState(null);
  const [inverseA, setInverseA] = useState(null);

  const handleChangeMatrix = (e, setMatrix, row, col) => {
    const value = parseInt(e.target.value, 10) || 0;
    setMatrix(prevMatrix => {
      const newMatrix = [...prevMatrix];
      newMatrix[row][col] = value;
      return newMatrix;
    });
  };

  const handleChangeModulus = (e) => {
    setModulus(parseInt(e.target.value, 10) || 1);
  };

  const calculateInverse = () => {
    try {
      const invA = inv(matrix(matrixA));
      const invAModN = invA.map(value => mod(value, modulus));
      setInverseA(invAModN.toArray());
    } catch (error) {
      setInverseA('Error: La matriz no es invertible');
    }
  };

  const calculateProduct = () => {
    try {
      const product = multiply(matrix(matrixA), matrix(matrixB));
      const productModN = product.map(value => mod(value, modulus));
      setResult(productModN.toArray());
    } catch (error) {
      setResult('Error en el cálculo del producto');
    }
  };

  const renderMatrix = (matrix, name) => (
    <div>
      <h3>{name}</h3>
      {matrix.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((value, colIndex) => (
            <input
              key={colIndex}
              type="number"
              value={value}
              onChange={(e) => handleChangeMatrix(e, name === 'Matrix A' ? setMatrixA : setMatrixB, rowIndex, colIndex)}
              style={{ width: '50px', margin: '5px' }}
            />
          ))}
        </div>
      ))}
    </div>
  );

  const renderResult = (matrix) => (
    <div>
      {matrix.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((value, colIndex) => (
            <span key={colIndex} style={{ width: '50px', margin: '5px', display: 'inline-block' }}>
              {value.toFixed(5)}
            </span>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {renderMatrix(matrixA, 'Matrix A')}
      {renderMatrix(matrixB, 'Matrix B')}
      <div>
        <h3>Modulus (n)</h3>
        <input type="number" value={modulus} onChange={handleChangeModulus} style={{ width: '50px', margin: '5px' }} />
      </div>
      <div>
        <button onClick={calculateInverse}>Calcular A⁻¹ mod n</button>
        {inverseA && (
          <div>
            <h3>Inversa de A mod n</h3>
            {typeof inverseA === 'string' ? <p>{inverseA}</p> : renderResult(inverseA)}
          </div>
        )}
      </div>
      <div>
        <button onClick={calculateProduct}>Calcular C = A x B mod n</button>
        {result && (
          <div>
            <h3>Producto AxB mod n</h3>
            {renderResult(result)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModularMatrixCalculator;
