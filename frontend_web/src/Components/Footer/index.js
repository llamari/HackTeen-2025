import { FaRegCopyright, FaLinkedinIn, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import './index.css'

export function Footer() {
    return (
        <div id="footer">
            <p id="footer-text"><FaRegCopyright /> &nbsp; 2025 IncluSound | Todos os direitos reservados</p>
            <div id="footer-icons">
                <div className="social-icon">
                    <FaLinkedinIn />
                </div>
                <div className="social-icon">
                    <FaFacebookF />
                </div>
                <div className="social-icon">
                    <FaInstagram />
                </div>
                <div className="social-icon">
                    <FaYoutube />
                </div>
                <div className="social-icon" onClick={() => window.location.href = "mailto:inclusound@gmail.com"}>
                    <MdOutlineEmail />
                </div>
            </div>
        </div>
    )
}