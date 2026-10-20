import CardItem from "./CardItem";
import styles from "./ListaItens.module.css";

function ListaItens({
  itens,
  carregando,
  erro
}) {
  if (carregando) {
    return (
      <section className={`${styles.listaItens} ${styles.estado}`}>
        <p>Carregando itens...</p>
      </section>
    );
  }

  if (erro) {
    return (
      <section
        className={`${styles.listaItens} ${styles.estado} ${styles.erro}`}
        role="alert"
      >
        <h2>Não foi possível carregar os itens</h2>
        <p>{erro}</p>
      </section>
    );
  }

  if (itens.length === 0) {
    return (
      <section className={`${styles.listaItens} ${styles.estado}`}>
        <h2>Nenhum item encontrado</h2>
        <p>
          Não há itens para exibir com os filtros selecionados.
        </p>
      </section>
    );
  }

  return (
    <section className={styles.listaItens}>
      <div className={styles.grade}>
        {itens.map((item) => (
          <CardItem
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </section>
  );
}

export default ListaItens;