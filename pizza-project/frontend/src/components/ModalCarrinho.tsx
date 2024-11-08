import React, { useState } from "react";
import "./ModalCarrinho.css";
const imageDirectory = '../../../dist/images/'; // Diretório onde as imagens estão armazenadas

interface ICarrinhoItem {
    pizza: {
        nome: string;
        valor: string;
        imagem: string;
        id: string;
    };
    quantidade: number;
}

interface IModalCarrinho {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
    itens: ICarrinhoItem[];
    removerItem: (id: string) => void;
    limparCarrinho: () => void; 
}

export function ModalCarrinho({ isOpen, setOpen, itens, removerItem, limparCarrinho }: IModalCarrinho) {
    const [isFormOpen, setFormOpen] = useState(false);
    const [deliveryOption, setDeliveryOption] = useState('balcao');
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        endereco: '',
    });

    const valorTotal = itens.reduce(
        (total, item) => total + parseFloat(item.pizza.valor) * item.quantidade,
        0
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDeliveryOption(e.target.value);
    };

    const [showAlert, setShowAlert] = useState(false);

    const handleConcluirPedido = () => {
        if (itens.length === 0) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 4000); // Exibir o alerta por 4 segundos
        } else {
            setFormOpen(true);
        }
    };

    const handleBackToCart = () => {
        setFormOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const mensagem = `            📦 *Itens do Pedido:*
            ${itens.map(item => `- 🍕 *${item.pizza.nome}* (x${item.quantidade}) - R$ ${parseFloat(item.pizza.valor).toFixed(2)}`).join('\n')}

            💰 *Total: R$ ${valorTotal.toFixed(2)}*

            📝 *Informações do Cliente:*
            - Nome: *${formData.nome}*
            - CPF: *${formData.cpf}*
            - Email: *${formData.email}*
            - Telefone: *${formData.telefone}*
            - Endereço: *${deliveryOption === 'delivery' ? formData.endereco : 'Retirar no balcão'}*

            🎉 Obrigado pelo seu pedido! ${deliveryOption === 'delivery' ? 'Avisaremos quando o pedido estiver a caminho!' : 'Aguardamos você!'} 🍽️
            `;
        
        const numeroWhatsapp = '5545999999999';
        const url = `https://api.whatsapp.com/send?phone=${numeroWhatsapp}&text=${encodeURIComponent(mensagem)}`;
        
        window.open(url, '_blank');

        limparCarrinho(); 
        setFormOpen(false);
        setOpen(false); 
    };

    if (isOpen) {
        return (
            <div className="background_modal">
                <div className="modal_carrinho">
                    <button className="close_button" onClick={() => setOpen(!isOpen)}>
                        X
                    </button>
                    <div className="title_carrinho">CARRINHO DE COMPRAS</div>
                    {/* Alerta sempre visível quando necessário */}
                    {showAlert && (
                        <div className="custom_alert_popup">
                            O carrinho está vazio. Adicione pizzas antes de concluir o pedido!
                        </div>
                    )}
                    {!isFormOpen ? (
                        <>
                            <div className="itens_carrinho">
                                {itens.length > 0 ? (
                                    itens.map((item, index) => (
                                        <div key={index} className="item_carrinho">
                                            <img
                                                src={`${imageDirectory}${item.pizza.imagem}`}
                                                alt="Pizza"
                                                className="imagem_pizza_carrinho"
                                            />
                                            <div className="info_item">
                                                <span className="nome_pizza_carrinho">
                                                    {item.pizza.nome} (x{item.quantidade})
                                                </span>
                                                <span className="preco_pizza_carrinho">
                                                    R$ {parseFloat(item.pizza.valor).toFixed(2)}
                                                </span>
                                            </div>
                                            <button
                                                className="remover_button"
                                                onClick={() => removerItem(item.pizza.id)}
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p>O carrinho está vazio.</p>
                                )}
                            </div>
                            <div className="caixa_carrinho">
                                <div>TOTAL A PAGAR</div>
                                <div className="valor_carrinho">
                                    <div>R$</div>
                                    <div className="valor_numero_carrinho">{valorTotal.toFixed(2)}</div>
                                </div>
                                <button className="pagamento_button" onClick={handleConcluirPedido}>
                                    CONCLUIR PEDIDO
                                </button>
                            </div>
                        </>
                    ) : (
                        <form className="form_pedido" onSubmit={handleSubmit}>
                            <h2>Detalhes do Pedido</h2>
                            <div className="form_group">
                                <label>Nome:</label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form_group">
                                <label>CPF:</label>
                                <input
                                    type="text"
                                    name="cpf"
                                    value={formData.cpf}
                                    onChange={handleInputChange}
                                    required
                                    pattern="\d{3}\.\d{3}\.\d{3}-\d{2}" 
                                    title="O CPF deve estar no formato 000.000.000-00"
                                />
                            </div>
                            <div className="form_group">
                                <label>Email:</label>
                                <input 
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"
                                    title="Por favor, insira um endereço de email válido."
                                />
                            </div>
                            <div className="form_group">
                                <label>Telefone:</label>
                                <input
                                    type="text"
                                    name="telefone"
                                    value={formData.telefone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form_group">
                                <label>
                                    <input
                                        type="radio"
                                        value="balcao"
                                        checked={deliveryOption === 'balcao'}
                                        onChange={handleDeliveryChange}
                                    />
                                    Pegar no Balcão
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="delivery"
                                        checked={deliveryOption === 'delivery'}
                                        onChange={handleDeliveryChange}
                                    />
                                    Delivery
                                </label>
                            </div>
                            {deliveryOption === 'delivery' && (
                                <div className="form_group">
                                    <label>Endereço:</label>
                                    <input
                                        type="text"
                                        name="endereco"
                                        value={formData.endereco}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            )}
                            <div className="form_group">
                                <button type="button" className="pagamento_button" onClick={handleBackToCart}>
                                    Voltar ao Carrinho
                                </button>
                                <button type="submit" className="pagamento_button">
                                    Enviar Pedido
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        );
    } else {
        return null;
    }
}
