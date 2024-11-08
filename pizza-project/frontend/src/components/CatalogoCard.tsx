import "./CatalogoCard.css";
const imageDirectory = '/server/images/'; // Diretório onde as imagens estão armazenadas

interface Catalogo {
    nome : string,
    valor : string,
    imagem : string 
    onClick: () => void;
}

const CatalogoCard:React.FC<Catalogo> = ({nome,valor,imagem,onClick}) => {
    return(<>
        <div className='container_catalogo' onClick={onClick}>
            <img className='img_catalogo' src={`${imageDirectory}${imagem}`} alt="Imagem pizza" />
            <div className='inf_catalogo'>
                <div className='nome_catalogo'>{nome}</div>
                <div className="valor_catalogo">
                    <div className="valor_rs">
                        R$
                    </div>
                    <div className="valor_numero">
                        {valor}
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default CatalogoCard;