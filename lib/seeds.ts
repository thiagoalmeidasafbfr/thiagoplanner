import { Task } from './types'

export const seedTasks: Task[] = [
  {
    id: 'seed-1',
    title: 'Redesenhar página de onboarding',
    description:
      'Revisar fluxo de onboarding para novos usuários. Simplificar os passos, adicionar tooltips contextuais e garantir responsividade em mobile.',
    status: 'doing',
    tags: ['design', 'ux', 'frontend'],
    steps: [
      { id: 's1-1', text: 'Mapear jornada atual do usuário', done: true, createdAt: '2026-06-01T09:00:00Z' },
      { id: 's1-2', text: 'Criar wireframes no Figma', done: true, createdAt: '2026-06-02T10:00:00Z' },
      { id: 's1-3', text: 'Implementar componente de progresso', done: false, createdAt: '2026-06-03T11:00:00Z' },
      { id: 's1-4', text: 'Testar com 5 usuários reais', done: false, createdAt: '2026-06-04T12:00:00Z' },
      { id: 's1-5', text: 'Ajustar com base no feedback', done: false, createdAt: '2026-06-05T13:00:00Z' },
    ],
    comments: [
      { id: 'c1-1', text: 'Alinhei com a equipe de produto — prioridade alta para esse sprint.', createdAt: '2026-06-03T14:00:00Z' },
      { id: 'c1-2', text: 'Wireframes aprovados pelo time de design. Seguindo para dev.', createdAt: '2026-06-05T16:30:00Z' },
    ],
    history: [
      { id: 'h1-1', action: 'Tarefa criada', timestamp: '2026-06-01T09:00:00Z' },
      { id: 'h1-2', action: 'Status alterado', detail: 'todo → doing', timestamp: '2026-06-02T08:00:00Z' },
      { id: 'h1-3', action: 'Etapa concluída', detail: 'Mapear jornada atual do usuário', timestamp: '2026-06-02T17:00:00Z' },
      { id: 'h1-4', action: 'Comentário adicionado', timestamp: '2026-06-03T14:00:00Z' },
      { id: 'h1-5', action: 'Etapa concluída', detail: 'Criar wireframes no Figma', timestamp: '2026-06-05T15:00:00Z' },
      { id: 'h1-6', action: 'Comentário adicionado', timestamp: '2026-06-05T16:30:00Z' },
    ],
    createdAt: '2026-06-01T09:00:00Z',
    updatedAt: '2026-06-05T16:30:00Z',
  },
  {
    id: 'seed-2',
    title: 'Integrar API de pagamentos Stripe',
    description:
      'Configurar webhooks do Stripe, implementar checkout e gerenciar estados de pagamento (pendente, confirmado, falhou). Incluir logs de auditoria.',
    status: 'todo',
    tags: ['backend', 'pagamentos', 'api'],
    steps: [
      { id: 's2-1', text: 'Criar conta e obter chaves de API', done: false, createdAt: '2026-06-08T09:00:00Z' },
      { id: 's2-2', text: 'Implementar rota de checkout', done: false, createdAt: '2026-06-08T09:00:00Z' },
      { id: 's2-3', text: 'Configurar webhooks', done: false, createdAt: '2026-06-08T09:00:00Z' },
    ],
    comments: [],
    history: [
      { id: 'h2-1', action: 'Tarefa criada', timestamp: '2026-06-08T09:00:00Z' },
    ],
    createdAt: '2026-06-08T09:00:00Z',
    updatedAt: '2026-06-08T09:00:00Z',
  },
  {
    id: 'seed-3',
    title: 'Escrever testes E2E para fluxo de login',
    description:
      'Cobrir os cenários principais de autenticação: login válido, senha errada, redefinição de senha e sessão expirada. Usar Playwright.',
    status: 'done',
    tags: ['testes', 'qa', 'playwright'],
    steps: [
      { id: 's3-1', text: 'Instalar e configurar Playwright', done: true, createdAt: '2026-06-04T10:00:00Z' },
      { id: 's3-2', text: 'Teste: login com credenciais válidas', done: true, createdAt: '2026-06-04T11:00:00Z' },
      { id: 's3-3', text: 'Teste: senha incorreta mostra erro', done: true, createdAt: '2026-06-04T12:00:00Z' },
      { id: 's3-4', text: 'Teste: redefinição de senha', done: true, createdAt: '2026-06-05T09:00:00Z' },
    ],
    comments: [
      { id: 'c3-1', text: 'Todos os testes passando em CI. Merge aprovado.', createdAt: '2026-06-07T11:00:00Z' },
    ],
    history: [
      { id: 'h3-1', action: 'Tarefa criada', timestamp: '2026-06-04T10:00:00Z' },
      { id: 'h3-2', action: 'Status alterado', detail: 'todo → doing', timestamp: '2026-06-04T10:30:00Z' },
      { id: 'h3-3', action: 'Status alterado', detail: 'doing → done', timestamp: '2026-06-07T11:00:00Z' },
      { id: 'h3-4', action: 'Comentário adicionado', timestamp: '2026-06-07T11:00:00Z' },
    ],
    createdAt: '2026-06-04T10:00:00Z',
    updatedAt: '2026-06-07T11:00:00Z',
  },
  {
    id: 'seed-4',
    title: 'Migração do banco de dados para PostgreSQL 16',
    description:
      'A dependência de um serviço externo de autenticação está bloqueando a migração. Aguardando atualização do provider antes de prosseguir.',
    status: 'blocked',
    tags: ['infra', 'banco-de-dados', 'devops'],
    steps: [
      { id: 's4-1', text: 'Backup completo do banco atual', done: true, createdAt: '2026-06-06T09:00:00Z' },
      { id: 's4-2', text: 'Testar migração em staging', done: false, createdAt: '2026-06-06T09:00:00Z' },
      { id: 's4-3', text: 'Validar queries críticas no novo engine', done: false, createdAt: '2026-06-06T09:00:00Z' },
      { id: 's4-4', text: 'Migração em produção', done: false, createdAt: '2026-06-06T09:00:00Z' },
    ],
    comments: [
      { id: 'c4-1', text: 'Bloqueado: dependência de serviço externo. Ticket aberto com o suporte do provider.', createdAt: '2026-06-09T10:00:00Z' },
    ],
    history: [
      { id: 'h4-1', action: 'Tarefa criada', timestamp: '2026-06-06T09:00:00Z' },
      { id: 'h4-2', action: 'Status alterado', detail: 'todo → doing', timestamp: '2026-06-06T09:30:00Z' },
      { id: 'h4-3', action: 'Status alterado', detail: 'doing → blocked', timestamp: '2026-06-09T10:00:00Z' },
      { id: 'h4-4', action: 'Comentário adicionado', timestamp: '2026-06-09T10:00:00Z' },
    ],
    createdAt: '2026-06-06T09:00:00Z',
    updatedAt: '2026-06-09T10:00:00Z',
  },
]
