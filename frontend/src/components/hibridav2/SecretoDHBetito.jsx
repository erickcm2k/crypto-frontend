import React, { useState, useRef } from "react";
import { saveAs } from "file-saver";
import { Spin, Button, Upload, message } from "antd";

const SecretoDHBetito = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aliciaPrivateKeyFile, setAliciaPrivateKeyFile] = useState(null);
  const [betitoPublicKeyFile, setBetitoPublicKeyFile] = useState(null);
  const aliciaPrivateKeyInputRef = useRef(null);
  const betitoPublicKeyInputRef = useRef(null);

  const handleDownload = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("alicia_private_key", aliciaPrivateKeyFile);
      formData.append("betito_public_key", betitoPublicKeyFile);

      const response = await fetch("https://backend-crypto-flask-9976f82913d4.herokuapp.com/obten_secreto", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al derivar la clave AES");
      }

      const data = await response.json();

      // Convertir la clave AES de hexadecimal a bytes
      const aesKeyBytes = Uint8Array.from(
        data.aes_key.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
      );

      // Guardar la clave AES
      const aesKeyBlob = new Blob([aesKeyBytes], {
        type: "application/octet-stream",
      });
      saveAs(aesKeyBlob, "aes_key.bin");

      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleAliciaPrivateKeyUpload = (file) => {
    setAliciaPrivateKeyFile(file);
  };

  const handleBetitoPublicKeyUpload = (file) => {
    setBetitoPublicKeyFile(file);
  };

  return (
    <div>
      <h2>Alicia</h2>

      <h3>Derivación de la clave AES de Alicia usando su llave privada y la llave pública de Betito para generar AES</h3>

      <Upload
        ref={aliciaPrivateKeyInputRef}
        beforeUpload={handleAliciaPrivateKeyUpload}
        maxCount={1}
        accept=".pem"
      >
        <Button>Subir alicia_private_key_dh.pem</Button>
      </Upload>
      <br></br>
      <Upload
        ref={betitoPublicKeyInputRef}
        beforeUpload={handleBetitoPublicKeyUpload}
        maxCount={1}
        accept=".pem"
      >
        <Button>Subir betito_public_key_dh.pem</Button>
      </Upload>
      <br></br>
      <Button
        type="primary"
        onClick={handleDownload}
        disabled={loading || !aliciaPrivateKeyFile || !betitoPublicKeyFile}
      >
        {loading ? <Spin /> : "Derivar Clave AES"}
      </Button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default SecretoDHBetito;
