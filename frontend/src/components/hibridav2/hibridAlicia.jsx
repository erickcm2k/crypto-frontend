import React, { useState, useRef } from "react";
import { saveAs } from "file-saver";
import { Spin, Button, Upload } from "antd";

const CifradoRSA = () => {
  // Estados para archivos y carga
  const [archivoACifrarFile, setArchivoACifrarFile] = useState(null);
  const [archivoDhFile, setArchivoDhFile] = useState(null);
  const [archivoCifradoFile, setArchivoCifradoFile] = useState(null);
  const [llavePrivadaFile, setLlavePrivadaFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleArchivoCifradoUpload = (file) => {
    setArchivoCifradoFile(file);
  };
  // Referencias para los componentes Upload
  const archivoACifrarInputRef = useRef(null);
  const archivoDhInputRef = useRef(null);
  const llavePrivadaInputRef = useRef(null);

  // Funciones para manejar la carga de archivos
  const handleArchivoACifrarUpload = (file) => {
    setArchivoACifrarFile(file);
  };
  const handleArchivoDhUpload = (file) => {
    setArchivoDhFile(file);
  };
  const handleLlavePrivadaUpload = (file) => {
    setLlavePrivadaFile(file);
  };

  // Función para generar las llaves RSA
  const handleGenerarLlaves = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://backend-crypto-flask-9976f82913d4.herokuapp.com/Hibrid_Alicia/generar_llaves");

      if (!response.ok) {
        throw new Error("Error al generar las llaves RSA");
      }

      const data = await response.json();

      // Descargar la clave privada
      const privateKeyBlob = new Blob([data.private_key], {
        type: "application/x-pem-file",
      });
      saveAs(privateKeyBlob, "alicia_private_rsa.pem");

      // Descargar la clave pública
      const publicKeyBlob = new Blob([data.public_key], {
        type: "application/x-pem-file",
      });
      saveAs(publicKeyBlob, "alicia_public_rsa.pem");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para cifrar el archivo
  const handleEncrypt = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("archivo_dh", archivoDhFile);
      formData.append("archivo_a_cifrar", archivoACifrarFile);

      const response = await fetch("https://backend-crypto-flask-9976f82913d4.herokuapp.com/Hibrid_Alicia/encrypt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al cifrar el archivo");
      }

      const data = await response.json();

      // Convertir el archivo cifrado de hexadecimal a bytes
      const archivoCifradoBytes = Uint8Array.from(
        data.archivo_cifrado.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
      );

      // Guardar el archivo cifrado
      const archivoCifradoBlob = new Blob([archivoCifradoBytes], {
        type: "application/octet-stream",
      });
      saveAs(archivoCifradoBlob, "archivo_cifrado.bin");
      setArchivoCifradoFile(archivoCifradoBlob); // Guardar el archivo cifrado en el estado
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para firmar el archivo cifrado
  const handleSignData = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("archivo_a_cifrar", archivoACifrarFile);
      formData.append("archivo_cifrado", archivoCifradoFile);
      formData.append("llave_privada", llavePrivadaFile);

      const response = await fetch("https://backend-crypto-flask-9976f82913d4.herokuapp.com/Hibrid_Alicia/sign_data", {
        method: "POST",
        body: formData,
      });
      console.log(response);

      if (!response.ok) {
        const errorData = await response.json(); // Intenta obtener un JSON con el error
        throw new Error(errorData.error || "Error al firmar el archivo");
      }

      // Obtener la respuesta como Blob (archivo binario)
      const blob = await response.blob();

      // Descargar el archivo firmado
      saveAs(blob, "archivo_firmado.signed");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Alicia</h2>

      <h3>Generación de llaves RSA</h3>
      <Button type="primary" onClick={handleGenerarLlaves} disabled={loading}>
        {loading ? <Spin /> : "Generar Llaves"}
      </Button>

      <h3>Cifrado de archivo</h3>
      <Upload
        ref={archivoDhInputRef}
        beforeUpload={handleArchivoDhUpload}
        maxCount={1}
        accept=".bin"
      >
        <Button>Subir archivo_dh.bin (AES)</Button>
      </Upload>
      <br></br>
      <Upload
        ref={archivoACifrarInputRef}
        beforeUpload={handleArchivoACifrarUpload}
        maxCount={1}
      >
        <Button>Subir archivo a cifrar</Button>
      </Upload>
      <br></br>
      <Button
        type="primary"
        onClick={handleEncrypt}
        disabled={loading || !archivoDhFile || !archivoACifrarFile}
      >
        {loading ? <Spin /> : "Cifrar"}
      </Button>

      <h3>Firma de archivo cifrado</h3>
      <Upload beforeUpload={handleArchivoACifrarUpload} maxCount={1}>
        <Button>Subir archivo a cifrar</Button>
      </Upload>
      <br></br>
      <Upload
        beforeUpload={handleArchivoCifradoUpload}
        maxCount={1}
        accept=".bin"
      >
        <Button>Subir archivo cifrado (.bin)</Button>
      </Upload>
      <br></br>
      <Upload
        ref={llavePrivadaInputRef}
        beforeUpload={handleLlavePrivadaUpload}
        maxCount={1}
        accept=".pem"
      >
        <Button>Subir llave privada (PEM)</Button>
      </Upload>
      <br></br>
      <Button
        type="primary"
        onClick={handleSignData}
        disabled={
          loading ||
          !archivoACifrarFile ||
          !archivoCifradoFile ||
          !llavePrivadaFile
        }
      >
        {loading ? <Spin /> : "Firmar Archivo Cifrado"}
      </Button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CifradoRSA;
