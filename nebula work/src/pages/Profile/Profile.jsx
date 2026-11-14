import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../contexts/useAuth.js";
import styles from "./Profile.module.css";

const initialJob = {
  nome: "",
  empresa: "",
  localidade: "",
  faixaSalarial: "",
  tipo: "",
  descricao: "",
};

function Profile() {
  const { user, vagas, vagasSalvas, alternarSalvo, adicionarVaga, removerVaga, empresas, atualizarEmpresa } = useAuth();
  const [vagaForm, setVagaForm] = useState(initialJob);
  const [mensagem, setMensagem] = useState("");
  const empresa = user?.role === "company" ? empresas.find((item) => item.id === user.companyId) : null;
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
          {user.role === "candidate" && "Aqui ficam as oportunidades que você salvou."}
          {user.role === "company" && "Atualize as informações públicas da sua empresa."}
        </p>
      </header>

      {mensagem && <p className={styles.successMessage} role="status">{mensagem}</p>}

      {user.role === "candidate" && (
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
      )}

      {user.role === "admin" && (
        <div className={styles.adminLayout}>
          <section className={styles.panel}>
            <h2>Adicionar oportunidade</h2>
            <p className={styles.panelDescription}>A nova vaga será exibida na busca da página inicial e marcada para mulheres.</p>
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
                <input required value={vagaForm.faixaSalarial} onChange={(event) => setVagaForm({ ...vagaForm, faixaSalarial: event.target.value })} placeholder="Ex.: R$ 5.000 a R$ 7.000 por mês" />
              </label>
              <label>
                Tipo de contratação
                <input required value={vagaForm.tipo} onChange={(event) => setVagaForm({ ...vagaForm, tipo: event.target.value })} placeholder="Ex.: Efetivo CLT" />
              </label>
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
              Iniciativa para mulheres
              <textarea required rows="3" value={empresaForm.iniciativa} onChange={(event) => setRascunhoEmpresa({ ...empresaForm, iniciativa: event.target.value })} />
            </label>
            <button type="submit" className={styles.primaryButton}>Salvar configurações</button>
          </form>
          <p className={styles.panelFootnote}>As configurações desta conta editam somente {empresa.nome}.</p>
        </section>
      )}
    </main>
  );
}

export default Profile;
