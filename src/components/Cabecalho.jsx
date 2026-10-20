import styles from './Cabecalho.module.css'

function Cabecalho({ nomeUsuario }) {
  return (
    <header className={styles.cabecalho}>
      <h1 className={styles.cabecalho__titulo}>
        Achados & Perdidos
      </h1>

      <p className={styles.cabecalho__saudacao}>
        Olá, <strong>{nomeUsuario || "usuário"}</strong>!
      </p>
    </header>
  );
}

export default Cabecalho;