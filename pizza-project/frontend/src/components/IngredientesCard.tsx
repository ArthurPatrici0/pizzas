import "./IngredientesCard.css";

interface Ingrediente {
    nome : string,
    valor : string,
    peso : boolean,
    imagem : string; 
}

const IngredientesCard:React.FC<Ingrediente> = ({nome,valor,peso,imagem}) => {
    return(<>
        <div className='container_ingrediente'>
            <img src={`/images/${imagem}.png`} alt="ingrediente" />
            <div className='values'>
                <div className='valor_ingrediente'>{valor}{peso ? "g" : ""}</div>
                <div className='nome'>{nome}</div>
            </div>
        </div>
    </>)
}

export default IngredientesCard;