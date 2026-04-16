import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Upload from "../components/Upload";
import ListaMedias from "../components/ListaMedias";
import UploadBeforeAfter from "../components/UploadBeforeAfter";
import ListaBeforeAfter from "../components/ListaBeforeAfter";

export interface Media {
  id: string;
  url: string;
  publicId: string;
  tipo: string;
  exibirEm: string[];
  ordem: number;
  ativo: boolean;
  criadoEm: string;
}

export interface BeforeAfter {
  id: string;
  titulo: string;
  descricao: string;
  beforeUrl: string;
  afterUrl: string;
  ativo: boolean;
}

export default function Dashboard() {
  const [medias, setMedias] = useState<Media[]>([]);
  const [beforeAfters, setBeforeAfters] = useState<BeforeAfter[]>([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  const buscarMedias = async () => {
    try {
      const response = await api.get("/medias");
      setMedias(response.data);
    } catch {
      console.error("Erro ao buscar mídias");
    }
  };

  const buscarBeforeAfters = async () => {
    try {
      const response = await api.get("/before-after");
      setBeforeAfters(response.data);
    } catch {
      console.error("Erro ao buscar before & afters");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    Promise.all([buscarMedias(), buscarBeforeAfters()]).finally(() =>
      setCarregando(false),
    );
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.titulo}>Tiago Gesso — Painel</h1>
        <button onClick={handleLogout} style={styles.logout}>
          Sair
        </button>
      </header>

      <main style={styles.main}>
        <Upload onUploadConcluido={buscarMedias} />

        <section style={styles.secao}>
          <h2 style={styles.secaoTitulo}>Mídias cadastradas</h2>
          {carregando ? (
            <p style={styles.info}>Carregando...</p>
          ) : medias.length === 0 ? (
            <p style={styles.info}>Nenhuma mídia cadastrada ainda.</p>
          ) : (
            <ListaMedias medias={medias} onAtualizar={buscarMedias} />
          )}
        </section>

        <UploadBeforeAfter onUploadConcluido={buscarBeforeAfters} />

        <section style={styles.secao}>
          <h2 style={styles.secaoTitulo}>Antes & Depois cadastrados</h2>
          {carregando ? (
            <p style={styles.info}>Carregando...</p>
          ) : beforeAfters.length === 0 ? (
            <p style={styles.info}>Nenhum cadastrado ainda.</p>
          ) : (
            <ListaBeforeAfter
              items={beforeAfters}
              onAtualizar={buscarBeforeAfters}
            />
          )}
        </section>
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f0ebe3",
  },
  header: {
    backgroundColor: "#3a2e24",
    padding: "1rem 2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titulo: {
    color: "#fff",
    fontSize: "1.2rem",
    fontWeight: 600,
  },
  logout: {
    backgroundColor: "transparent",
    border: "1px solid #fff",
    color: "#fff",
    padding: "0.4rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  main: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "2rem 1rem",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  secao: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "1.5rem",
  },
  secaoTitulo: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#3a2e24",
    marginBottom: "1rem",
  },
  info: {
    color: "#888",
    fontSize: "0.95rem",
  },
};
