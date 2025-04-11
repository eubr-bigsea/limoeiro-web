<script setup>
import {
  LucideDatabase,
  LucideInfo,
  LucideLineChart,
  LucideSearch,
  LucideTable2,
  LucideUsers,
  LucideFolder,
  LucideWrench,
} from 'lucide-vue-next'
import { ref } from 'vue'
import OffCanvasInfo from '@/components/ui/OffCanvasInfo.vue'

const showOffCanvas = ref(false)
</script>

<template>
  <main class="container py-0">
    <!-- Hero Section -->
    <section class="text-center bg-light shadow-sm rounded p-4 mb-2">
      <h1 class="display-4 fw-bold mb-3">Bem-vindo ao Catálogo de Dados</h1>
      <p class="lead mb-4">
        Descubra, explore e gerencie todos os ativos de dados da sua organização em um único lugar.
        Facilite o acesso e promova uma cultura orientada por dados.
      </p>
      <button class="btn btn-secondary bg-lemonade btn-lg" @click="showOffCanvas = true">
        Saiba Mais
      </button>
    </section>

    <!-- Features Section -->
    <section id="features" class="row row-cols-1 row-cols-md-3 g-4 mb-5">
      <div class="col">
        <div class="card h-100 text-center shadow-sm">
          <div class="card-body">
            <LucideSearch class="mb-3" size="48" color="#568f32" />
            <h5 class="card-title">Busca Avançada</h5>
            <p class="card-text">
              Encontre rapidamente os dados que você precisa com nossa ferramenta de busca
              inteligente.
            </p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100 text-center shadow-sm">
          <div class="card-body">
            <LucideInfo class="mb-3" size="48" color="#568f32" />
            <h5 class="card-title">Visualização de Metadados</h5>
            <p class="card-text">
              Veja detalhes sobre tabelas, colunas e relacionamentos de forma clara e intuitiva.
            </p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100 text-center shadow-sm">
          <div class="card-body">
            <LucideLineChart class="mb-3" size="48" color="#568f32" />
            <h5 class="card-title">Monitoramento de Qualidade</h5>
            <p class="card-text">
              Acompanhe a qualidade dos dados com métricas e indicadores atualizados.
            </p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100 text-center shadow-sm">
          <div class="card-body">
            <LucideUsers class="mb-3" size="48" color="#568f32" />
            <h5 class="card-title">Colaboração</h5>
            <p class="card-text">
              Compartilhe insights e colabore com outras equipes diretamente no catálogo.
            </p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100 text-center shadow-sm">
          <div class="card-body">
            <LucideFolder class="mb-3" size="48" color="#568f32" />
            <h5 class="card-title">Fontes de Dados</h5>
            <p class="card-text">
              Descubra as origens dos dados, como APIs, arquivos e bancos de dados.
            </p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100 text-center shadow-sm">
          <div class="card-body">
            <LucideWrench class="mb-3" size="48" color="#568f32" />
            <h5 class="card-title">Ferramentas e Sistemas</h5>
            <p class="card-text">
              Conheça as ferramentas e sistemas usados para processar e analisar dados.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call-to-Action Section -->
    <section class="text-center bg-lemonade text-white rounded p-4">
      <h2 class="h3 fw-bold mb-3">Pronto para começar?</h2>
      <p class="lead mb-4">
        Explore o Catálogo de Dados e transforme a maneira como sua organização utiliza informações.
      </p>
      <router-link
        :to="{ name: 'explore' }"
        class="btn btn-light btn-lg text-lemonade me-2"
        aria-label="Navegue pelo catálogo de dados e de modelos"
        aria-current-value="page"
      >
        <span id="explore" class="menu-text">Acessar o catálogo</span>
      </router-link>
    </section>

    <!-- Off-Canvas -->
    <OffCanvasInfo :show="showOffCanvas" position="offcanvas-end" @close="showOffCanvas = false">
      <template #default>
        <p>
          O Catálogo de Dados é uma ferramenta poderosa para gerenciar e explorar os ativos de dados
          da sua organização. Ele promove a colaboração e facilita o acesso às informações.
        </p>
        <ul>
          <li>Busca avançada para encontrar dados rapidamente.</li>
          <li>Visualização de metadados para entender os detalhes dos dados.</li>
          <li>Monitoramento de qualidade para garantir dados confiáveis.</li>
        </ul>
      </template>
    </OffCanvasInfo>
  </main>
</template>

<style>
.offcanvas {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  transform: translateX(100%);
  transition:
    transform 0.3s ease-in-out,
    visibility 0.3s ease-in-out;
}
.offcanvas.show {
  transform: translateX(0);
  visibility: visible;
}
</style>
