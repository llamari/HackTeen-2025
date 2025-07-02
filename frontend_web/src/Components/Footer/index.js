import { FaRegCopyright, FaLinkedinIn, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import './index.css'

export function Footer() {
    return (
        <footer id="footer" role="contentinfo" aria-label="Rodapé do site">
            <p id="footer-text">
                <FaRegCopyright aria-hidden="true" /> &nbsp; 2025 IncluSound | Todos os direitos reservados
            </p>
            <nav id="footer-icons" aria-label="Redes sociais e contato">
                <a
                    className="social-icon"
                    href="https://www.linkedin.com"
                    aria-label="Visitar nosso LinkedIn"
                    target="_blank" rel="noopener noreferrer"
                >
                    <FaLinkedinIn />
                </a>
                <a
                    className="social-icon"
                    href="https://www.facebook.com"
                    aria-label="Visitar nosso Facebook"
                    target="_blank" rel="noopener noreferrer"
                >
                    <FaFacebookF />
                </a>
                <a
                    className="social-icon"
                    href="https://www.instagram.com"
                    aria-label="Visitar nosso Instagram"
                    target="_blank" rel="noopener noreferrer"
                >
                    <FaInstagram />
                </a>
                <a
                    className="social-icon"
                    href="https://www.youtube.com"
                    aria-label="Visitar nosso canal no YouTube"
                    target="_blank" rel="noopener noreferrer"
                >
                    <FaYoutube />
                </a>
                <a
                    className="social-icon"
                    href="mailto:inclusound@gmail.com"
                    aria-label="Enviar e-mail para inclusound@gmail.com"
                >
                    <MdOutlineEmail />
                </a>
            </nav>
        </footer>
    )
}