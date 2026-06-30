import { Banknote, Headphones, Home, MessageCircle, Router, Tv, Wifi } from 'lucide-react';

export const serviceFlows = [
  {
    id: 'financeiro',
    title: 'Fatura e pagamento',
    tag: 'Financeiro',
    icon: Banknote,
    description: 'Segunda via, PIX, boleto, comprovante, desbloqueio e duvidas de cobranca.',
    questions: [
      {
        id: 'need',
        label: 'O que voce precisa?',
        options: ['Segunda via', 'Copiar PIX', 'Informar pagamento', 'Negociar debito', 'Entender valor']
      },
      {
        id: 'paid',
        label: 'Voce ja pagou?',
        options: ['Ainda nao', 'Paguei hoje', 'Paguei ontem', 'Paguei ha mais de 2 dias']
      }
    ],
    recommendation: 'Se ja pagou, envie o comprovante junto com o resumo para agilizar a baixa.'
  },
  {
    id: 'internet',
    title: 'Internet lenta ou caindo',
    tag: 'Diagnostico',
    icon: Wifi,
    description: 'A central confere status, sinal e sintomas antes de encaminhar ao suporte.',
    questions: [
      {
        id: 'symptom',
        label: 'Como o problema aparece?',
        options: ['Lenta em todos aparelhos', 'Cai e volta sozinha', 'So funciona perto do roteador', 'Sem internet']
      },
      {
        id: 'connection',
        label: 'Como voce esta conectado?',
        options: ['Wi-Fi 2.4G', 'Wi-Fi 5G', 'Cabo de rede', 'Nao sei informar']
      },
      {
        id: 'equipment',
        label: 'O equipamento mostra algo diferente?',
        options: ['LOS vermelho', 'PON piscando', 'Reinicia sozinho', 'Luzes normais']
      }
    ],
    recommendation: 'Se houver LOS vermelho ou PON piscando, envie foto das luzes da ONU.'
  },
  {
    id: 'wifi',
    title: 'Wi-Fi e equipamento',
    tag: 'Casa conectada',
    icon: Router,
    description: 'Senha, nome da rede, alcance, roteador, ONU e reinicio seguro.',
    questions: [
      {
        id: 'wifi_issue',
        label: 'O que acontece com o Wi-Fi?',
        options: ['Senha nao conecta', 'Rede nao aparece', 'Sinal fraco', 'Quero trocar nome/senha']
      },
      {
        id: 'router_place',
        label: 'Onde fica o roteador?',
        options: ['Em local alto', 'No chao', 'Dentro de movel', 'Atras da TV', 'Longe dos comodos']
      }
    ],
    recommendation: 'Roteador em local alto e aberto melhora alcance. Evite deixar dentro de moveis.'
  },
  {
    id: 'tv',
    title: 'TV e aplicativos',
    tag: 'Entretenimento',
    icon: Tv,
    description: 'Login, travamentos, canal sem imagem, aplicativo que nao abre e TV no Wi-Fi.',
    questions: [
      {
        id: 'tv_issue',
        label: 'Qual o problema?',
        options: ['App nao abre', 'Canal sem imagem', 'Travando', 'Problema de login']
      },
      {
        id: 'tv_network',
        label: 'A TV esta conectada como?',
        options: ['Wi-Fi', 'Cabo', 'Nao sei informar']
      }
    ],
    recommendation: 'Se aparecer mensagem de erro, envie uma foto da tela no atendimento.'
  },
  {
    id: 'comercial',
    title: 'Planos e upgrade',
    tag: 'Comercial',
    icon: Home,
    description: 'Melhorar plano, contratar servicos, mudar endereco ou ampliar cobertura Wi-Fi.',
    questions: [
      {
        id: 'interest',
        label: 'O que voce procura?',
        options: ['Mais velocidade', 'Mais alcance Wi-Fi', 'TV', 'Cameras', 'Mudanca de endereco']
      },
      {
        id: 'usage',
        label: 'Uso principal',
        options: ['Trabalho', 'Jogos', 'Streaming', 'Empresa', 'Uso basico']
      }
    ],
    recommendation: 'Com essas respostas, o comercial consegue indicar um plano sem empurrar servico desnecessario.'
  },
  {
    id: 'humano',
    title: 'Falar com atendente',
    tag: 'Atendimento',
    icon: Headphones,
    description: 'Quando precisar de uma pessoa, a central envia o contexto para reduzir repeticao.',
    questions: [
      {
        id: 'sector',
        label: 'Qual setor deve receber?',
        options: ['Financeiro', 'Suporte tecnico', 'Comercial', 'Cadastro', 'Recepcao']
      },
      {
        id: 'urgency',
        label: 'Qual a urgencia?',
        options: ['Baixa', 'Media', 'Alta', 'Estou sem servico']
      }
    ],
    recommendation: 'Explique em uma frase o que aconteceu para o atendente ja iniciar com contexto.'
  }
];

export const defaultFlowId = 'internet';

export const summaryIcon = MessageCircle;
