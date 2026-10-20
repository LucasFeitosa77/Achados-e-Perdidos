import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Cabecalho from "../components/Cabecalho";
import FiltroItens from "../components/FiltroItens";
import ListaItens from "../components/ListaItens";
import styles from "./Home.module.css"; // <-- Importação do CSS Module

import {
  listarItens,
  buscarUsuario,
  listarCategorias,
  listarLocais
} from "../services/itensService";

function Home() {
  const navigate = useNavigate(); // Boa prática com react-router-dom em vez de window.location.href

  const [usuario, setUsuario] = useState(null);
  const [itens, setItens] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);

  const [filtros, setFiltros] = useState({
    busca: "",
    status: "",
    categoria: "",
    local: ""
  });

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Busca os dados necessários para montar a página.
  useEffect(() => {
    async function carregarDadosIniciais() {
      try {
        const [dadosUsuario, dadosCategorias, dadosLocais] =
          await Promise.all([
            buscarUsuario(),
            listarCategorias(),
            listarLocais()
          ]);

        setUsuario(dadosUsuario);
        setCategorias(dadosCategorias);
        setLocais(dadosLocais);
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      }
    }

    carregarDadosIniciais();
  }, []);

  // Busca os itens sempre que algum filtro mudar.
  useEffect(() => {
    async function carregarItens() {
      setCarregando(true);
      setErro(null);

      try {
        const dados = await listarItens(filtros);
        setItens(dados);
      } catch (error) {
        console.error("Erro ao carregar itens:", error);

        setErro(
          error.response?.data?.detail ||
          "Não foi possível carregar os itens. Verifique sua chave da API."
        );

        setItens([]);
      } finally {
        setCarregando(false);
      }
    }

    carregarItens();
  }, [filtros]);

  return (
    <main className={styles.home}>
      <Cabecalho
        nomeUsuario={usuario?.nome}
      />

      <section className={styles.conteudo}>
        <div className={styles.cabecalhoSecao}>
          <div>
            <h2>Itens encontrados</h2>
            <p>
              Consulte os objetos encontrados no campus.
            </p>
          </div>

          <button
            type="button"
            className={styles.botaoNovo}
            onClick={() => {
              navigate("/novo");
            }}
          >
            + Novo item
          </button>
        </div>

        <FiltroItens
          filtros={filtros}
          setFiltros={setFiltros}
          categorias={categorias}
          locais={locais}
        />

        <ListaItens
          itens={itens}
          carregando={carregando}
          erro={erro}
        />
      </section>
    </main>
  );
}

export default Home;