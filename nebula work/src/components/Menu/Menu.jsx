import styles from "../Menu/Menu.module.css";
import { NavLink } from "react-router";
import { GiExitDoor } from "react-icons/gi";
import { FiSearch } from "react-icons/fi";
/*<img src=""/>*/
function Menu() {
    return (
        <header className={styles.container}>
            <nav className={styles.containerNav}>
                <NavLink to="/" className={styles.navLink}>Página inicial</NavLink>
                <NavLink to="/carreiras" className={styles.navLink}>Cargos e Salários</NavLink>
                <NavLink to="/empresas" className={styles.navLink}>Buscar empresas</NavLink>
            </nav>
            <div className={styles.cantoDireito}>
            <div className={styles.btnsearch}>
                <button><FiSearch /> Buscar</button>
            </div>
            <button><GiExitDoor />Entrar</button>
            </div>
        </header>
    )
}

export default Menu