
import api from "./api";

// Busca os dados do usuário associado à chave da API.
export async function buscarUsuario() {
  const resposta = await api.get("/eu");
  return resposta.data;
}

// Lista os itens, aplicando os filtros preenchidos.
export async function listarItens(filtros = {}) {
  const params = Object.fromEntries(
    Object.entries(filtros).filter(
      ([, valor]) => valor !== "" && valor != null
    )
  );

  const resposta = await api.get("/itens", { params });
  return resposta.data;
}

// Busca um item específico pelo ID.
export async function buscarItem(id) {
  const resposta = await api.get(`/itens/${id}`);
  return resposta.data;
}

// Cadastra um novo item.
export async function criarItem(dados) {
  const resposta = await api.post("/itens", dados);
  return resposta.data;
}

// Atualiza os dados de um item existente.
export async function editarItem(id, dados) {
  const resposta = await api.put(`/itens/${id}`, dados);
  return resposta.data;
}

// Marca um item como devolvido.
export async function devolverItem(id, dados) {
  const resposta = await api.patch(
    `/itens/${id}/devolver`,
    dados
  );

  return resposta.data;
}

// Exclui um item.
export async function excluirItem(id) {
  const resposta = await api.delete(`/itens/${id}`);
  return resposta.data;
}

// Busca as opções para o campo de categoria.
export async function listarCategorias() {
  const resposta = await api.get("/categorias");
  return resposta.data;
}

// Busca as opções para o campo de local.
export async function listarLocais() {
  const resposta = await api.get("/locais");
  return resposta.data;
}
