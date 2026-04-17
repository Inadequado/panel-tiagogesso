import { useState } from "react";
import api from "../services/api";

interface Props {
  onUploadConcluido: () => void;
}

export default function UploadYoutube({ onUploadConcluido }: Props) {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const extrairId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    );
    return match ? match[1] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("");

    const id = extrairId(youtubeUrl);
    if (!id) {
      setMensagem("URL inválida. Use um link do YouTube válido.");
      return;
    }

    setEnviando(true);

    try {
      await api.post("/medias/youtube", {
        youtubeUrl,
        exibirEm: JSON.stringify(["galeria"]),
      });
      setMensagem("Vídeo cadastrado com sucesso!");
      setYoutubeUrl("");
      onUploadConcluido();
    } catch {
      setMensagem("Erro ao cadastrar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  const idPreview = extrairId(youtubeUrl);

  return (
    <section style={styles.container}>
      <h2 style={styles.titulo}>Adicionar vídeo do YouTube</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.campo}>
          <label style={styles.label}>Link do YouTube</label>
          <input
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            style={styles.input}
            placeholder="https://www.youtube.com/watch?v=..."
            required
          />
        </div>

        {idPreview && (
          <div style={styles.preview}>
            <p style={styles.previewLabel}>Preview:</p>
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${idPreview}`}
              allowFullScreen
              style={styles.iframe}
            />
          </div>
        )}

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
          {enviando ? "Cadastrando..." : "Cadastrar vídeo"}
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
    minHeight: "100%",
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
  input: {
    padding: "0.65rem 1rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "0.95rem",
    color: "#ffffff",
  },
  preview: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  previewLabel: {
    fontSize: "0.85rem",
    fontWeight: 500,
    color: "#3a2e24",
  },
  iframe: {
    borderRadius: "8px",
    border: "none",
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
