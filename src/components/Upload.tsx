import { useState } from "react";
import api from "../services/api";

interface Props {
  onUploadConcluido: () => void;
}

const LOCAIS = [
  { valor: "hero", label: "Banner Hero" },
  { valor: "before_after", label: "Antes e Depois" },
  { valor: "galeria", label: "Galeria" },
];

export default function Upload({ onUploadConcluido }: Props) {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [tipo, setTipo] = useState("foto");
  const [exibirEm, setExibirEm] = useState<string[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const toggleLocal = (valor: string) => {
    setExibirEm((prev) =>
      prev.includes(valor) ? prev.filter((v) => v !== valor) : [...prev, valor],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!arquivo) return;
    if (exibirEm.length === 0) {
      setMensagem("Selecione pelo menos um local de exibição.");
      return;
    }

    setEnviando(true);
    setMensagem("");

    const formData = new FormData();
    formData.append("file", arquivo);
    formData.append("tipo", tipo);
    formData.append("exibirEm", JSON.stringify(exibirEm));

    try {
      await api.post("/medias", formData);
      setMensagem("Upload realizado com sucesso!");
      setArquivo(null);
      setExibirEm([]);
      onUploadConcluido();
    } catch {
      setMensagem("Erro ao fazer upload. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section style={styles.container}>
      <h2 style={styles.titulo}>Adicionar mídia</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.campo}>
          <label style={styles.label}>Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            style={styles.select}
          >
            <option value="foto">Foto</option>
            <option value="video">Vídeo</option>
          </select>
        </div>

        <div style={styles.campo}>
          <label style={styles.label}>Arquivo</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4"
            onChange={(e) => setArquivo(e.target.files?.[0] || null)}
            style={styles.inputFile}
            required
          />
        </div>

        <div style={styles.campo}>
          <label style={styles.label}>Exibir em</label>
          <div style={styles.checkboxGroup}>
            {LOCAIS.map((local) => (
              <label key={local.valor} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={exibirEm.includes(local.valor)}
                  onChange={() => toggleLocal(local.valor)}
                />
                {local.label}
              </label>
            ))}
          </div>
        </div>

        {mensagem && (
          <p
            style={{
              ...styles.mensagem,
              color: mensagem.includes("sucesso") ? "#27ae60" : "#c0392b",
            }}
          >
            {mensagem}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando || !arquivo}
          style={
            enviando || !arquivo
              ? { ...styles.botao, opacity: 0.6 }
              : styles.botao
          }
        >
          {enviando ? "Enviando..." : "Fazer upload"}
        </button>
      </form>
    </section>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "1.5rem",
  },
  titulo: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#3a2e24",
    marginBottom: "1.25rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  campo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: 500,
    color: "#3a2e24",
  },
  select: {
    padding: "0.65rem 1rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "0.95rem",
    color: "#3a2e24",
    maxWidth: "200px",
  },
  inputFile: {
    fontSize: "0.9rem",
    color: "#3a2e24",
  },
  checkboxGroup: {
    display: "flex",
    gap: "1.5rem",
    flexWrap: "wrap",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    fontSize: "0.9rem",
    color: "#3a2e24",
    cursor: "pointer",
  },
  mensagem: {
    fontSize: "0.9rem",
  },
  botao: {
    padding: "0.85rem",
    backgroundColor: "#7a5c3a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    maxWidth: "200px",
  },
};
