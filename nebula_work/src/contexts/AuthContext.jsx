import { useEffect, useState } from "react";
import { empresas as empresasIniciais } from "../data/empresas.js";
import { usuariosDemo } from "../data/demoAccounts.js";
import { cursosIniciais, universidades } from "../data/cursos.js";
import { normalizarOportunidade } from "../data/opportunity.js";
import { vagas } from "../data/vagas.js";
import { AuthContext } from "./AuthContextStore.js";

function lerArmazenamento(chave, valorInicial) {
  const valorSalvo = window.localStorage.getItem(chave);
  if (!valorSalvo) return valorInicial;

  try {
    return JSON.parse(valorSalvo);
  } catch (error) {
    console.error(`Não foi possível ler os dados locais de "${chave}".`, error);
    return valorInicial;
  }
}

function carregarUsuario() {
  const salvo = lerArmazenamento("nebula-session", null);
  const usuario = usuariosDemo.find((item) => item.email === salvo?.email);
  return usuario ? dadosPublicosUsuario(usuario) : null;
}

function dadosPublicosUsuario(usuario) {
  return {
    email: usuario.email,
    nome: usuario.nome,
    role: usuario.role,
    ...(usuario.companyId ? { companyId: usuario.companyId } : {}),
    ...(usuario.universityId ? { universityId: usuario.universityId } : {}),
  };
}

function exigirPermissao(condicao, mensagem) {
  if (!condicao) throw new Error(mensagem);
}

function carregarVagas() {
  const vagasSalvas = lerArmazenamento("nebula-jobs", null);
  if (!Array.isArray(vagasSalvas)) return vagas;

  const chaveMigracao = "nebula-jobs-joinville-v1";
  const jaMigradas = window.localStorage.getItem(chaveMigracao) === "true";
  const idsSalvos = new Set(vagasSalvas.map((vaga) => vaga.id));
  const novasVagas = jaMigradas ? [] : vagas.filter((vaga) => vaga.id >= 41 && !idsSalvos.has(vaga.id));

  if (!jaMigradas) window.localStorage.setItem(chaveMigracao, "true");

  return [...vagasSalvas, ...novasVagas].map((vaga, indice) => normalizarOportunidade(vaga, indice));
}

function carregarEmpresas() {
  const empresasSalvas = lerArmazenamento("nebula-companies", empresasIniciais);
  if (!Array.isArray(empresasSalvas)) return empresasIniciais;

  const idsSalvos = new Set(empresasSalvas.map((empresa) => empresa.id));
  return [...empresasSalvas, ...empresasIniciais.filter((empresa) => !idsSalvos.has(empresa.id))];
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(carregarUsuario);
  const [vagasDisponiveis, setVagasDisponiveis] = useState(carregarVagas);
  const [salvasPorUsuario, setSalvasPorUsuario] = useState(() => lerArmazenamento("nebula-saved-jobs", {}));
  const [empresas, setEmpresas] = useState(carregarEmpresas);
  const [cursos, setCursos] = useState(() => lerArmazenamento("nebula-courses", cursosIniciais));
  const [inscricoesPorUsuario, setInscricoesPorUsuario] = useState(() => lerArmazenamento("nebula-course-enrollments", {}));

  useEffect(() => {
    if (user) window.localStorage.setItem("nebula-session", JSON.stringify({ email: user.email }));
    else window.localStorage.removeItem("nebula-session");
  }, [user]);

  useEffect(() => {
    window.localStorage.setItem("nebula-jobs", JSON.stringify(vagasDisponiveis));
  }, [vagasDisponiveis]);

  useEffect(() => {
    window.localStorage.setItem("nebula-saved-jobs", JSON.stringify(salvasPorUsuario));
  }, [salvasPorUsuario]);

  useEffect(() => {
    window.localStorage.setItem("nebula-companies", JSON.stringify(empresas));
  }, [empresas]);

  useEffect(() => {
    window.localStorage.setItem("nebula-courses", JSON.stringify(cursos));
  }, [cursos]);

  useEffect(() => {
    window.localStorage.setItem("nebula-course-enrollments", JSON.stringify(inscricoesPorUsuario));
  }, [inscricoesPorUsuario]);

  function login(email, senha) {
    const usuario = usuariosDemo.find((item) => item.email === email.trim().toLowerCase() && item.senha === senha);
    if (!usuario) return false;

    setUser(dadosPublicosUsuario(usuario));
    return true;
  }

  function logout() {
    setUser(null);
  }

  function alternarSalvo(id) {
    exigirPermissao(user?.role === "candidate", "Somente contas de pessoa candidata podem salvar vagas.");
    setSalvasPorUsuario((atuais) => {
      const ids = atuais[user.email] ?? [];
      const novosIds = ids.includes(id) ? ids.filter((itemId) => itemId !== id) : [...ids, id];
      return { ...atuais, [user.email]: novosIds };
    });
  }

  function adicionarVaga(vaga) {
    exigirPermissao(user?.role === "admin", "Somente a conta administradora pode adicionar vagas.");
    setVagasDisponiveis((atuais) => [...atuais, normalizarOportunidade({ ...vaga, id: Math.max(0, ...atuais.map((item) => item.id)) + 1 }, atuais.length)]);
  }

  function removerVaga(id) {
    exigirPermissao(user?.role === "admin", "Somente a conta administradora pode remover vagas.");
    setVagasDisponiveis((atuais) => atuais.filter((vaga) => vaga.id !== id));
    setSalvasPorUsuario((atuais) => Object.fromEntries(Object.entries(atuais).map(([email, ids]) => [email, ids.filter((itemId) => itemId !== id)])));
  }

  function atualizarEmpresa(id, alteracoes) {
    exigirPermissao(user?.role === "company" && user.companyId === id, "Sua conta não pode editar esta empresa.");
    setEmpresas((atuais) => atuais.map((empresa) => (empresa.id === id ? { ...empresa, ...alteracoes } : empresa)));
  }

  function adicionarCurso(curso) {
    exigirPermissao(user?.role === "university", "Somente contas de universidade podem adicionar cursos.");
    const universidade = universidades.find((item) => item.id === user.universityId);
    exigirPermissao(Boolean(universidade), "Não foi possível localizar a universidade desta conta.");
    setCursos((atuais) => [
      ...atuais,
      {
        id: Math.max(0, ...atuais.map((item) => item.id)) + 1,
        universidadeId: user.universityId,
        universidade: universidade.nome,
        localidade: universidade.localidade,
        titulo: curso.titulo.trim(),
        area: curso.area.trim(),
        modalidade: curso.modalidade.trim(),
        duracao: curso.duracao.trim(),
        descricao: curso.descricao.trim(),
      },
    ]);
  }

  function removerCurso(id) {
    exigirPermissao(user?.role === "university", "Somente contas de universidade podem remover cursos.");
    exigirPermissao(
      cursos.some((curso) => curso.id === id && curso.universidadeId === user.universityId),
      "Sua conta não pode remover este curso.",
    );
    setCursos((atuais) => atuais.filter((curso) => curso.id !== id));
    setInscricoesPorUsuario((atuais) => Object.fromEntries(
      Object.entries(atuais).map(([email, ids]) => [email, ids.filter((cursoId) => cursoId !== id)]),
    ));
  }

  function inscreverEmCurso(id) {
    exigirPermissao(user?.role === "candidate", "Somente contas de pessoa candidata podem se inscrever em cursos.");
    exigirPermissao(cursos.some((curso) => curso.id === id), "Este curso não está mais disponível.");
    setInscricoesPorUsuario((atuais) => {
      const ids = atuais[user.email] ?? [];
      return ids.includes(id) ? atuais : { ...atuais, [user.email]: [...ids, id] };
    });
  }

  function cancelarInscricaoCurso(id) {
    exigirPermissao(user?.role === "candidate", "Somente contas de pessoa candidata podem cancelar inscrições.");
    setInscricoesPorUsuario((atuais) => {
      const ids = atuais[user.email] ?? [];
      return { ...atuais, [user.email]: ids.filter((cursoId) => cursoId !== id) };
    });
  }

  const vagasSalvas = user?.role === "candidate" ? (salvasPorUsuario[user.email] ?? []) : [];
  const cursosInscritos = user?.role === "candidate"
    ? cursos.filter((curso) => (inscricoesPorUsuario[user.email] ?? []).includes(curso.id))
    : [];
  const valor = {
      user,
      login,
      logout,
      vagas: vagasDisponiveis,
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
      inscreverEmCurso,
      cancelarInscricaoCurso,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
