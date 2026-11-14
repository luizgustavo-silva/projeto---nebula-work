import { useState } from "react";
import { Link } from "react-router";
import { IoLocationOutline, IoSearch } from "react-icons/io5";
import { empresas } from "../../data/empresas";
import styles from "./Empresas.module.css";

const setores = [...new Set(empresas.map((empresa) => empresa.setor))].sort((a, b) => a.localeCompare(b, "pt-BR"));

function Empresas() {
  const [nome, setNome] = useState("");
  const [localidade, setLocalidade] = useState("");
  const [setor, setSetor] = useState("");

  const empresasFiltradas = empresas.filter((empresa) => {
    const nomeBusca = nome.trim().toLocaleLowerCase("pt-BR");
    const localBusca = localidade.trim().toLocaleLowerCase("pt-BR");

    return (
      empresa.nome.toLocaleLowerCase("pt-BR").includes(nomeBusca) &&
      empresa.localidade.toLocaleLowerCase("pt-BR").includes(localBusca) &&
      (!setor || empresa.setor === setor)
    );
  });

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>EMPRESAS QUE ABREM CAMINHOS</p>
          <h1>Pesquise empresas</h1>
          <p>Conheça empresas de ciência, tecnologia e engenharia com iniciativas para mulheres.</p>
        </div>
      </header>

      <section className={styles.content} aria-labelledby="search-title">
        <h2 id="search-title">Encontre uma empresa</h2>
        <div className={styles.searchBar}>
          <label className={styles.searchField}>
            <IoSearch aria-hidden="true" />
            <input value={nome} onChange={(event) => setNome(event.target.value)} placeholder="Nome da empresa" aria-label="Nome da empresa" />
          </label>
          <label className={styles.searchField}>
            <IoLocationOutline aria-hidden="true" />
            <input value={localidade} onChange={(event) => setLocalidade(event.target.value)} placeholder="Localização" aria-label="Localização" />
          </label>
          <button
            className={styles.clearButton}
            type="button"
            onClick={() => {
              setNome("");
              setLocalidade("");
              setSetor("");
            }}
            disabled={!nome && !localidade && !setor}
          >
            Limpar
          </button>
        </div>

        <div className={styles.filters}>
          <label className={styles.filterLabel} htmlFor="filtro-setor">Setor</label>
          <select id="filtro-setor" value={setor} onChange={(event) => setSetor(event.target.value)}>
            <option value="">Todos os setores</option>
            {setores.map((nomeSetor) => (
              <option key={nomeSetor} value={nomeSetor}>{nomeSetor}</option>
            ))}
          </select>
        </div>

        <p className={styles.resultsCount} aria-live="polite">
          {empresasFiltradas.length} {empresasFiltradas.length === 1 ? "empresa encontrada" : "empresas encontradas"}
        </p>

        {empresasFiltradas.length > 0 ? (
          <div className={styles.companyList}>
            {empresasFiltradas.map((empresa) => (
              <Link className={styles.companyCard} to={`/empresas/${empresa.id}`} key={empresa.id}>
                <span className={styles.companyMark} aria-hidden="true">{empresa.nome.slice(0, 1)}</span>
                <span className={styles.companyInfo}>
                  <span className={styles.companyTitle}>{empresa.nome} <span className={styles.rating}>★ {empresa.avaliacao}</span></span>
                  <span className={styles.companyDescription}>{empresa.descricao}</span>
                  <span className={styles.companyLocation}>{empresa.localidade} · {empresa.setor}</span>
                  <span className={styles.metrics}>
                    <span><strong>{empresa.avaliacoes.toLocaleString("pt-BR")}</strong> avaliações</span>
                    <span><strong>{empresa.salariosInformados.toLocaleString("pt-BR")}</strong> salários</span>
                    <span><strong>{empresa.entrevistas.toLocaleString("pt-BR")}</strong> entrevistas</span>
                  </span>
                </span>
                <span className={styles.openings}>
                  {empresa.vagasAbertas} vagas abertas
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>Não encontramos empresas com esses filtros. Experimente outros termos.</p>
        )}

        <p className={styles.disclaimer}>Empresas e indicadores fictícios, criados apenas para demonstração.</p>
      </section>
    </main>
  );
}

export default Empresas;
