import { useEffect, useState } from "react";
import { empresas as empresasIniciais } from "../data/empresas.js";
import { usuariosDemo } from "../data/demoAccounts.js";
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
  };
}

function exigirPermissao(condicao, mensagem) {
  if (!condicao) throw new Error(mensagem);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(carregarUsuario);
  const [vagasDisponiveis, setVagasDisponiveis] = useState(() => lerArmazenamento("nebula-jobs", vagas));
  const [salvasPorUsuario, setSalvasPorUsuario] = useState(() => lerArmazenamento("nebula-saved-jobs", {}));
  const [empresas, setEmpresas] = useState(() => lerArmazenamento("nebula-companies", empresasIniciais));

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
    setVagasDisponiveis((atuais) => [...atuais, { ...vaga, id: Math.max(0, ...atuais.map((item) => item.id)) + 1, publicoAlvo: "Mulheres" }]);
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

  const vagasSalvas = user?.role === "candidate" ? (salvasPorUsuario[user.email] ?? []) : [];
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
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
