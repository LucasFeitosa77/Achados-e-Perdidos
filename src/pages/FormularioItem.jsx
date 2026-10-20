import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Cabecalho from "../components/Cabecalho";
import CamposItens from "../components/CamposItens";
import styles from "./FormularioItem.module.css"; // <-- Importação do CSS Module

import {
  buscarUsuario,
  buscarItem,
  criarItem,
  editarItem,
  listarCategorias,
  listarLocais
} from "../services/itensService";

function FormularioItem() {
  const navigate = useNavigate();
  const { id } = useParams();

  const editando = Boolean(id);

  const [usuario, setUsuario] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);

  const [dados, setDados] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    local: "",
    data_encontrado: ""
  });

  const [carregando, setCarregando] = useState(editando);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const [mensagem, setMensagem] = useState("");

  // Carrega os dados necessários para o formulário.
  useEffect(() => {
    async function carregarDados() {
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

        if (editando) {
          setCarregando(true);

          const item = await buscarItem(id);

          setDados({
            nome: item.nome ?? "",
            descricao: item.descricao ?? "",
            categoria: item.categoria ?? "",
            local: item.local ?? "",
            data_encontrado: item.data_encontrado ?? ""
          });
        }
      } catch (error) {
        console.error("Erro ao carregar formulário:", error);

        setErro(
          error.response?.data?.detail ||
          "Não foi possível carregar os dados do formulário."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [id, editando]);

  async function handleSubmit(event) {
    event.preventDefault();

    setErro(null);
    setMensagem("");
    setSalvando(true);

    try {
      if (editando) {
        await editarItem(id, dados);
        setMensagem("Item atualizado com sucesso!");
      } else {
        await criarItem(dados);
        setMensagem("Item cadastrado com sucesso!");
      }

      navigate("/");
    } catch (error) {
      console.error("Erro ao salvar item:", error);

      setErro(
        error.response?.data?.detail ||
        "Não foi possível salvar o item. Tente novamente."
      );
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <main className={styles.pagina}>
        <Cabecalho nomeUsuario={usuario?.nome} />
        <div className={styles.estadoCarregando}>
          <p>Carregando formulário...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.pagina}>
      <Cabecalho nomeUsuario={usuario?.nome} />

      <section className={styles.conteudo}>
        <button
          type="button"
          className={styles.botaoVoltar}
          onClick={() => navigate("/")}
        >
          ← Voltar
        </button>

        <h2 className={styles.titulo}>
          {editando ? "Editar item" : "Novo item"}
        </h2>

        <form onSubmit={handleSubmit} className={styles.formulario}>
          <CamposItens
            dados={dados}
            setDados={setDados}
            categorias={categorias}
            locais={locais}
          />

          {erro && (
            <p className={styles.mensagemErro} role="alert">
              {String(erro)}
            </p>
          )}

          {mensagem && (
            <p className={styles.mensagemSucesso} role="status">
              {mensagem}
            </p>
          )}

          <div className={styles.acoes}>
            <button
              type="submit"
              className={`${styles.botao} ${styles.botaoSalvar}`}
              disabled={salvando}
            >
              {salvando
                ? "Salvando..."
                : editando
                  ? "Salvar alterações"
                  : "Cadastrar item"}
            </button>

            <button
              type="button"
              className={`${styles.botao} ${styles.botaoCancelar}`}
              onClick={() => navigate("/")}
              disabled={salvando}
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default FormularioItem;