import { useNavigate } from "react-router-dom";
import style from "./CardItem.module.css";

function CardItem({ item }) {
  const navigate = useNavigate();

  function abrirDetalhes() {
    navigate(`/item/${item.id}`);
  }

  return (
    <article
      className={style.cardItem}
      onClick={abrirDetalhes}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          abrirDetalhes();
        }
      }}
      tabIndex={0}
      role="link"
      aria-label={`Ver detalhes de ${item.nome}`}
    >
      <div className={style.card_item__conteudo}>
        <h3 className={style.card_item__nome}>{item.nome}</h3>

        <p className={style.card_item__categoria}>
          {item.categoria}
        </p>

        <p className={style.card_item__local}>
          <strong>Local:</strong> {item.local}
        </p>
      </div>

      <span className={`${style["card-item__status"]} ${style[`card-item__status--${item.status}`]}`} >
        {item.status === "aguardando"
          ? "Aguardando devolução"
          : "Devolvido"}
      </span>
    </article>
  );
}

export default CardItem;