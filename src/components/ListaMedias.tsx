import type { Media } from "../pages/Dashboard";
import api from "../services/api";

interface Props {
  medias: Media[];
  onAtualizar: () => void;
}

const LOCAIS: { [key: string]: string } = {
  hero: "Hero",
  before_after: "Antes e Depois",
  galeria: "Galeria",
};

export default function ListaMedias({ medias, onAtualizar }: Props) {
  const handleDeletar = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja deletar esta mídia?")) return;
    try {
      await api.delete(`/medias/${id}`);
      onAtualizar();
    } catch {
      alert("Erro ao deletar mídia.");
    }
  };

  const handleToggleAtivo = async (media: Media) => {
    try {
      await api.put(`/medias/${media.id}`, { ativo: !media.ativo });
      onAtualizar();
    } catch {
      alert("Erro ao atualizar mídia.");
    }
  };

  return (
    <div style={styles.grid}>
      {medias.map((media) => (
        <div key={media.id} style={styles.card}>
          {media.tipo === "foto" ? (
            <img src={media.url} alt="mídia" style={styles.imagem} />
          ) : (
            <video src={media.url} style={styles.imagem} controls />
          )}

          <div style={styles.info}>
            <div style={styles.tags}>
              {media.exibirEm.map((local) => (
                <span key={local} style={styles.tag}>
                  {LOCAIS[local] || local}
                </span>
              ))}
            </div>

            <div style={styles.acoes}>
              <button
                onClick={() => handleToggleAtivo(media)}
                style={{
                  ...styles.botao,
                  backgroundColor: media.ativo ? "#27ae60" : "#888",
                }}
              >
                {media.ativo ? "Ativo" : "Inativo"}
              </button>

              <button
                onClick={() => handleDeletar(media.id)}
                style={{ ...styles.botao, backgroundColor: "#c0392b" }}
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "1rem",
  },
  card: {
    borderRadius: "8px",
    border: "1px solid #eee",
    overflow: "hidden",
    backgroundColor: "#fafafa",
  },
  imagem: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
    display: "block",
  },
  info: {
    padding: "0.75rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.3rem",
  },
  tag: {
    backgroundColor: "#f0ebe3",
    color: "#7a5c3a",
    fontSize: "0.75rem",
    padding: "0.2rem 0.5rem",
    borderRadius: "4px",
    fontWeight: 500,
  },
  acoes: {
    display: "flex",
    gap: "0.5rem",
  },
  botao: {
    flex: 1,
    padding: "0.4rem",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.8rem",
    cursor: "pointer",
    fontWeight: 500,
  },
};
