import "./Button.css";

interface ButtonProps {
    texto: string;
    cor: string;
    widht: string;
    onClick?: () => void; // Função que será chamada quando o botão for clicado
}

const Button: React.FC<ButtonProps> = ({ texto, cor, widht, onClick }) => {
    return (
        <div 
            onClick={onClick} 
            style={{ backgroundColor: `${cor}`, width: `${widht}` }} 
            className="btn"
        >
            {texto}
        </div>
    );
};

export default Button;
