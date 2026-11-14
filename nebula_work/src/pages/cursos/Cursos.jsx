import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../contexts/useAuth.js";
import styles from "./cursos.module.css";

function Cursos() {
  const { user, cursos, cursosInscritos, inscreverEmCurso } = useAuth();
  const [busca, setBusca] = useState("");
  const termo = busca.trim().toLocaleLowerCase("pt-BR");
  const cursosFiltrados = cursos.filter((curso) =>
    [curso.titulo, curso.area, curso.universidade]
      .some((campo) => campo.toLocaleLowerCase("pt-BR").includes(termo)),
  );

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div>
            <p className={styles.eyebrow}>APRENDIZADO E INOVAÇÃO</p>
            <h1>Mais mulheres criando o futuro em STEM.</h1>
            <p className={styles.heroDescription}>
              Explore cursos demonstrativos em ciência, tecnologia, engenharia e matemática.
            </p>
          </div>
          <div className={styles.heroMark} aria-hidden="true">STEM</div>
        </div>
      </header>

      <section className={styles.content} aria-labelledby="courses-title">
        <div className={styles.listingPanel}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionEyebrow}>FORMAÇÃO PARA MULHERES</p>
              <h2 id="courses-title">Cursos em universidades</h2>
              <p>Encontre uma formação e conheça as instituições participantes.</p>
            </div>
            <span className={styles.resultCount}>
              {cursosFiltrados.length} {cursosFiltrados.length === 1 ? "curso" : "cursos"}
            </span>
          </div>

          <label className={styles.searchField}>
            <span>Buscar por curso, área ou universidade</span>
            <input
              type="search"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Ex.: programação, engenharia, universidade"
            />
          </label>

          <p className={styles.demoNotice}>
            Catálogo demonstrativo: as universidades e ofertas são fictícias e não representam instituições reais.
          </p>

          {cursosFiltrados.length ? (
            <div className={styles.cardsGrid}>
              {cursosFiltrados.map((curso) => (
                <article className={styles.card} key={curso.id}>
                  <div className={styles.cardTop}>
                    <span className={styles.audience}>Para mulheres em STEM</span>
                    <span className={styles.area}>{curso.area}</span>
                  </div>
                  <h3>{curso.titulo}</h3>
                  <p className={styles.university}>{curso.universidade}</p>
                  <p className={styles.description}>{curso.descricao}</p>
                  <div className={styles.cardFooter}>
                    <span>{curso.localidade}</span>
                    <span>{curso.modalidade}</span>
                    <span>{curso.duracao}</span>
                  </div>
                  {user?.role === "candidate" && (
                    <button
                      className={cursosInscritos.some((inscrito) => inscrito.id === curso.id) ? styles.enrolledButton : styles.enrollButton}
                      type="button"
                      disabled={cursosInscritos.some((inscrito) => inscrito.id === curso.id)}
                      onClick={() => inscreverEmCurso(curso.id)}
                    >
                      {cursosInscritos.some((inscrito) => inscrito.id === curso.id) ? "Inscrito" : "Inscrever-se"}
                    </button>
                  )}
                  {!user && (
                    <Link className={styles.enrollLink} to="/login">Entre para se inscrever</Link>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className={styles.emptyState}>Nenhum curso encontrado. Tente buscar por outra área ou universidade.</p>
          )}
        </div>

        <p className={styles.accountNote}>
          É uma universidade? <Link to="/login">Acesse a conta de demonstração</Link> para publicar e gerenciar cursos.
        </p>
      </section>
    </main>
  );
}

export default Cursos;