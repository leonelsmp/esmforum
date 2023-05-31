const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando cadastro de resposta', () => {
  modelo.cadastrar_pergunta('Qual o país com maior área do mundo?');
  modelo.cadastrar_pergunta('Qual o valor de PI?');
  const perguntas = modelo.listar_perguntas(); 
  
  modelo.cadastrar_resposta(perguntas[0].id_pergunta,'Rússia!');
  modelo.cadastrar_resposta(perguntas[0].id_pergunta, 'O país com maior área do mundo é a Rússia!');
  modelo.cadastrar_resposta(perguntas[1].id_pergunta, '3.14');
  
  var respostas_p0 =  modelo.get_num_respostas(perguntas[0].id_pergunta);
  var respostas_p1 =  modelo.get_num_respostas(perguntas[1].id_pergunta);
  expect(respostas_p0).toBe(2);
  expect(respostas_p1).toBe(1);

  expect(modelo.get_pergunta(perguntas[0].id_pergunta).texto ).toBe('Qual o país com maior área do mundo?');
  expect(modelo.get_pergunta(perguntas[1].id_pergunta).texto ).toBe('Qual o valor de PI?');

  expect(modelo.get_respostas(perguntas[0].id_pergunta)[0].texto ).toBe('Rússia!');
  expect(modelo.get_respostas(perguntas[0].id_pergunta)[1].texto ).toBe('O país com maior área do mundo é a Rússia!');
  expect(modelo.get_respostas(perguntas[1].id_pergunta)[0].texto ).toBe('3.14');
  expect(modelo.get_respostas(perguntas[0].id_pergunta)[0].id_resposta).toBe(modelo.get_respostas(perguntas[0].id_pergunta)[1].id_resposta -1);
});

