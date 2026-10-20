
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Cabecalho from "../components/Cabecalho";
import ConfirmaExclusao from "../components/ConfirmaExclusao";

import {
  buscarUsuario,
  buscarItem,
  excluirItem,
  devolverItem
} from "../services/itensService";


function DetalheItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [item, setItem] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [mensagem, setMensagem] = useState("");

  const [confirmacaoAberta, setConfirmacaoAberta] =
    useState(false);

  const [devolvidoPara, setDevolvidoPara] = useState("");
  const [devolvendo, setDevolvendo] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  // Carrega o usuário e o item selecionado.
  useEffect(() => {
    async function carregarDados() {
      setCarregando(true);
      setErro(null);

      try {
        const [dadosUsuario, dadosItem] = await Promise.all([
          buscarUsuario(),
          buscarItem(id)
        ]);

        setUsuario(dadosUsuario);
        setItem(dadosItem);
      } catch (error) {
        console.error("Erro ao carregar detalhes:", error);

        setErro(
          error.response?.data?.detail ||
          "Não foi possível carregar os dados do item."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [id]);

  // Exclui o item após a confirmação.
  async function handleExcluir() {
    setExcluindo(true);
    setErro(null);

    try {
      await excluirItem(id);
      navigate("/");
    } catch (error) {
      console.error("Erro ao excluir item:", error);

      setErro(
        error.response?.data?.detail ||
        "Não foi possível excluir o item."
      );

      setConfirmacaoAberta(false);
    } finally {
      setExcluindo(false);
    }
  }

  // Registra a devolução do item.
  async function handleDevolver(event) {
    event.preventDefault();

    if (!devolvidoPara.trim()) {
      setErro("Informe o nome de quem recebeu o item.");
      return;
    }

    setDevolvendo(true);
    setErro(null);
    setMensagem("");

    try {
      await devolverItem(id, {
        devolvido_para: devolvidoPara.trim()
      });

      const itemAtualizado = await buscarItem(id);

      setItem(itemAtualizado);
      setMensagem("Item marcado como devolvido!");
      setDevolvidoPara("");
    } catch (error) {
      console.error("Erro ao registrar devolução:", error);

      setErro(
        error.response?.data?.detail ||
        "Não foi possível registrar a devolução."
      );
    } finally {
      setDevolvendo(false);
    }
  }

  if (carregando) {
    return (
      <main className="detalhe-item">
        <Cabecalho nomeUsuario={usuario?.nome} />
        <p>Carregando detalhes do item...</p>
      </main>
    );
  }

  if (erro && !item) {
    return (
      <main className="detalhe-item">
        <Cabecalho nomeUsuario={usuario?.nome} />

        <p className="detalhe-item__erro" role="alert">
          {String(erro)}
        </p>

        <button type="button" onClick={() => navigate("/")}>
          Voltar para a lista
        </button>
      </main>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <main className="detalhe-item">
      <Cabecalho nomeUsuario={usuario?.nome} />

      <section className="detalhe-item__conteudo">
        <button
          type="button"
          className="detalhe-item__voltar"
          onClick={() => navigate("/")}
        >
          ← Voltar
        </button>

        <div className="detalhe-item__cabecalho">
          <h2>{item.nome}</h2>

          <span
            className={`detalhe-item__status detalhe-item__status--${item.status}`}
          >
            {item.status === "aguardando"
              ? "Aguardando devolução"
              : "Devolvido"}
          </span>
        </div>

        <div className="detalhe-item__informacoes">
          <div>
            <h3>Descrição</h3>
            <p>{item.descricao || "Sem descrição."}</p>
          </div>

          <div>
            <h3>Categoria</h3>
            <p>{item.categoria}</p>
          </div>

          <div>
            <h3>Local encontrado</h3>
            <p>{item.local}</p>
          </div>

          <div>
            <h3>Encontrado em</h3>
            <p>
              {item.data_encontrado
                ? item.data_encontrado.split("-").reverse().join("/")
                : "Data não informada"}
            </p>
          </div>

          {item.status === "devolvido" && (
            <>
              <div>
                <h3>Devolvido para</h3>
                <p>{item.devolvido_para || "Não informado"}</p>
              </div>

              <div>
                <h3>Data da devolução</h3>
                <p>
                  {item.data_devolucao
                    ? item.data_devolucao.split("T")[0]
                        .split("-").reverse().join("/")
                    : "Não informada"}
                </p>
              </div>
            </>
          )}
        </div>

        {erro && (
          <p className="detalhe-item__erro" role="alert">
            {String(erro)}
          </p>
        )}

        {mensagem && (
          <p className="detalhe-item__sucesso" role="status">
            {mensagem}
          </p>
        )}

        <div className="detalhe-item__acoes">
          <button
            type="button"
            onClick={() => navigate(`/editar/${item.id}`)}
            disabled={excluindo || devolvendo}
          >
            Editar
          </button>

          <button
            type="button"
            onClick={() => setConfirmacaoAberta(true)}
            disabled={excluindo || devolvendo}
          >
            Excluir
          </button>
        </div>

        {item.status === "aguardando" && (
          <form
            className="detalhe-item__devolucao"
            onSubmit={handleDevolver}
          >
            <h3>Registrar devolução</h3>

            <label htmlFor="devolvido_para">
              Nome de quem recebeu
            </label>

            <input
              type="text"
              id="devolvido_para"
              name="devolvido_para"
              value={devolvidoPara}
              onChange={(event) =>
                setDevolvidoPara(event.target.value)
              }
              placeholder="Digite o nome da pessoa"
              required
            />

            <button type="submit" disabled={devolvendo || excluindo}>
              {devolvendo ? "Registrando..." : "Marcar como devolvido"}
            </button>
          </form>
        )}
      </section>

      {confirmacaoAberta && (
        <ConfirmaExclusao
          nomeItem={item.nome}
          onConfirmar={handleExcluir}
          onCancelar={() => setConfirmacaoAberta(false)}
          carregando={excluindo}
        />
      )}
    </main>
  );
}

export default DetalheItem;
