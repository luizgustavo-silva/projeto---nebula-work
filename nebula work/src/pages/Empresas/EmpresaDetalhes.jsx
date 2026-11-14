import { Link, useParams } from "react-router";
import { empresas } from "../../data/empresas";
import styles from "./Empresas.module.css";

function EmpresaDetalhes() {
  const { empresaId } = useParams();
  const empresa = empresas.find((item) => item.id === Number(empresaId));

  if (!empresa) {
    return (
      <main className={styles.detailPage}>
        <section className={styles.notFound}>
          <h1>Empresa não encontrada</h1>
          <p>Confira o endereço ou volte para a lista de empresas.</p>
          <Link className={styles.backLink} to="/empresas">Voltar para empresas</Link>
        </section>
      </main>
    );
  }

  const salarioMedio = empresa.salarioMedio.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

  return (
    <main className={styles.detailPage}>
      <section className={styles.detailContent}>
        <Link className={styles.breadcrumb} to="/empresas">Empresas <span>›</span> {empresa.nome}</Link>

        <header className={styles.companyHeader}>
          <span className={styles.detailMark} aria-hidden="true">{empresa.nome.slice(0, 1)}</span>
          <div>
            <p className={styles.detailEyebrow}>{empresa.setor} · {empresa.localidade}</p>
            <h1>{empresa.nome}</h1>
            <p className={styles.detailRating}>★ {empresa.avaliacao} <span>({empresa.avaliacoes.toLocaleString("pt-BR")} avaliações fictícias)</span></p>
          </div>
        </header>

        <p className={styles.detailIntro}>{empresa.descricao}</p>

        <section className={styles.statsPanel} aria-label="Indicadores fictícios da empresa">
          <div>
            <span>Salário médio mensal</span>
            <strong>{salarioMedio}</strong>
          </div>
          <div>
            <span>Vagas abertas</span>
            <strong>{empresa.vagasAbertas}</strong>
          </div>
          <div>
            <span>Salários informados</span>
            <strong>{empresa.salariosInformados.toLocaleString("pt-BR")}</strong>
          </div>
          <div>
            <span>Entrevistas</span>
            <strong>{empresa.entrevistas.toLocaleString("pt-BR")}</strong>
          </div>
        </section>

        <section className={styles.detailSection}>
          <p className={styles.detailEyebrow}>MULHERES EM STEM</p>
          <h2>Um ambiente para crescer e fazer a diferença</h2>
          <p>{empresa.iniciativa}</p>
          <div className={styles.initiativeTag}>Oportunidades destinadas a mulheres</div>
        </section>

        <section className={styles.detailSection}>
          <p className={styles.detailEyebrow}>ÁREAS DE ATUAÇÃO</p>
          <h2>Conhecimento em prática</h2>
          <p>{empresa.especialidade}</p>
        </section>

        <div className={styles.detailFooter}>
          <p>Empresa e indicadores fictícios, criados apenas para demonstração.</p>
          <Link className={styles.backLink} to="/empresas">Explorar outras empresas <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </main>
  );
}

export default EmpresaDetalhes;
