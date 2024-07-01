import React, { useState } from "react";
import { saveAs } from "file-saver";
import { Spin, Button } from "antd";

const Alicia = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);

      const response = await fetch("https://backend-crypto-flask-9976f82913d4.herokuapp.com/DH_Alicia/generate_dh_params");

      if (!response.ok) {
        throw new Error("Error al generar los parámetros DH");
      }

      const data = await response.json();

      // Descargar la clave pública
      const publicKeyBlob = new Blob([data.public_key], {
        type: "application/x-pem-file",
      });
      saveAs(publicKeyBlob, "alicia_public_key_dh.pem");

      // Descargar los parámetros DH
      const dhParamsBlob = new Blob([data.dh_params], {
        type: "application/x-pem-file",
      });
      saveAs(dhParamsBlob, "parametros_dh.pem");

      // Descargar la clave privada
      const privateKeyBlob = new Blob([data.private_key], {
        type: "application/x-pem-file",
      });
      saveAs(privateKeyBlob, "alicia_private_key_dh.pem");

      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Alicia</h2>

      <h3>Generación de llave y parámetros DH de Alicia</h3>
      <Button type="primary" onClick={handleDownload} disabled={loading}>
        {loading ? <Spin /> : "Descargar"}
      </Button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Alicia;
