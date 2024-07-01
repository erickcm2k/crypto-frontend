import React, { useState, useRef } from "react";
import { saveAs } from "file-saver";
import { Spin, Button, Upload, message, Tabs, Form, Divider } from "antd";

const HibridBetito = () => {
  // Estados para archivos y carga
  const [archivoFirmadoFile, setArchivoFirmadoFile] = useState(null);
  const [llavePublicaFile, setLlavePublicaFile] = useState(null);
  const [archivoDhFile, setArchivoDhFile] = useState(null);
  const [archivoDescifrado, setArchivoDescifrado] = useState(null);
  const [signature, setSignature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Referencias para los componentes Upload
  const archivoFirmadoInputRef = useRef(null);
  const llavePublicaInputRef = useRef(null);
  const archivoDhInputRef = useRef(null);

  // Funciones para manejar la carga de archivos
  const handleArchivoFirmadoUpload = (file) => {
    setArchivoFirmadoFile(file);
  };
  const handleLlavePublicaUpload = (file) => {
    setLlavePublicaFile(file);
  };
  const handleArchivoDhUpload = (file) => {
    setArchivoDhFile(file);
  };

  // Función para descifrar el archivo
  const handleDecrypt = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("archivo_firmado", archivoFirmadoFile);
      formData.append("llave_publica", llavePublicaFile);
      formData.append("archivo_dh", archivoDhFile);

      const response = await fetch("http://127.0.0.1:5000/descifrar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al descifrar el archivo");
      }

      const data = await response.json();

      // Convertir el archivo descifrado de UTF-8 a bytes
      const archivoDescifradoBytes = new TextEncoder().encode(
        data.archivo_descifrado
      );

      // Guardar el archivo descifrado y la firma en el estado
      setArchivoDescifrado(archivoDescifradoBytes);
      setSignature(data.signature);

      // Guardar el archivo descifrado
      const archivoDescifradoBlob = new Blob([archivoDescifradoBytes], {
        type: "text/plain",
      });
      saveAs(archivoDescifradoBlob, "archivo_descifrado.txt");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para verificar el archivo
  const handleVerify = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("archivo_descifrado", new Blob([archivoDescifrado])); // Usar el archivo descifrado del estado
      formData.append("signature", signature); // Usar la firma del estado
      formData.append("llave_publica", llavePublicaFile);

      const response = await fetch("http://127.0.0.1:5000/verificar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al verificar el archivo");
      }

      const data = await response.json();
      message.success(
        `La verificación del archivo fue: ${
          data.verificacion ? "Exitosa" : "Fallida"
        }`
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Tabs defaultActiveKey="1">
        <Form>
          <Form.Item label="Archivo Firmado (.signed)">
            <Upload
              ref={archivoFirmadoInputRef}
              beforeUpload={handleArchivoFirmadoUpload}
              maxCount={1}
              accept=".signed"
            >
              <Button>Subir archivo firmado (.signed)</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Llave Pública (PEM)">
            <Upload
              ref={llavePublicaInputRef}
              beforeUpload={handleLlavePublicaUpload}
              maxCount={1}
              accept=".pem"
            >
              <Button>Subir llave pública (PEM)</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Archivo DH (.bin)">
            <Upload
              ref={archivoDhInputRef}
              beforeUpload={handleArchivoDhUpload}
              maxCount={1}
              accept=".bin"
            >
              <Button>Subir archivo_dh.bin (AES)</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={handleDecrypt}
              disabled={
                loading ||
                !archivoFirmadoFile ||
                !llavePublicaFile ||
                !archivoDhFile
              }
            >
              {loading ? <Spin /> : "Descifrar"}
            </Button>
          </Form.Item>
          <Divider />
          <Form.Item>
            <Button
              type="primary"
              onClick={handleVerify}
              disabled={
                loading ||
                !archivoFirmadoFile ||
                !llavePublicaFile ||
                !archivoDhFile
              }
            >
              {loading ? <Spin /> : "Verificar"}
            </Button>
          </Form.Item>
        </Form>
      </Tabs>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default HibridBetito;
