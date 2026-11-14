import { useEffect, useState } from "react";
import { vagas } from "../../data/vagas.js";
import styles from "./Home.module.css";
import { IoMdSearch } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import logo from "../../assets/nebula_logo_sem_fundo.png";
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from "react-router";
function Home() {
  const [search, setSearch] = useState("");
  const [vagaSelecionadaId, setVagaSelecionadaId] = useState(vagas[0]?.id);
  const [searchLocalidades, setSearchLocalidades] = useState("");
  const [searchAplicada, setSearchAplicada] = useState("");
  const [localidadeAplicada, setLocalidadeAplicada] = useState("");
  const isSearching = search !== searchAplicada || searchLocalidades !== localidadeAplicada;

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchAplicada(search);
      setLocalidadeAplicada(searchLocalidades);
    }, 450);

    return () => clearTimeout(timer);
  }, [search, searchLocalidades]);

  const searchLowerCase = searchAplicada.trim().toLocaleLowerCase("pt-BR");
  const searchLocalidadesLowerCase = localidadeAplicada.trim().toLocaleLowerCase("pt-BR");
  const hasSearch = Boolean(searchLowerCase || searchLocalidadesLowerCase);

  const vagasFiltradas = vagas.filter(
    (vaga) =>
      [vaga.nome, vaga.empresa, vaga.localidade].some((campo) => campo.toLocaleLowerCase("pt-BR").includes(searchLowerCase)) &&
      vaga.localidade.toLocaleLowerCase("pt-BR").includes(searchLocalidadesLowerCase),
  );
  const vagaSelecionada = vagasFiltradas.find((vaga) => vaga.id === vagaSelecionadaId) ?? vagasFiltradas[0];
  return (
    <main className={styles.page}>
      <div className={styles.containerInputs}>
        <div className={styles.campoBusca}>
          <IoMdSearch size={25} aria-hidden="true" />
          <input className={styles.inputBusca} id="busca-vagas" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ex.: Designer, programadora" />
        </div>
        <div className={styles.campoBusca}>
          <IoLocationOutline size={25} aria-hidden="true" />
          <input
            type="search"
            id="busca-localidades"
            value={searchLocalidades}
            onChange={(event) => setSearchLocalidades(event.target.value)}
            placeholder="Cidade, estado, regiao ou remoto"
            className={styles.inputBusca}
          />
        </div>
      </div>
      {isSearching ? (
        <p className={styles.carregando} role="status">
          Carregando...
        </p>
      ) : hasSearch ? (
        <>
          <div className={styles.resultadosBusca}>
            <p className={styles.resultadoBusca}>
              {vagasFiltradas.length} {vagasFiltradas.length === 1 ? "vaga encontrada" : "vagas encontradas"}
            </p>

            <div className={styles.conteudoVagas}>
              <section className={styles.listaVagas} aria-label="Lista de vagas">
                {vagasFiltradas.length > 0 ? (
                  vagasFiltradas.map((vaga) => (
                    <button
                      className={`${styles.card} ${vaga.id === vagaSelecionada?.id ? styles.cardSelecionado : ""}`}
                      type="button"
                      key={vaga.id}
                      onClick={() => setVagaSelecionadaId(vaga.id)}
                      aria-pressed={vaga.id === vagaSelecionada?.id}
                    >
                      <span className={styles.cardCabecalho}>
                        <span className={styles.tipo}>{vaga.tipo}</span>
                        <span className={styles.publicoAlvo}>Afirmativa para {vaga.publicoAlvo.toLocaleLowerCase("pt-BR")}</span>
                      </span>
                      <span className={styles.cardTitulo}>{vaga.nome}</span>
                      <span className={styles.cardEmpresa}>{vaga.empresa}</span>
                      <span className={styles.localidade}>{vaga.localidade}</span>
                      <span className={styles.salario}>{vaga.faixaSalarial}</span>
                    </button>
                  ))
                ) : (
                  <p className={styles.semResultados}>Nenhuma vaga corresponde a essa busca.</p>
                )}
              </section>

              <aside className={styles.painelDetalhes} aria-label="Detalhes da vaga selecionada" aria-live="polite">
                {vagaSelecionada ? (
                  <>
                    <span className={styles.publicoAlvo}>Vaga afirmativa para {vagaSelecionada.publicoAlvo.toLocaleLowerCase("pt-BR")}</span>
                    <h2>{vagaSelecionada.nome}</h2>
                    <h3>{vagaSelecionada.empresa}</h3>
                    <p className={styles.detalheDescricao}>{vagaSelecionada.descricao}</p>
                    <dl className={styles.detalhesLista}>
                      <div>
                        <dt>Faixa salarial</dt>
                        <dd>{vagaSelecionada.faixaSalarial}</dd>
                      </div>
                      <div>
                        <dt>Tipo de contratação</dt>
                        <dd>{vagaSelecionada.tipo}</dd>
                      </div>
                      <div>
                        <dt>Localidade</dt>
                        <dd>{vagaSelecionada.localidade}</dd>
                      </div>
                    </dl>
                  </>
                ) : (
                  <p className={styles.semDetalhes}>Selecione uma vaga para ver os detalhes.</p>
                )}
              </aside>
            </div>
          </div>
        </>
      ) : (
        <>
          <img src={logo} className={styles.logo} alt="Nebula Work" />
          <div className={styles.logoContainer}>
            <h2>Sua próxima vaga começa aqui</h2>
            <p>Crie ou acesse uma conta para ver recomendações de vaga personalizadas.</p>
              <Link to="/login" className={styles.btnLogin2}>
                Começar
                <FaLongArrowAltRight size={25} />
              </Link>
            
          </div>
        </>
      )}
    </main>
  );
}

export default Home;
