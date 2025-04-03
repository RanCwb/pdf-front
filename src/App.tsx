import { useState } from "react";
import axios from "axios";
import "./App.css";

interface ComparacaoData {
  sucesso: boolean;
  diferencas: string[];
}

function App() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [resultado, setResultado] = useState<ComparacaoData | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleUpload = async () => {
    if (!file1 || !file2) {
      alert("Envie as duas planilhas para comparar.");
      return;
    }

    const formData = new FormData();
    formData.append("sheet1", file1);
    formData.append("sheet2", file2);
    

    setCarregando(true);
    setResultado(null);

    try {
      const response = await axios.post<ComparacaoData>(
        "https://pdf-tej1.onrender.com/comparar", 

        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResultado(response.data);
    } catch (error) {
      console.error("Erro ao comparar planilhas:", error);
      alert("Erro ao comparar planilhas.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="container">
      <h1>Comparar Planilhas Excel</h1>

      <div className="upload">
        <input type="file" accept=".xlsx" onChange={(e) => setFile1(e.target.files?.[0] || null)} />
        <input type="file" accept=".xlsx" onChange={(e) => setFile2(e.target.files?.[0] || null)} />
        <button onClick={handleUpload} disabled={carregando}>
          {carregando ? "Comparando..." : "Comparar"}
        </button>
      </div>

      {resultado && (
        <div className="resultado">
          {resultado.sucesso ? (
            <div className="sucesso">✅ As planilhas são idênticas!</div>
          ) : (
            <div className="erro">
              ❌ Diferenças encontradas:
              <ul>
                {resultado.diferencas.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
