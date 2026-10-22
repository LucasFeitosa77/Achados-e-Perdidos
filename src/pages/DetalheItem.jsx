
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cabecalho from "../components/Cabecalho";
import ConfirmaExclusao from "../components/ConfirmaExclusao";
import {
  buscarUsuario,
  buscarItem,
  excluirItem,
  devolverItem,
} from "../services/itensService";
import { formatarData, obterMensagemErro } from "../utils/Utils";
import styles from "./DetalheItem.module.css";

function DetalheItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [item, setItem] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [devolvidoPara, setDevolvidoPara] = useState("");
  const [devolvendo, setDevolvendo] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      setCarregando(true);
      setErro("");
      try {
        const [dadosUsuario, dadosItem] = await Promise.all([
          buscarUsuario(),
          buscarItem(id),
        ]);

        setUsuario(dadosUsuario);
        setItem(dadosItem);
      } catch (error) {
        setErro(obterMensagemErro(error, "Não foi possível carregar o item."));
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [id]);

  async function handleExcluir() {
    setExcluindo(true);
    setErro("");
    try {
      await excluirItem(id);
      navigate("/");
    } catch (error) {
      setErro(obterMensagemErro(error, "Não foi possível excluir o item."));
      setConfirmacaoAberta(false);
    } finally {
      setExcluindo(false);
    }
  }

  async function handleDevolver(event) {
    event.preventDefault();

    const nome = devolvidoPara.trim();

    if (!nome) {
      setErro("Informe o nome de quem recebeu o item.");
      return;
    }

    setDevolvendo(true);
    setErro("");
    setMensagem("");

    try {
      const resposta = await devolverItem(id, {
        devolvido_para: nome,
      });

      if (resposta && resposta.id) {
        setItem(resposta);
      } else {
        const itemAtualizado = await buscarItem(id);
        setItem(itemAtualizado);
      }

      setDevolvidoPara("");
      setMensagem("Item marcado como devolvido com sucesso.");
    } catch (error) {
      setErro(obterMensagemErro(error, "Não foi possível registrar a devolução."));
    } finally {
      setDevolvendo(false);
    }
  }

  if (carregando) {
    return (
      <div className={styles.detalhe}>
        <Cabecalho nomeUsuario={usuario?.nome} />
        <main className={styles.detalhe__conteudo}>
          <p className={styles.detalhe__carregando}>
            Carregando detalhes do item...
          </p>
        </main>
      </div>
    );
  }

  if (erro && !item) {
    return (
      <div className={styles.detalhe}>
        <Cabecalho nomeUsuario={usuario?.nome} />
        <main className={styles.detalhe__conteudo}>
          <p className={styles.detalhe__erro}>{erro}</p>

          <button
            type="button"
            className={styles.detalhe__voltar}
            onClick={() => navigate("/")}
          >
            ← Voltar para a lista
          </button>
        </main>
      </div>
    );
  }

  if (!item) {
    return (
      <div className={styles.detalhe}>
        <Cabecalho nomeUsuario={usuario?.nome} />
        <main className={styles.detalhe__conteudo}>
          <p className={styles.detalhe__vazio}>Item não encontrado.</p>
          <button
            type="button"
            className={styles.detalhe__voltar}
            onClick={() => navigate("/")}
          >
            ← Voltar para a lista
          </button>
        </main>
      </div>
    );
  }

  const foiDevolvido = item.status === "devolvido";

  return (
    <div className={styles.detalhe}>
      <Cabecalho nomeUsuario={usuario?.nome} />

      <main className={styles.detalhe__conteudo}>
        <button
          type="button"
          className={styles.detalhe__voltar}
          onClick={() => navigate("/")}
        >
          ← Voltar para a lista
        </button>

        {mensagem && (
          <p className={styles.detalhe__mensagem} role="status">
            {mensagem}
          </p>
        )}

        {erro && (
          <p className={styles.detalhe__erro} role="alert">
            {erro}
          </p>
        )}

        <header className={styles.detalhe__cabecalho}>
          <div>
            <h2 className={styles.detalhe__titulo}>{item.nome}</h2>
            <p className={styles.detalhe__subtitulo}>
              Informações sobre o item encontrado.
            </p>
          </div>

          <span
            className={`${styles.detalhe__status} ${
              foiDevolvido
                ? styles["detalhe__status--devolvido"]
                : styles["detalhe__status--aguardando"]
            }`}
          >
            {foiDevolvido ? "Devolvido" : "Aguardando"}
          </span>
        </header>

        <section className={styles.detalhe__cartao}>
          <h3 className={styles["detalhe__secao-titulo"]}>
            Detalhes do item
          </h3>

          <div className={styles.detalhe__dados}>
            <div
              className={`${styles.detalhe__campo} ${styles["detalhe__campo--completo"]}`}
            >
              <span className={styles.detalhe__rotulo}>Descrição</span>
              <p className={styles.detalhe__valor}>
                {item.descricao || "Sem descrição informada."}
              </p>
            </div>

            <div className={styles.detalhe__campo}>
              <span className={styles.detalhe__rotulo}>Categoria</span>
              <p className={styles.detalhe__valor}>{item.categoria}</p>
            </div>

            <div className={styles.detalhe__campo}>
              <span className={styles.detalhe__rotulo}>Local encontrado</span>
              <p className={styles.detalhe__valor}>{item.local}</p>
            </div>

            <div className={styles.detalhe__campo}>
              <span className={styles.detalhe__rotulo}>
                Data em que foi encontrado
              </span>
              <p className={styles.detalhe__valor}>
                {formatarData(item.data_encontrado)}
              </p>
            </div>

            {foiDevolvido && (
              <>
                <div className={styles.detalhe__campo}>
                  <span className={styles.detalhe__rotulo}>
                    Devolvido para
                  </span>
                  <p className={styles.detalhe__valor}>
                    {item.devolvido_para || "Não informado"}
                  </p>
                </div>

                <div className={styles.detalhe__campo}>
                  <span className={styles.detalhe__rotulo}>
                    Data da devolução
                  </span>
                  <p className={styles.detalhe__valor}>
                    {formatarData(item.data_devolucao)}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className={styles.detalhe__acoes}>
            {!foiDevolvido && (
              <button
                type="button"
                className={`${styles.detalhe__botao} ${styles["detalhe__botao--editar"]}`}
                onClick={() => navigate(`/editar/${item.id}`)}
              >
                Editar item
              </button>
            )}

            <button
              type="button"
              className={`${styles.detalhe__botao} ${styles["detalhe__botao--excluir"]}`}
              onClick={() => setConfirmacaoAberta(true)}
              disabled={excluindo}
            >
              Excluir item
            </button>
          </div>

          {!foiDevolvido && (
            <form
              className={styles["detalhe__formulario-devolucao"]}
              onSubmit={handleDevolver}
            >
              <h3 className={styles["detalhe__secao-titulo"]}>
                Registrar devolução
              </h3>

              <label htmlFor="devolvido_para">
                Nome de quem recebeu o item
              </label>

              <input
                type="text"
                id="devolvido_para"
                name="devolvido_para"
                value={devolvidoPara}
                onChange={(event) => setDevolvidoPara(event.target.value)}
                placeholder="Digite o nome completo"
                required
              />

              <button
                type="submit"
                className={`${styles.detalhe__botao} ${styles["detalhe__botao--devolver"]}`}
                disabled={devolvendo}
              >
                {devolvendo ? "Registrando..." : "Confirmar devolução"}
              </button>
            </form>
          )}
        </section>
      </main>

      {confirmacaoAberta && (
        <ConfirmaExclusao
          nomeItem={item.nome}
          onConfirmar={handleExcluir}
          onCancelar={() => setConfirmacaoAberta(false)}
          carregando={excluindo}
        />
      )}
    </div>
  );
}

export default DetalheItem;
