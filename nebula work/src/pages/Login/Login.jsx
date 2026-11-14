import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../contexts/useAuth.js";
import { usuariosDemo } from "../../data/demoAccounts.js";
import logo from "../../assets/nebula_logo_sem_fundo.png";
import styles from "./Login.module.css";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function entrar(event) {
    event.preventDefault();
    if (!login(email, senha)) {
      setErro("E-mail ou senha incorretos. Use uma das contas de demonstração.");
      return;
    }

    navigate("/perfil", { replace: true });
  }

  return (
    <main className={styles.page}>
      <section className={styles.loginCard}>
        <div className={styles.intro}>
          <img className={styles.brandLogo} src={logo} alt="Nebula Work" />
          <h1>Boas-vindas de volta</h1>
          <p>Acesse sua conta para salvar oportunidades e acompanhar sua jornada.</p>
        </div>

        <form className={styles.form} onSubmit={entrar}>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@exemplo.com"
            required
          />
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            placeholder="Digite sua senha"
            required
          />
          {erro && <p className={styles.error} role="alert">{erro}</p>}
          <button type="submit" className={styles.submitButton}>Entrar</button>
        </form>

        <div className={styles.demoAccounts}>
          <h2>Contas para demonstração</h2>
          <p className={styles.demoNotice}>Essas contas são locais e fictícias; não use dados pessoais.</p>
          {usuariosDemo.map((usuario) => (
            <button
              className={styles.accountButton}
              type="button"
              key={usuario.email}
              onClick={() => {
                setEmail(usuario.email);
                setSenha(usuario.senha);
                setErro("");
              }}
            >
              <span>
                <strong>{usuario.role === "admin" ? "Administradora" : usuario.role === "company" ? "Empresa" : "Pessoa candidata"}</strong>
                <small>{usuario.email} · senha: {usuario.senha}</small>
              </span>
              <small>Usar conta</small>
            </button>
          ))}
        </div>

        <Link className={styles.homeLink} to="/">Voltar à página inicial</Link>
        <p className={styles.securityNote}>Protótipo demonstrativo: autenticação e dados são armazenados apenas neste navegador.</p>
      </section>
    </main>
  );
}

export default Login;
