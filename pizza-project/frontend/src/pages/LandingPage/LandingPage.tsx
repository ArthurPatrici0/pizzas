import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import CatalogoCard from "../../components/CatalogoCard";
import { ModalCarrinho } from "../../components/ModalCarrinho";
import "./LandingPage.css";
const imageDirectory = '/server/images/'; // Diretório onde as imagens estão armazenadas
interface Ingrediente {
    nome: string;
    grama: string;
    imagem: string;
}

interface Pizza {
    id: string;
    nome: string;
    valor: string;
    descricao: string;
    calorias: string;
    imagem: string;
    ingredientes: Ingrediente[];
}

interface CarrinhoItem {
    pizza: Pizza;
    quantidade: number;
}

const LandingPage: React.FC = () => {
    const [pizzaSelecionada, setPizzaSelecionada] = useState<Pizza | null>(null);
    const [quantidade, setQuantidade] = useState<number>(1);
    const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [showPopup, setShowPopup] = useState(false);
    const [pizzas, setPizzas] = useState<Pizza[]>([]);

    useEffect(() => {
        const fetchPizzas = async () => {
            try {
                const response = await fetch('http://localhost:5000/pizzas'); // URL do seu servidor
                const data: Pizza[] = await response.json();
                setPizzas(data);
                setPizzaSelecionada(data[0]); // Seleciona a primeira pizza por padrão
            } catch (error) {
                console.error("Erro ao buscar as pizzas:", error);
            }
        };

        fetchPizzas();
    }, []);

    const handleCatalogoClick = (data: Pizza) => {
        setPizzaSelecionada(data);
        setQuantidade(1);
    };

    const incrementarQuantidade = () => {
        setQuantidade(quantidade + 1);
    };

    const decrementarQuantidade = () => {
        if (quantidade > 1) {
            setQuantidade(quantidade - 1);
        }
    };

    const handleComprarClick = () => {
        if (pizzaSelecionada) {
            const itemCarrinho: CarrinhoItem = {
                pizza: pizzaSelecionada,
                quantidade: quantidade,
            };

            setCarrinho((prevCarrinho) => {
                const itemExistente = prevCarrinho.find(
                    (item) => item.pizza.id === pizzaSelecionada.id
                );

                if (itemExistente) {
                    return prevCarrinho.map((item) =>
                        item.pizza.id === pizzaSelecionada.id
                            ? { ...item, quantidade: item.quantidade + quantidade }
                            : item
                    );
                } else {
                    return [...prevCarrinho, itemCarrinho];
                }
            });

            setTotalItems(prevTotal => prevTotal + quantidade);

            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 3000);
        }
    };

    const removerItemDoCarrinho = (id: string) => {
        const itemParaRemover = carrinho.find(item => item.pizza.id === id);
        if (itemParaRemover) {
            setTotalItems(totalItems - itemParaRemover.quantidade);
        }
        setCarrinho(prevCarrinho => prevCarrinho.filter(item => item.pizza.id !== id));
    };

    const limparCarrinho = () => {
        setCarrinho([]); // Zera o carrinho
        setTotalItems(0); // Reseta o contador de itens
    };

    return (
        <div className="page">
            <div className="selecao_pizza">
                <div className="card_background"></div>
                <div className="selecao">
                    <div className="descricao">
                        {pizzaSelecionada && (
                            <>
                                <div className="pizza_nome">{pizzaSelecionada.nome}</div>
                                <div className="pizza_descricao">{pizzaSelecionada.descricao}</div>
                                {/*
                                <div className="ingredientes">
                                    <Ingredientes
                                        nome="Calorias"
                                        valor={pizzaSelecionada.calorias}
                                        peso={true}
                                        imagem="calorias_icon"
                                    />
                                    {pizzaSelecionada.ingredientes && pizzaSelecionada.ingredientes.length > 0 ? (
                                        pizzaSelecionada.ingredientes.map((ingrediente, index) => (
                                            <Ingredientes
                                                key={index}
                                                nome={ingrediente.nome}
                                                valor={ingrediente.grama}
                                                peso={true}
                                                imagem={ingrediente.imagem}
                                            />
                                        ))
                                    ): ''}
                                </div>*/}
                                <div className="valor">
                                    <div>R$</div>
                                    <div className="valor_numero">{pizzaSelecionada.valor}</div>
                                </div>

                                <div className="quantidade">
                                    <button onClick={decrementarQuantidade}>-</button>
                                    <span>{quantidade}</span>
                                    <button onClick={incrementarQuantidade}>+</button>
                                </div>
                            </>
                        )}

                        <div className="botoes">
                            <Button
                                texto="COMPRAR"
                                cor="rgb(197, 17, 40)"
                                widht="50%" 
                                onClick={handleComprarClick}
                            />
                            <div style={{ position: 'relative', width: '50%' }}>
                                <Button 
                                    texto="CARRINHO" 
                                    cor="black" 
                                    widht="100%" 
                                    onClick={() => setModalOpen(true)} // Abrindo o modal aqui
                                />
                                {totalItems > 0 && (
                                    <div className="carrinho-indicador">
                                        {totalItems}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="catalogo">
                    <div className="catalogo_titulo">PRODUTOS DISPONÍVEIS</div>
                    <div className="catalogo_cards">
                        {pizzas.map((data: Pizza, index: number) => (
                            <CatalogoCard
                                key={index}
                                nome={data.nome}
                                valor={data.valor}
                                imagem={data.imagem}
                                onClick={() => handleCatalogoClick(data)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {pizzaSelecionada && (
                <div className="pizza_imagem">
                    <img
                        className="imagem_pizza"
                        src={`${imageDirectory}${pizzaSelecionada.imagem}`} // Corrigido para usar a propriedade `imagem` diretamente
                        alt={pizzaSelecionada.nome} // Atualiza o alt para usar o nome da pizza
                    />
                </div>
            )}

            <ModalCarrinho
                isOpen={modalOpen}
                setOpen={setModalOpen}
                itens={carrinho}
                removerItem={removerItemDoCarrinho}
                limparCarrinho={limparCarrinho}
            />

            {showPopup && (
                <div className="popup">
                    A pizza {pizzaSelecionada !== null ? pizzaSelecionada.nome : '' } foi adicionada ao carrinho!
                </div>
            )}
        </div>
    );
};

export default LandingPage;
