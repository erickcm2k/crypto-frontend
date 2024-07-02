import React, { useState, useRef } from "react";
import { saveAs } from "file-saver";
import { Spin, Button, Upload, Form, message, Divider } from "antd";
import HibridBetitoVerificar from './HibridBetitoVerificar'

const HibridoBetito = () => {
  // Estados para archivos y carga
  const [archivoCifradoFile, setArchivoCifradoFile] = useState(null);
  const [archivoDHFile, setArchivoDHFile] = useState(null);
  const [archivoFirmadoFile, setArchivoFirmadoFile] = useState(null);
  const [llavePublicaFile, setLlavePublicaFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Referencias para los componentes Upload
  const archivoCifradoInputRef = useRef(null);
  const archivoDHInputRef = useRef(null);
  // Funciones para manejar la carga de archivos
  const handleArchivoCifradoUpload = (file) => {
    setArchivoCifradoFile(file);
  };

  const handleArchivoDHUpload = (file) => {
    setArchivoDHFile(file);
  };

  // Función para descifrar el archivo
  const handleDecrypt = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("archivo_cifrado", archivoCifradoFile);
      formData.append("archivo_dh", archivoDHFile);

      const response = await fetch("https://backend-crypto-flask-9976f82913d4.herokuapp.com/Hibrid_Betito/descifrar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al descifrar el archivo");
      }

      // Obtener la respuesta como Blob (archivo binario)
      const blob = await response.blob();

      // Descargar el archivo descifrado
      saveAs(blob, "archivo_descifrado.txt");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <h2>Betito</h2>

      <h3>Descifrar Archivo</h3>
      <Form>
        <Form.Item label="Archivo Cifrado (.bin)">
          <Upload
            ref={archivoCifradoInputRef}
            beforeUpload={handleArchivoCifradoUpload}
            maxCount={1}
            accept=".bin"
          >
            <Button>Subir archivo cifrado (.bin)</Button>
          </Upload>
        </Form.Item>
        <Form.Item label="Archivo AES (.bin)">
          <Upload
            ref={archivoDHInputRef}
            beforeUpload={handleArchivoDHUpload}
            maxCount={1}
            accept=".bin"
          >
            <Button>Subir archivo (AES)</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={handleDecrypt}
            disabled={loading || !archivoCifradoFile || !archivoDHFile}
          >
            {loading ? <Spin /> : "Descifrar"}
          </Button>
        </Form.Item>
      </Form>

      <Divider />
      <HibridBetitoVerificar/>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default HibridoBetito;
