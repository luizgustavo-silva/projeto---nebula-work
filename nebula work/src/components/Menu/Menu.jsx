import styles from "../Menu/Menu.module.css";
import { Link, NavLink } from "react-router";
import { GiExitDoor } from "react-icons/gi";
import NebulaWork from "../../assets/nebula_logo_sem_fundo.png";
import { useAuth } from "../../contexts/useAuth.js";

function Menu() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.container}>
      <img src={NebulaWork} className={styles.logo} alt="Nebula Work" />
      <nav className={styles.containerNav}>
        <NavLink to="/" className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.navLinkAtivo}` : styles.navLink)}>
          Página inicial
        </NavLink>
        <NavLink to="/carreiras" className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.navLinkAtivo}` : styles.navLink)}>
          Cargos e Salários
        </NavLink>
        <NavLink to="/empresas" className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.navLinkAtivo}` : styles.navLink)}>
          Buscar empresas
        </NavLink>
      </nav>
      <div className={styles.cantoDireito}>
        {user ? (
          <>
            <Link to="/perfil" className={styles.profileLink}>Meu perfil</Link>
            <button type="button" className={styles.entrar} onClick={logout}>
              <GiExitDoor size={20} />
              Sair
            </button>
          </>
        ) : (
          <Link to="/login" className={styles.entrar}>
            <GiExitDoor size={20} />
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}

export default Menu;
