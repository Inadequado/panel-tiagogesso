import api from "../services/api";

interface BeforeAfter {
  id: string;
  titulo: string;
  descricao: string;
  beforeUrl: string;
  afterUrl: string;
  ativo: boolean;
}

interface Props {
  items: BeforeAfter[];
  onAtualizar: () => void;
}

export default function ListaBeforeAfter({ items, onAtualizar }: Props) {
  const handleDeletar = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja deletar?")) return;
    try {
      await api.delete(`/before-after/${id}`);
      onAtualizar();
    } catch {
      alert("Erro ao deletar.");
    }
  };

  const handleToggleAtivo = async (item: BeforeAfter) => {
    try {
      await api.put(`/before-after/${item.id}`, { ativo: !item.ativo });
      onAtualizar();
    } catch {
      alert("Erro ao atualizar.");
    }
  };

  return (
    <div style={styles.grid}>
      {items.map((item) => (
        <div key={item.id} style={styles.card}>
          <div style={styles.imagens}>
            <div style={styles.imagemWrapper}>
              <span style={styles.badge}>Antes</span>
              <img src={item.beforeUrl} alt="antes" style={styles.imagem} />
            </div>
            <div style={styles.imagemWrapper}>
              <span style={styles.badge}>Depois</span>
              <img src={item.afterUrl} alt="depois" style={styles.imagem} />
            </div>
          </div>

          <div style={styles.info}>
            <p style={styles.tituloItem}>{item.titulo}</p>
            <p style={styles.descricao}>{item.descricao}</p>

            <div style={styles.acoes}>
              <button
                onClick={() => handleToggleAtivo(item)}
                style={{
                  ...styles.botao,
                  backgroundColor: item.ativo ? "#27ae60" : "#888",
                }}
              >
                {item.ativo ? "Ativo" : "Inativo"}
              </button>
              <button
                onClick={() => handleDeletar(item.id)}
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
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  card: {
    borderRadius: "8px",
    border: "1px solid #eee",
    overflow: "hidden",
    backgroundColor: "#fafafa",
  },
  imagens: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  },
  imagemWrapper: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: "8px",
    left: "8px",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "#fff",
    fontSize: "0.75rem",
    padding: "2px 8px",
    borderRadius: "4px",
  },
  imagem: {
    width: "100%",
    height: "140px",
    objectFit: "cover",
    display: "block",
  },
  info: {
    padding: "0.75rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  tituloItem: {
    fontWeight: 600,
    fontSize: "0.95rem",
    color: "#3a2e24",
  },
  descricao: {
    fontSize: "0.85rem",
    color: "#888",
  },
  acoes: {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.25rem",
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
