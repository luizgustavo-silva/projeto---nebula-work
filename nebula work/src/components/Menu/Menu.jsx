import styles from "../Menu/Menu.module.css";
import { NavLink } from "react-router";
import { GiExitDoor } from "react-icons/gi";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router";
import NebulaWork from "../../assets/nebula_logo_sem_fundo.png";
import { useEffect, useRef, useState } from "react";
/*<img src=""/>*/
function Menu() {
  const [editando, setEditando] = useState(false);
  const [fechando, setFechando] = useState(false);
  const [texto, setTexto] = useState("");
  const buscaRef = useRef(null);
  const temporizadorFechamento = useRef(null);

  useEffect(() => {
    if (!editando || fechando) return;

    const fecharAoClicarFora = (event) => {
      if (!buscaRef.current?.contains(event.target)) {
        fecharBusca();
      }
    };

    document.addEventListener("pointerdown", fecharAoClicarFora);
    return () => {
      document.removeEventListener("pointerdown", fecharAoClicarFora);
    };
  }, [editando, fechando]);

  useEffect(
    () => () => {
      window.clearTimeout(temporizadorFechamento.current);
    },
    [],
  );

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
        <Link to="/login" className={styles.entrar}>
          <GiExitDoor size={27} />
          Entrar
        </Link>
      </div>
    </header>
  );
}

export default Menu;
