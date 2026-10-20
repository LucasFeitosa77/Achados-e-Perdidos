import styles from "./FiltroItens.module.css";

function FiltroItens({
  filtros,
  setFiltros,
  categorias,
  locais
}) {
  function handleChange(event) {
    const { name, value } = event.target;

    setFiltros((filtrosAtuais) => ({
      ...filtrosAtuais,
      [name]: value
    }));
  }

  return (
    <section className={styles.container}>
      <div className={styles.busca}>
        <label htmlFor="busca">Buscar item</label>

        <input
          type="search"
          id="busca"
          name="busca"
          placeholder="Buscar por nome ou descrição..."
          value={filtros.busca}
          onChange={handleChange}
        />
      </div>

      <div className={styles.selecao}>
        <div className={styles.campo}>
          <label htmlFor="status">Status</label>

          <select
            id="status"
            name="status"
            value={filtros.status}
            onChange={handleChange}
          >
            <option value="">Todos os status</option>
            <option value="aguardando">Aguardando</option>
            <option value="devolvido">Devolvido</option>
          </select>
        </div>

        <div className={styles.campo}>
          <label htmlFor="categoria-filtro">Categoria</label>

          <select
            id="categoria-filtro"
            name="categoria"
            value={filtros.categoria}
            onChange={handleChange}
          >
            <option value="">Todas as categorias</option>

            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.campo}>
          <label htmlFor="local-filtro">Local</label>

          <select
            id="local-filtro"
            name="local"
            value={filtros.local}
            onChange={handleChange}
          >
            <option value="">Todos os locais</option>

            {locais.map((local) => (
              <option key={local} value={local}>
                {local}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}

export default FiltroItens;