
/**
 * Converte uma data no formato AAAA-MM-DD
 * para DD/MM/AAAA.
 */
export function formatarData(data) {
  if (!data) {
    return "Data não informada";
  }

  const dataSemHorario = data.split("T")[0];
  const partes = dataSemHorario.split("-");

  if (
    partes.length !== 3 ||
    partes.some((parte) => parte === "")
  ) {
    return "Data inválida";
  }

  const [ano, mes, dia] = partes;

  return `${dia}/${mes}/${ano}`;
}

/**
 * Obtém uma mensagem de erro compreensível
 * a partir de uma falha na requisição.
 */
export function obterMensagemErro(
  error,
  mensagemPadrao = "Ocorreu um erro inesperado."
) {
  const detalhe = error.response?.data?.detail;

  if (typeof detalhe === "string" && detalhe.trim()) {
    return detalhe;
  }

  if (Array.isArray(detalhe)) {
    return detalhe
      .map((erro) => erro.msg || "Dados inválidos")
      .join("; ");
  }

  return mensagemPadrao;
}
