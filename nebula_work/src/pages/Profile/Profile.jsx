import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../contexts/useAuth.js";
import { universidades } from "../../data/cursos.js";
import { tiposOportunidade } from "../../data/opportunity.js";
import styles from "./Profile.module.css";

const initialJob = {
  nome: "",
  empresa: "",
  localidade: "",
  tipo: tiposOportunidade[0],
  descricao: "",
};

const initialCourse = {
  titulo: "",
  area: "",
  modalidade: "Online",
  duracao: "",
  descricao: "",
};

function Profile() {
  const {
    user,
    vagas,
    vagasSalvas,
    alternarSalvo,
    adicionarVaga,
    removerVaga,
    empresas,
    atualizarEmpresa,
    cursos,
    adicionarCurso,
    removerCurso,
    cursosInscritos,
    cancelarInscricaoCurso,
  } = useAuth();
  const [vagaForm, setVagaForm] = useState(initialJob);
  const [cursoForm, setCursoForm] = useState(initialCourse);
  const [mensagem, setMensagem] = useState("");
  const empresa = user?.role === "company" ? empresas.find((item) => item.id === user.companyId) : null;
  const universidade = user?.role === "university" ? universidades.find((item) => item.id === user.universityId) : null;
  const cursosDaUniversidade = cursos.filter((curso) => curso.universidadeId === user?.universityId);
  const [rascunhoEmpresa, setRascunhoEmpresa] = useState(null);
  const empresaForm = rascunhoEmpresa ?? empresa;

  if (!user) {
    return (
      <main className={styles.page}>
        <section className={styles.noticeCard}>
          <h1>Acesse seu perfil</h1>
          <p>Entre na sua conta para ver vagas salvas ou gerenciar seu espaço.</p>
          <Link className={styles.primaryLink} to="/login">Entrar</Link>
        </section>
      </main>
    );
  }

  function enviarVaga(event) {
    event.preventDefault();
    adicionarVaga(vagaForm);
    setVagaForm(initialJob);
    setMensagem("A oportunidade foi adicionada à página inicial.");
  }

  function enviarCurso(event) {
    event.preventDefault();
    if (![cursoForm.titulo, cursoForm.area, cursoForm.modalidade, cursoForm.duracao, cursoForm.descricao].every((valor) => valor.trim())) {
      setMensagem("Preencha todos os campos do curso.");
      return;
    }

    adicionarCurso(cursoForm);
    setCursoForm(initialCourse);
    setMensagem("O curso foi publicado na aba Cursos.");
  }

  function salvarEmpresa(event) {
    event.preventDefault();
    atualizarEmpresa(empresa.id, empresaForm);
    setMensagem("As informações da empresa foram atualizadas neste navegador.");
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>ÁREA DA CONTA</p>
        <h1>Olá, {user.nome}</h1>
        <p>
          {user.role === "admin" && "Gerencie as oportunidades exibidas na página inicial."}
          {user.role === "candidate" && "Acompanhe suas vagas salvas e os cursos em que se inscreveu."}
          {user.role === "company" && "Atualize as informações públicas da sua empresa."}
          {user.role === "university" && "Publique e gerencie cursos para jovens em STEM."}
        </p>
      </header>

      {mensagem && <p className={styles.successMessage} role="status">{mensagem}</p>}

      {user.role === "candidate" && (
        <>
          <section className={styles.panel}>
            <div className={styles.panelHeading}>
              <div>
                <h2>Vagas salvas</h2>
                <p>Suas oportunidades ficam guardadas nesta conta neste navegador.</p>
              </div>
              <span className={styles.count}>{vagasSalvas.length}</span>
            </div>
            {vagasSalvas.length ? (
              <div className={styles.savedList}>
                {vagas.filter((vaga) => vagasSalvas.includes(vaga.id)).map((vaga) => (
                  <article className={styles.savedCard} key={vaga.id}>
                    <div>
                      <h3>{vaga.nome}</h3>
                      <p>{vaga.empresa} · {vaga.localidade}</p>
                      <span>{vaga.faixaSalarial}</span>
                    </div>
                    <button type="button" className={styles.secondaryButton} onClick={() => alternarSalvo(vaga.id)}>Remover</button>
                  </article>
                ))}
              </div>
            ) : (
              <p className={styles.emptyState}>Você ainda não salvou vagas. Explore a <Link to="/">página inicial</Link>.</p>
            )}
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeading}>
              <div>
                <h2>Meus cursos</h2>
                <p>Veja os cursos em que você se inscreveu.</p>
              </div>
              <span className={styles.count}>{cursosInscritos.length}</span>
            </div>
            {cursosInscritos.length ? (
              <div className={styles.savedList}>
                {cursosInscritos.map((curso) => (
                  <article className={styles.savedCard} key={curso.id}>
                    <div>
                      <h3>{curso.titulo}</h3>
                      <p>{curso.universidade} · {curso.area}</p>
                      <span>{curso.modalidade} · {curso.duracao}</span>
                    </div>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() => {
                        cancelarInscricaoCurso(curso.id);
                        setMensagem("A inscrição no curso foi cancelada.");
                      }}
                    >
                      Cancelar inscrição
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <p className={styles.emptyState}>Você ainda não está inscrita em cursos. Explore a <Link to="/cursos">aba Cursos</Link>.</p>
            )}
          </section>
        </>
      )}

      {user.role === "admin" && (
        <div className={styles.adminLayout}>
          <section className={styles.panel}>
            <h2>Adicionar oportunidade</h2>
            <p className={styles.panelDescription}>A nova vaga será exibida na busca da página inicial e marcada para jovens.</p>
            <form className={styles.form} onSubmit={enviarVaga}>
              <label>
                Cargo
                <input required value={vagaForm.nome} onChange={(event) => setVagaForm({ ...vagaForm, nome: event.target.value })} />
              </label>
              <label>
                Empresa
                <input required value={vagaForm.empresa} onChange={(event) => setVagaForm({ ...vagaForm, empresa: event.target.value })} />
              </label>
              <label>
                Localidade
                <input required value={vagaForm.localidade} onChange={(event) => setVagaForm({ ...vagaForm, localidade: event.target.value })} />
              </label>
              <label>
                Faixa salarial
                <input value="R$ 800 a R$ 1.300 por mês" readOnly />
              </label>
              <label>
                Tipo de contratação
                <select required value={vagaForm.tipo} onChange={(event) => setVagaForm({ ...vagaForm, tipo: event.target.value })}>
                  {tiposOportunidade.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
                </select>
              </label>
              <p className={styles.fullField}>Carga horária: {vagaForm.tipo === "Estágio" ? "6h" : "4h"} por dia · Faixa etária: 15 a 20 anos.</p>
              <label className={styles.fullField}>
                Descrição
                <textarea required rows="3" value={vagaForm.descricao} onChange={(event) => setVagaForm({ ...vagaForm, descricao: event.target.value })} />
              </label>
              <button type="submit" className={styles.primaryButton}>Adicionar vaga</button>
            </form>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeading}>
              <div>
                <h2>Gerenciar oportunidades</h2>
                <p>Remova uma oportunidade para tirá-la da página inicial.</p>
              </div>
              <span className={styles.count}>{vagas.length}</span>
            </div>
            <div className={styles.manageList}>
              {vagas.map((vaga) => (
                <article className={styles.manageItem} key={vaga.id}>
                  <div>
                    <strong>{vaga.nome}</strong>
                    <span>{vaga.empresa} · {vaga.localidade}</span>
                  </div>
                  <button type="button" className={styles.removeButton} onClick={() => removerVaga(vaga.id)}>Remover</button>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}

      {user.role === "company" && empresa && empresaForm && (
        <section className={styles.panel}>
          <h2>Configurar empresa</h2>
          <p className={styles.panelDescription}>Essas informações aparecem no perfil público da empresa.</p>
          <form className={styles.form} onSubmit={salvarEmpresa}>
            <label>
              Nome da empresa
              <input required value={empresaForm.nome} onChange={(event) => setRascunhoEmpresa({ ...empresaForm, nome: event.target.value })} />
            </label>
            <label>
              Setor
              <input required value={empresaForm.setor} onChange={(event) => setRascunhoEmpresa({ ...empresaForm, setor: event.target.value })} />
            </label>
            <label>
              Localidade
              <input required value={empresaForm.localidade} onChange={(event) => setRascunhoEmpresa({ ...empresaForm, localidade: event.target.value })} />
            </label>
            <label>
              Área de atuação
              <input required value={empresaForm.especialidade} onChange={(event) => setRascunhoEmpresa({ ...empresaForm, especialidade: event.target.value })} />
            </label>
            <label className={styles.fullField}>
              Sobre a empresa
              <textarea required rows="4" value={empresaForm.descricao} onChange={(event) => setRascunhoEmpresa({ ...empresaForm, descricao: event.target.value })} />
            </label>
            <label className={styles.fullField}>
              Iniciativa para jovens
              <textarea required rows="3" value={empresaForm.iniciativa} onChange={(event) => setRascunhoEmpresa({ ...empresaForm, iniciativa: event.target.value })} />
            </label>
            <button type="submit" className={styles.primaryButton}>Salvar configurações</button>
          </form>
          <p className={styles.panelFootnote}>As configurações desta conta editam somente {empresa.nome}.</p>
        </section>
      )}

      {user.role === "university" && universidade && (
        <div className={styles.adminLayout}>
          <section className={styles.panel}>
            <h2>Publicar curso</h2>
            <p className={styles.panelDescription}>Os cursos publicados ficam disponíveis na aba Cursos.</p>
            <form className={styles.form} onSubmit={enviarCurso}>
              <label>
                Nome do curso
                <input required value={cursoForm.titulo} onChange={(event) => setCursoForm({ ...cursoForm, titulo: event.target.value })} />
              </label>
              <label>
                Área STEM
                <input required value={cursoForm.area} onChange={(event) => setCursoForm({ ...cursoForm, area: event.target.value })} placeholder="Ex.: Tecnologia" />
              </label>
              <label>
                Modalidade
                <select required value={cursoForm.modalidade} onChange={(event) => setCursoForm({ ...cursoForm, modalidade: event.target.value })}>
                  <option>Online</option>
                  <option>Híbrido</option>
                  <option>Presencial</option>
                </select>
              </label>
              <label>
                Duração
                <input required value={cursoForm.duracao} onChange={(event) => setCursoForm({ ...cursoForm, duracao: event.target.value })} placeholder="Ex.: 8 semanas" />
              </label>
              <label className={styles.fullField}>
                Descrição
                <textarea required rows="3" value={cursoForm.descricao} onChange={(event) => setCursoForm({ ...cursoForm, descricao: event.target.value })} />
              </label>
              <button type="submit" className={styles.primaryButton}>Publicar curso</button>
            </form>
            <p className={styles.panelFootnote}>Esta conta gerencia somente cursos de {universidade.nome}.</p>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeading}>
              <div>
                <h2>Meus cursos</h2>
                <p>Remova cursos que não estão mais disponíveis.</p>
              </div>
              <span className={styles.count}>{cursosDaUniversidade.length}</span>
            </div>
            <div className={styles.manageList}>
              {cursosDaUniversidade.length ? cursosDaUniversidade.map((curso) => (
                <article className={styles.manageItem} key={curso.id}>
                  <div>
                    <strong>{curso.titulo}</strong>
                    <span>{curso.area} · {curso.modalidade} · {curso.duracao}</span>
                  </div>
                  <button type="button" className={styles.removeButton} onClick={() => removerCurso(curso.id)}>Remover</button>
                </article>
              )) : (
                <p className={styles.emptyState}>Você ainda não publicou cursos.</p>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default Profile;
