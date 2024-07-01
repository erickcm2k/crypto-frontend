import React, { useState, useRef } from "react";
import { saveAs } from "file-saver";
import { Spin, Button, Upload, message } from "antd";

const DH_Betito = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [parametrosDhFile, setParametrosDhFile] = useState(null);
  const [aliciaPublicKeyFile, setAliciaPublicKeyFile] = useState(null);
  const parametrosDhInputRef = useRef(null);
  const aliciaPublicKeyInputRef = useRef(null);

  const handleDownload = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("parametros_dh", parametrosDhFile);
      formData.append("alicia_public_key", aliciaPublicKeyFile);

      const response = await fetch("https://backend-crypto-flask-9976f82913d4.herokuapp.com/DH_Betito/dh_exchange", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al generar los parámetros DH");
      }

      const data = await response.json();

      // Descargar la clave pública de Betito
      const betitoPublicKeyBlob = new Blob([data.betito_public_key], {
        type: "application/x-pem-file",
      });
      saveAs(betitoPublicKeyBlob, "betito_public_key_dh.pem");

      // Descargar la clave privada de Betito
      const betitoPrivateKeyBlob = new Blob([data.betito_private_key], {
        type: "application/x-pem-file",
      });
      saveAs(betitoPrivateKeyBlob, "betito_private_key_dh.pem");

      // Convertir la clave AES de hexadecimal a bytes
      const aesKeyBytes = Uint8Array.from(
        data.aes_key.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
      );

      // Guardar la clave AES
      const aesKeyBlob = new Blob([aesKeyBytes], {
        type: "application/octet-stream",
      });
      saveAs(aesKeyBlob, "betito_aes_key.bin");

      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleParametrosDhUpload = (file) => {
    setParametrosDhFile(file);
  };

  const handleAliciaPublicKeyUpload = (file) => {
    setAliciaPublicKeyFile(file);
  };

  return (
    <div>
      <h2>Betito</h2>

      <h3>Generación llave AES y llave pública de Betito usando la llave pública de Alicia y sus parámetros DH</h3>
      <Upload
        ref={parametrosDhInputRef}
        beforeUpload={handleParametrosDhUpload}
        maxCount={1}
        accept=".pem"
      >
        <Button>Subir parametros_dh.pem</Button>
      </Upload>
      <br></br>
      <Upload
        ref={aliciaPublicKeyInputRef}
        beforeUpload={handleAliciaPublicKeyUpload}
        maxCount={1}
        accept=".pem"
      >
        <Button>Subir alicia_public_key_dh.pem</Button>
      </Upload>
      <br></br>
      <Button
        type="primary"
        onClick={handleDownload}
        disabled={loading || !parametrosDhFile || !aliciaPublicKeyFile}
      >
        {loading ? <Spin /> : "Cargar"}
      </Button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default DH_Betito;
