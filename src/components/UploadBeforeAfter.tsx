import { useState } from "react";
import api from "../services/api";

interface Props {
  onUploadConcluido: () => void;
}

export default function UploadBeforeAfter({ onUploadConcluido }: Props) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [before, setBefore] = useState<File | null>(null);
  const [after, setAfter] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!before || !after) {
      setMensagem("Selecione as duas imagens.");
      return;
    }

    setEnviando(true);
    setMensagem("");

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("before", before);
    formData.append("after", after);

    try {
      await api.post("/before-after", formData);
      setMensagem("Cadastrado com sucesso!");
      setTitulo("");
      setDescricao("");
      setBefore(null);
      setAfter(null);
      onUploadConcluido();
    } catch {
      setMensagem("Erro ao cadastrar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section style={styles.container}>
      <h2 style={styles.titulo}>Adicionar Antes & Depois</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.campo}>
          <label style={styles.label}>Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            style={styles.input}
            placeholder="Ex: Forro de Drywall"
            required
          />
        </div>

        <div style={styles.campo}>
          <label style={styles.label}>Descrição</label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            style={styles.input}
            placeholder="Ex: Instalação completa com acabamento impecável."
            required
          />
        </div>

        <div style={styles.grid}>
          <div style={styles.campo}>
            <label style={styles.label}>Imagem — Antes</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setBefore(e.target.files?.[0] || null)}
              required
            />
          </div>

          <div style={styles.campo}>
            <label style={styles.label}>Imagem — Depois</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setAfter(e.target.files?.[0] || null)}
              required
            />
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
          disabled={enviando}
          style={enviando ? { ...styles.botao, opacity: 0.6 } : styles.botao}
        >
          {enviando ? "Enviando..." : "Cadastrar"}
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
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
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
  input: {
    padding: "0.65rem 1rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "0.95rem",
    color: "#ffffff",
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
