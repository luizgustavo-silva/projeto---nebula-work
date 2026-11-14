import { useState } from "react";
import { IoLocationOutline, IoSearch } from "react-icons/io5";
import { vagasStem } from "../../data/vagasStem";
import styles from "./Career.module.css";

function Career() {
  const [cargo, setCargo] = useState("");
  const [localidade, setLocalidade] = useState("");
  const [filtros, setFiltros] = useState({ cargo: "", localidade: "" });
  const [vagaSelecionada, setVagaSelecionada] = useState(null);

  const vagasFiltradas = vagasStem.filter((vaga) => {
    const termoCargo = filtros.cargo.toLocaleLowerCase("pt-BR");
    const termoLocalidade = filtros.localidade.toLocaleLowerCase("pt-BR");

    return (
      [vaga.nome, vaga.empresa, vaga.descricao].some((campo) => campo.toLocaleLowerCase("pt-BR").includes(termoCargo)) &&
      vaga.localidade.toLocaleLowerCase("pt-BR").includes(termoLocalidade)
    );
  });

  function buscarVagas(event) {
    event.preventDefault();
    setFiltros({ cargo: cargo.trim(), localidade: localidade.trim() });
    setVagaSelecionada(null);
  }

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div>
            <p className={styles.eyebrow}>CIÊNCIA, TECNOLOGIA, ENGENHARIA E MATEMÁTICA</p>
            <h1>O futuro da ciência também é feito por mulheres.</h1>
            <p className={styles.heroDescription}>Encontre oportunidades para transformar curiosidade em descobertas e ideias em inovação.</p>
          </div>
          <div className={styles.heroMark} aria-hidden="true">
            <span>STEM</span>
            <i />
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <form className={styles.searchForm} onSubmit={buscarVagas}>
          <label className={styles.searchField}>
            <span>O que você procura?</span>
            <span className={styles.inputWrap}>
              <IoSearch aria-hidden="true" />
              <input value={cargo} onChange={(event) => setCargo(event.target.value)} placeholder="Ex.: engenheira, dados, biologia" />
            </span>
          </label>
          <label className={styles.searchField}>
            <span>Onde?</span>
            <span className={styles.inputWrap}>
              <IoLocationOutline aria-hidden="true" />
              <input value={localidade} onChange={(event) => setLocalidade(event.target.value)} placeholder="Cidade, estado ou remoto" />
            </span>
          </label>
          <button className={styles.searchButton} type="submit">
            <IoSearch aria-hidden="true" />
            Buscar vagas
          </button>
        </form>

        <section className={styles.opportunities} aria-labelledby="opportunities-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionEyebrow}>SEU PRÓXIMO PASSO</p>
              <h2 id="opportunities-title">Oportunidades para mulheres em STEM</h2>
              <p>Explore vagas em ciência, tecnologia, engenharia e matemática.</p>
            </div>
            <span className={styles.resultCount}>{vagasFiltradas.length} {vagasFiltradas.length === 1 ? "oportunidade" : "oportunidades"}</span>
          </div>

          {vagaSelecionada ? (
            <section className={styles.jobDetails} aria-labelledby="job-details-title">
              <button className={styles.backButton} type="button" onClick={() => setVagaSelecionada(null)}>
                ← Voltar para as oportunidades
              </button>
              <p className={styles.breadcrumb}>Carreiras STEM <span>›</span> {vagaSelecionada.nome}</p>
              <h3 id="job-details-title">Detalhes da oportunidade: {vagaSelecionada.nome}</h3>
              <p className={styles.detailsIntro}>Conheça a faixa salarial e as informações desta oportunidade para mulheres em STEM.</p>

              <div className={styles.salaryPanel}>
                <span>Faixa salarial informada</span>
                <strong>{vagaSelecionada.faixaSalarial}</strong>
                <small>Valores apresentados como referência para esta oportunidade.</small>
              </div>

              <div className={styles.detailsGrid}>
                <div>
                  <span>Empresa</span>
                  <strong>{vagaSelecionada.empresa}</strong>
                </div>
                <div>
                  <span>Localidade</span>
                  <strong>{vagaSelecionada.localidade}</strong>
                </div>
                <div>
                  <span>Tipo de contratação</span>
                  <strong>{vagaSelecionada.tipo}</strong>
                </div>
                <div>
                  <span>Público-alvo</span>
                  <strong>{vagaSelecionada.publicoAlvo}</strong>
                </div>
              </div>

              <div className={styles.descriptionPanel}>
                <h4>Sobre o trabalho</h4>
                <p>{vagaSelecionada.descricao}</p>
              </div>
            </section>
          ) : vagasFiltradas.length > 0 ? (
            <div className={styles.cardsGrid}>
              {vagasFiltradas.map((vaga) => (
                <article className={styles.card} key={vaga.id}>
                  <div className={styles.cardTop}>
                    <span className={styles.audience}>Para mulheres</span>
                    <button
                      className={styles.arrow}
                      type="button"
                      aria-label={`Ver detalhes de ${vaga.nome}`}
                      onClick={() => setVagaSelecionada(vaga)}
                    >
                      ↗
                    </button>
                  </div>
                  <h3>{vaga.nome}</h3>
                  <p className={styles.company}>{vaga.empresa}</p>
                  <p className={styles.salary}>Faixa salarial: {vaga.faixaSalarial}</p>
                  <div className={styles.cardFooter}>
                    <span>{vaga.localidade}</span>
                    <span>{vaga.tipo}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className={styles.emptyState}>Não encontramos oportunidades com esses filtros. Tente outros termos ou localidades.</p>
          )}
        </section>
      </div>
    </main>
  );
}

export default Career;
