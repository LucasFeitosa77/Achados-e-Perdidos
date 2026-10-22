import styles from './CamposItens.module.css'

function CamposItens({
  dados,
  setDados,
  categorias,
  locais
}) {
  function handleChange(event) {
    const { name, value } = event.target;

    setDados((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: value
    }));
  }

  return (
    <div className={styles['campo-item']}>
      <div className={styles['campo-item']}>
        <label htmlFor="nome">Nome do item</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={dados.nome}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles['campo-item']}>
        <label htmlFor="descricao">Descrição</label>
        <textarea
          id="descricao"
          name="descricao"
          value={dados.descricao}
          onChange={handleChange}
          rows={4}
          required
        />
      </div>

      <div className={styles['campo-item']}>
        <label htmlFor="categoria">Categoria</label>
        <select
          id="categoria"
          name="categoria"
          value={dados.categoria}
          onChange={handleChange}
          required
        >
          <option value="">Selecione uma categoria</option>

          {categorias.map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
      </div>

      <div className={styles['campo-item']}>
        <label htmlFor="local">Local encontrado</label>
        <select
          id="local"
          name="local"
          value={dados.local}
          onChange={handleChange}
          required
        >
          <option value="">Selecione um local</option>

          {locais.map((local) => (
            <option key={local} value={local}>
              {local}
            </option>
          ))}
        </select>
      </div>

      <div className={styles['campo-item']}>
        <label htmlFor="data_encontrado">
          Data em que foi encontrado
        </label>
        <input
          type="date"
          id="data_encontrado"
          name="data_encontrado"
          value={dados.data_encontrado}
          onChange={handleChange}
          required
        />
      </div>
    </div>
  );
}

export default CamposItens;
