<script setup>
import {
  LucideChartArea,
  LucideDatabase,
  LucideInfo,
  LucideLineChart,
  LucideSearch,
  LucideTable2,
  LucideUsers,
} from 'lucide-vue-next'
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <main class="px-4">
    <div class="row">
      <div class="col-6">
        <h1>Bem-vindo ao Catálogo de Dados</h1>
        <p>
          <strong>O Catálogo de Dados</strong> é a sua porta de entrada para explorar, descobrir e
          gerenciar todos os ativos de dados da organização. Aqui, você encontrará informações
          detalhadas sobre fontes de dados, bancos de dados, tabelas, modelos de machine learning,
          sistemas e muito mais. Nosso objetivo é facilitar o acesso e o entendimento dos dados,
          promovendo uma cultura data-driven e eficiente.
        </p>
      </div>
      <div class="col-6">
        <h2>Recursos em Destaque</h2>
        <div>
          <ul>
            <li>
              <strong><LucideSearch /> Busca Avançada</strong>: Encontre rapidamente os dados que
              você precisa com nossa ferramenta de busca inteligente.
            </li>
            <li>
              <strong><LucideInfo /> Visualização de Metadados</strong>: Veja detalhes sobre
              tabelas, colunas e relacionamentos de forma clara e intuitiva.
            </li>
            <li>
              <strong><LucideLineChart /> Monitoramento de Qualidade</strong>: Acompanhe a qualidade
              dos dados com métricas e indicadores atualizados.
            </li>
            <li>
              <strong><LucideUsers /> Colaboração</strong>: Compartilhe insights e colabore com
              outras equipes diretamente no catálogo.
            </li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <h2>Explore o Catálogo</h2>
          <p>Navegue pelos principais componentes do catálogo:</p>
          <ul>
            <li>
              <strong>📊 Fontes de Dados</strong>: Descubra as origens dos dados, como APIs,
              arquivos, bancos de dados e muito mais.
            </li>
            <li>
              <strong>🗃️ Bancos de Dados</strong>: Acesse informações sobre bancos de dados
              disponíveis, incluindo localização e responsáveis.
            </li>
            <li>
              <strong>📑 Esquemas e Tabelas</strong>: Entenda a estrutura dos dados com detalhes
              sobre esquemas, tabelas e colunas.
            </li>
            <li>
              <strong>🤖 Modelos de Machine Learning</strong>: Explore modelos de ML, suas versões,
              algoritmos e métricas de desempenho.
            </li>
            <li>
              <strong>🛠️ Sistemas e Ferramentas</strong>: Conheça as ferramentas e sistemas usados
              para processar e analisar dados.
            </li>
          </ul>
        </div>
        <div class="col-6">
          <h2>Como Usar o Catálogo</h2>
          <ol>
            <li>
              <strong>Busque</strong>: Use a barra de pesquisa para encontrar ativos de dados por
              nome, tipo ou descrição.
            </li>
            <li>
              <strong>Explore</strong>: Navegue pelos detalhes de cada ativo, como esquemas, tabelas
              ou modelos.
            </li>
            <li>
              <strong>Colabore</strong>: Compartilhe comentários, documentação e insights com sua
              equipe.
            </li>
            <li>
              <strong>Gerencie</strong>: Contribua para a governança de dados atualizando metadados
              e reportando problemas.
            </li>
          </ol>
        </div>
        <div class="col-6">
          <h2>Destaques Recentes</h2>
          <ul>
            <li>
              <strong>Novo Modelo de Previsão de Vendas</strong>: Versão 2.0 lançada com 95% de
              acurácia.
              <a href="#">Saiba mais</a>
            </li>
            <li>
              <strong>Atualização de Metadados</strong>: Novas tabelas adicionadas ao esquema de
              Vendas.
              <a href="#">Explorar</a>
            </li>
            <li>
              <strong>Ferramenta Integrada</strong>: Apache Spark agora disponível no catálogo.
              <a href="#">Ver detalhes</a>
            </li>
          </ul>
        </div>
        <div class="col-6">
          <h2>Acesso Rápido</h2>
          <ul>
            <li><a href="#"> Fontes de Dados</a></li>
            <li>
              <a href="#"><LucideDatabase /> Bancos de Dados</a>
            </li>
            <li>
              <a href="#"><LucideTable2 /> Esquemas e Tabelas</a>
            </li>
            <li><a href="#">🔗 Modelos de ML</a></li>
            <li><a href="#">🔗 Sistemas e Ferramentas</a></li>
          </ul>
          <h2>Suporte e Documentação</h2>
          <p>
            Precisa de ajuda? Consulte nossa <a href="#">documentação</a> ou entre em contato com a
            equipe de suporte: <strong>suporte@catalogodados.com</strong>.
          </p>
          <p>
            <strong>Catálogo de Dados</strong> - Organizando e simplificando o acesso aos seus
            dados. 🚀
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
