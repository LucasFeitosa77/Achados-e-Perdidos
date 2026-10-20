import styles from "./ConfirmarExclusao.module.css";

function ConfirmarExclusao({
  nomeItem,
  onConfirmar,
  onCancelar,
  carregando = false
}) {
  return (
    <div className={styles.fundo}>
      <section
        className={styles.modal}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmar-exclusao__titulo"
        aria-describedby="confirmar-exclusao__descricao"
      >
        <h2 id="confirmar-exclusao__titulo" className={styles.titulo}>
          Excluir item?
        </h2>

        <p id="confirmar-exclusao__descricao" className={styles.descricao}>
          Tem certeza de que deseja excluir{" "}
          <strong>{nomeItem}</strong>?
          Essa ação não pode ser desfeita.
        </p>

        <div className={styles.acoes}>
          <button
            type="button"
            className={`${styles.botao} ${styles.cancelar}`}
            onClick={onCancelar}
            disabled={carregando}
          >
            Cancelar
          </button>

          <button
            type="button"
            className={`${styles.botao} ${styles.excluir}`}
            onClick={onConfirmar}
            disabled={carregando}
          >
            {carregando ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default ConfirmarExclusao;