export const tiposOportunidade = ["Estágio", "Menor aprendiz", "Bolsista"];

const faixasSalariais = [
  [800, 1000],
  [900, 1100],
  [1000, 1200],
  [1100, 1300],
  [800, 1300],
  [900, 1200],
  [800, 1100],
  [1000, 1300],
];

export function normalizarOportunidade(vaga, indice = 0) {
  const tipoValido = tiposOportunidade.includes(vaga.tipo);
  const tipo = tipoValido ? vaga.tipo : tiposOportunidade[indice % tiposOportunidade.length];
  const [salarioMinimo, salarioMaximo] = faixasSalariais[indice % faixasSalariais.length];
  const salario = (valor) => `R$ ${valor.toLocaleString("pt-BR")}`;

  return {
    ...vaga,
    tipo,
    faixaSalarial: `${salario(salarioMinimo)} a ${salario(salarioMaximo)} por mês`,
    cargaHoraria: tipo === "Estágio" ? "6h por dia" : "4h por dia",
    faixaEtaria: "15 a 20 anos",
    publicoAlvo: "Jovens",
  };
}
