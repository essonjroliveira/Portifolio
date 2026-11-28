/*
 * Todo o texto e todos os links da página ficam aqui.
 * Para mudar uma frase, um preço ou um link, mexa só neste arquivo.
 * Fotos e avaliações: veja o README.
 */
window.LINKS = {
  // mensagem pronta que abre no WhatsApp ao tocar em "Agendar"
  whatsapp: 'https://wa.me/5541995654046?text=' + encodeURIComponent('Olá, Carolina! Vi seu site e quero agendar minha aula grátis.'),
  whatsappText: '(41) 99565-4046',
  linkedin: 'https://www.linkedin.com/in/carolina-abreu-engenharia/',
  linkedinText: 'linkedin.com/in/carolina-abreu-engenharia',
  email: 'carolinaluiza.6@gmail.com',
};

/* Fotos: cada uma tem versão .jpg e .webp em assets/img.
   Deixe o nome vazio ('') para mostrar um espaço reservado no lugar da foto. */
window.PHOTOS = {
  hero: 'carolina-capa',               // retrato 4:5, arquivos -600 e -900
  contact: 'carolina-contato',         // quadrada, arquivos -320 e -640
  certificate: 'certificado-google',   // certificado inteiro e -thumb
};

window.CONTENT = {
  meta: { title: 'Carolina Abreu | Aulas de Excel, Power BI, SQL e Python' },
  ui: { skip: 'Pular para o conteúdo', top: 'Voltar ao topo', newTab: '(abre em nova aba)', close: 'Fechar', theme: 'Tema', system: 'Sistema', light: 'Claro', dark: 'Escuro', photoSoon: 'Foto em breve' },
  nav: {
    lessons: 'Aulas', path: 'Trilha', audience: 'Para quem', about: 'Sobre', cases: 'Na prática', reviews: 'Avaliações', price: 'Valores', contact: 'Contato',
  },

  hero: {
    kicker: 'Aulas online de Excel, Power BI, SQL e Python',
    title: 'Aprenda dados com quem usa dados todos os dias.',
    intro: 'Sou Carolina Abreu, analista de dados e engenheira de produção. Dou aulas particulares online, do básico ao avançado, com exercícios baseados em situações reais do mercado e um plano montado para o seu objetivo.',
    ctaBook: 'Agendar aula grátis',
    ctaLessons: 'Ver o que eu ensino',
    photoAlt: 'Foto de Carolina Abreu',
    tags: ['1ª aula grátis', 'Embaixadora Superprof', '5 estrelas'],
    highlights: [
      { title: 'Aula do seu jeito', text: 'Material preparado para a sua área, o seu nível e o que você precisa resolver.' },
      { title: 'Exercícios reais', text: 'Fórmulas, bases e dashboards como os do dia a dia das empresas, não só teoria.' },
      { title: 'No seu ritmo', text: 'Explicação clara e paciente, e seguimos juntos até você entender de verdade.' },
    ],
  },

  lessons: {
    title: 'O que eu ensino',
    lead: 'As mesmas ferramentas que uso no meu trabalho como analista de dados. Você escolhe por onde começar.',
    items: [
      { tool: 'Excel', text: 'Do essencial ao avançado: fórmulas, tratamento de dados, tabelas dinâmicas e gráficos que respondem perguntas.', chips: ['Fórmulas', 'Tabela dinâmica', 'Gráficos'] },
      { tool: 'Power Query e VBA', text: 'Automatize o trabalho repetitivo: junte arquivos, limpe bases desorganizadas e crie rotinas que rodam sozinhas.', chips: ['Automação', 'Limpeza de dados', 'Macros'] },
      { tool: 'Power BI', text: 'Dashboards interativos e indicadores que mostram o resultado com clareza para quem toma decisões.', chips: ['Dashboards', 'Indicadores', 'Relatórios'] },
      { tool: 'Google Sheets', text: 'Planilhas na nuvem para trabalhar em equipe, com as funções e os recursos mais usados no dia a dia.', chips: ['Colaboração', 'Funções', 'Nuvem'] },
      { tool: 'SQL e Python', text: 'O próximo passo na área de dados: consultar bancos de dados e automatizar análises com código.', chips: ['Consultas', 'Bancos de dados', 'Automação'] },
    ],
    cta: { title: 'Não sabe por onde começar?', text: 'Na aula grátis, a gente conversa sobre o seu objetivo e eu monto o plano com você.', button: 'Agendar aula grátis' },
  },

  path: {
    title: 'Do básico ao avançado',
    lead: 'As aulas são organizadas em módulos progressivos. Você começa no ponto em que está e avança no seu ritmo, sem precisar fazer a trilha inteira.',
    steps: [
      { level: 'Iniciante', title: 'Excel essencial', text: 'Organizar planilhas, formatar dados e usar as fórmulas básicas com segurança.' },
      { level: 'Intermediário', title: 'Fórmulas e tabelas dinâmicas', text: 'PROCV, SE, funções de texto e data, e tabelas dinâmicas para resumir grandes bases.' },
      { level: 'Avançado', title: 'Power Query e VBA', text: 'Tratar dados de várias fontes e automatizar tarefas que hoje tomam horas.' },
      { level: 'Avançado', title: 'Power BI e dashboards', text: 'Transformar dados em painéis interativos e indicadores para a tomada de decisão.' },
      { level: 'Área de dados', title: 'SQL e Python', text: 'Consultar bancos de dados e automatizar análises, para quem quer ir além da planilha.' },
    ],
  },

  audience: {
    title: 'Para quem são as aulas',
    lead: 'Para quem quer sair de cada aula com domínio real do conteúdo, e não apenas com passos memorizados.',
    items: [
      { title: 'Iniciantes', text: 'Para quem trava nas fórmulas ou nunca usou o Excel de verdade. Começamos do zero, sem pressa.' },
      { title: 'Estudantes', text: 'Para quem precisa de Excel e análise de dados na faculdade, em trabalhos ou para entrar no mercado.' },
      { title: 'Profissionais', text: 'Para quem quer ganhar tempo e autonomia no trabalho. Engenheiros e profissionais de produção recebem materiais com os indicadores da sua área.' },
    ],
  },

  about: {
    title: 'Quem é a Carolina',
    paragraphs: [
      'Sou analista de dados na Senff e me formei em Engenharia de Produção pelo IFMG. Uso Power BI, Excel avançado, Google Sheets, SQL e Python todos os dias para resolver problemas reais.',
      'Minha paixão pelos dados começou com o Excel: foi ali que entendi como uma ferramenta pode organizar informações, facilitar o dia a dia e ajudar na tomada de decisões. Antes de chegar à área de dados, trabalhei com planejamento e sequenciamento da produção, montando dashboards e interpretando os dados da fábrica.',
      'Hoje ensino o que aplico no trabalho. Já ajudei colegas e alunos que enfrentavam fórmulas difíceis, bases desorganizadas ou dashboards que não mostravam o resultado esperado. Meu ensino é direto e estruturado, focado no que você realmente vai usar.',
    ],
    facts: [
      { value: '5', label: 'ferramentas que uso no dia a dia: Excel, Power BI, Google Sheets, SQL e Python' },
      { value: '8', label: 'cursos do Certificado Profissional Google Data Analytics, concluído em 2026' },
      { value: '1h', label: 'de aula grátis para você conhecer o método antes de decidir' },
    ],
    credentialsTitle: 'Formação e certificações',
    credentials: [
      { name: 'Bacharelado em Engenharia de Produção', issuer: 'IFMG, Campus Congonhas · 2017 a 2022' },
      { name: 'Certificado Profissional Google Data Analytics', issuer: 'Google, pela Coursera · setembro de 2026' },
      { name: 'Embaixadora Superprof', issuer: 'Selo dado aos professores com perfil de qualidade, diploma verificado e resposta garantida' },
    ],
    certificate: {
      title: 'Certificado Google Data Analytics',
      date: 'Concluído em 03/09/2026',
      text: 'Oito cursos práticos desenvolvidos pelo Google: preparar, limpar, analisar e apresentar dados, com planilhas, SQL, Tableau e R.',
      view: 'Ver certificado',
      soon: 'Imagem do certificado em breve',
      alt: 'Certificado Profissional Google Data Analytics de Carolina Abreu',
    },
  },

  cases: {
    title: 'Dados na prática',
    lead: 'Exemplos do meu trabalho que viram exercício em sala. É assim que as aulas ficam próximas da sua realidade.',
    context: 'O desafio',
    result: 'O que foi feito',
    lesson: 'Na aula, você aprende',
    items: [
      {
        category: 'Automação com Python',
        title: 'Centenas de planilhas viraram uma base única',
        media: { big: 'Centenas → 1', label: 'planilhas dispersas consolidadas em uma base estruturada' },
        context: 'Dados espalhados em centenas de planilhas, difíceis de juntar e de analisar.',
        result: 'Usei Python para consolidar os arquivos e transformar os dados dispersos em uma base estruturada e pronta para uso.',
        lesson: 'A mesma lógica no Power Query ou em Python: juntar arquivos, padronizar colunas e montar uma base confiável.',
        tags: ['Python', 'Consolidação de dados', 'Automação'],
      },
      {
        category: 'Excel e Power BI na indústria',
        title: 'Dashboards para acompanhar a produção',
        media: { big: 'Excel + Power BI', label: 'painéis de planejamento e indicadores de produção' },
        context: 'Na indústria, era preciso organizar e interpretar os dados da produção para planejar e sequenciar o trabalho.',
        result: 'Montei dashboards em Excel e Power BI, com tabelas dinâmicas, projeções e indicadores para acompanhar a operação.',
        lesson: 'Como sair de uma tabela crua para um painel claro, com os indicadores certos para quem vai decidir.',
        tags: ['Dashboards', 'Tabela dinâmica', 'Indicadores'],
      },
    ],
  },

  reviews: {
    title: 'O que dizem os alunos',
    lead: 'Avaliações de alunos na Superprof, onde tenho nota máxima e o selo de Embaixadora.',
    badgeTitle: 'Embaixadora Superprof',
    badgeText: 'Selo que a Superprof dá aos melhores professores da plataforma: perfil de qualidade, diploma verificado e resposta garantida.',
    stars: 'Nota 5 de 5',
    placeholder: 'Espaço reservado para as avaliações dos alunos',
  },

  price: {
    title: 'Valores',
    lead: 'Simples e sem surpresa. A primeira aula é por minha conta, para você conhecer o método.',
    value: 'R$ 60,00',
    unit: '/hora',
    note: 'Aula particular online, por videochamada',
    free: '1ª aula grátis',
    include: ['Plano montado para o seu objetivo', 'Exercícios com situações reais de mercado', 'Do básico ao avançado, no seu ritmo', 'Acompanhamento até você entender o conteúdo'],
    button: 'Agendar minha aula grátis',
  },

  contact: {
    title: 'Vamos começar?',
    text: 'Me chame no WhatsApp, conte o que você quer aprender e a gente marca a sua primeira aula, que é grátis.',
    whats: 'Agendar pelo WhatsApp',
    email: 'E-mail',
    photoAlt: 'Foto de Carolina Abreu',
    tag: '1ª aula grátis',
    location: 'Curitiba, PR · aulas online para todo o Brasil',
  },

  footer: 'Carolina Abreu · Aulas de dados',
};
