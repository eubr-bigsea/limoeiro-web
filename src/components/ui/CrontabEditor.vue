<template>
  <div>
    <div class="mb-3">
      <label for="start-date" class="form-label">Data e hora de início</label>
      <input
        id="start-date"
        type="datetime-local"
        class="form-control form-control-sm"
        v-model="startDateTime"
      />
    </div>

    <div class="mb-3">
      <label for="recurrence" class="form-label">Recorrência</label>
      <select id="recurrence" class="form-select form-select-sm" v-model="recurrence">
        <option value="none">Disparo manual</option>
        <option value="once">Uma vez</option>
        <option value="daily">Diariamente</option>
        <option value="weekly">Semanalmente</option>
        <option value="monthly">Mensalmente</option>
        <option value="custom">Personalizado</option>
      </select>
    </div>

    <div v-if="recurrence === 'daily'" class="mb-3">
      <label for="daily-interval" class="form-label">Repetir a cada</label>
      <div class="input-group">
        <input
          id="daily-interval"
          type="number"
          class="form-control form-control-sm"
          v-model="fields.dailyInterval"
          min="1"
          placeholder="Ex: 1"
        />
        <span class="input-group-text">dias</span>
      </div>
    </div>

    <div v-if="recurrence === 'weekly'" class="mb-3">
      <label class="form-label">Dias da Semana</label>
      <div class="d-flex flex-wrap">
        <div class="form-check me-3" v-for="(day, index) in weekdays" :key="index">
          <input
            class="form-check-input"
            type="checkbox"
            :id="'weekday-' + index"
            :value="index"
            v-model="fields.weekdays"
          />
          <label class="form-check-label" :for="'weekday-' + index">{{ day }}</label>
        </div>
      </div>
    </div>

    <div v-if="recurrence === 'monthly'" class="mb-3">
      <label class="form-label">Meses</label>
      <div class="d-flex flex-wrap">
        <div
          class="form-check me-3"
          v-for="month in months"
          :key="month.value"
          :title="month.fullLabel"
        >
          <input
            class="form-check-input"
            type="checkbox"
            :id="'month-' + month.value"
            :value="month.value"
            v-model="fields.months"
          />
          <label class="form-check-label" :for="'month-' + month.value">{{ month.label }}</label>
        </div>
      </div>

      <div class="mt-3">
        <label class="form-label">Escolha uma opção:</label>
        <div>
          <input
            class="form-check-input me-1"
            type="radio"
            id="monthly-days"
            value="days"
            v-model="fields.monthlyOption"
          />
          <label class="form-check-label" for="monthly-days">Dias do mês</label>
        </div>
        <div>
          <input
            class="form-check-input me-1"
            type="radio"
            id="monthly-weekdays"
            value="weekdays"
            v-model="fields.monthlyOption"
          />
          <label class="form-check-label" for="monthly-weekdays">Dias da semana</label>
        </div>
      </div>

      <div v-if="fields.monthlyOption === 'days'" class="mt-3">
        <label class="form-label">Dias do Mês</label>
        <div class="d-flex flex-wrap">
          <div class="form-check me-3" v-for="n in 31" :key="n">
            <input
              class="form-check-input"
              type="checkbox"
              :id="'day-' + n"
              :value="n"
              v-model="fields.monthDays"
            />
            <label class="form-check-label" :for="'day-' + n">{{ n }}</label>
          </div>
          <div class="form-check me-3">
            <input
              class="form-check-input"
              type="checkbox"
              id="day-last"
              value="last"
              v-model="fields.monthDays"
            />
            <label class="form-check-label" for="day-last">Último</label>
          </div>
        </div>
      </div>

      <div v-if="fields.monthlyOption === 'weekdays'" class="mt-3">
        <label class="form-label">Dias da Semana</label>
        <div class="d-flex flex-wrap">
          <div class="form-check me-3" v-for="(day, index) in weekdays" :key="index">
            <input
              class="form-check-input"
              type="checkbox"
              :id="'monthly-weekday-' + index"
              :value="index"
              v-model="fields.monthWeekdays"
            />
            <label class="form-check-label" :for="'monthly-weekday-' + index">{{ day }}</label>
          </div>
        </div>
      </div>
    </div>

    <div v-if="recurrence === 'custom'" class="mb-3">
      <label for="custom-crontab" class="form-label">Expressão Crontab</label>
      <input
        id="custom-crontab"
        type="text"
        class="form-control form-control-sm"
        v-model="fields.customCrontab"
        @input="validateCrontab"
        placeholder="Ex: * * * * *"
      />
      <small v-if="crontabError" class="text-danger">{{ crontabError }}</small>
      <div class="mt-2">
        <p><strong>Sintaxe da expressão Crontab:</strong></p>
        <ul>
          <li><code>*</code>: Qualquer valor</li>
          <li><code>1,2,3</code>: Lista de valores</li>
          <li><code>1-5</code>: Intervalo de valores</li>
          <li><code>*/2</code>: Recorrência (a cada 2 unidades)</li>
        </ul>
        <p><strong>Formato:</strong></p>
        <p><code>minuto hora dia-do-mês mês dia-da-semana</code></p>
        <p><strong>Use números nas respectivas faixas:</strong></p>
        <p><code>0-59 0-23 1-31 1-12 0-6 (0 é domingo, 6 é sábado)</code></p>
        <p><strong>Exemplos:</strong></p>
        <ul>
          <li><code>* * * * *</code>: Executa a cada minuto</li>
          <li><code>0 12 * * 1-5</code>: Executa às 12:00 de segunda a sexta-feira</li>
          <li><code>0 */6 * * *</code>: Executa a cada 6 horas</li>
        </ul>
      </div>
    </div>

    <div
      v-if="recurrence !== 'custom' && recurrence !== 'none' && recurrence !== 'once'"
      class="mb-3"
    >
      <label for="custom-interval" class="form-label">Intervalo Personalizado</label>
      <select
        id="custom-interval"
        class="form-select form-select-sm"
        v-model="fields.customInterval"
      >
        <option value="5">A cada 5 minutos</option>
        <option value="10">A cada 10 minutos</option>
        <option value="15">A cada 15 minutos</option>
        <option value="20">A cada 20 minutos</option>
        <option value="30">A cada 30 minutos</option>
        <option value="60">A cada 1 hora</option>
      </select>
    </div>

    <div v-if="recurrence !== 'custom'" class="mt-4">
      <label>Previsão (próximas execuções, limitadas a 3)</label>
      <ul v-if="recurrence !== 'none' && recurrence !== 'custom' && computedDates.length > 0">
        <li v-for="(date, index) in computedDates" :key="index">{{ formatDate(date) }}</li>
      </ul>
      <p v-else-if="recurrence !== 'none'" class="text-danger">
        Não foi possível gerar uma previsão com as opções selecionadas.
      </p>
      <p v-else class="text-info">A execução será feita manualmente.</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

const startDateTime = ref('')

const recurrence = ref('once')

const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const months = [
  { value: 1, label: 'Jan', fullLabel: 'Janeiro' },
  { value: 2, label: 'Fev', fullLabel: 'Fevereiro' },
  { value: 3, label: 'Mar', fullLabel: 'Março' },
  { value: 4, label: 'Abr', fullLabel: 'Abril' },
  { value: 5, label: 'Mai', fullLabel: 'Maio' },
  { value: 6, label: 'Jun', fullLabel: 'Junho' },
  { value: 7, label: 'Jul', fullLabel: 'Julho' },
  { value: 8, label: 'Ago', fullLabel: 'Agosto' },
  { value: 9, label: 'Set', fullLabel: 'Setembro' },
  { value: 10, label: 'Out', fullLabel: 'Outubro' },
  { value: 11, label: 'Nov', fullLabel: 'Novembro' },
  { value: 12, label: 'Dez', fullLabel: 'Dezembro' },
]

const fields = reactive({
  dailyInterval: 1,
  weeklyInterval: 1,
  weekdays: [], // Changed from a single `weekday` value to an array for multiple selection
  months: [],
  monthlyOption: 'days',
  monthDays: [],
  monthWeekdays: [],
  customCrontab: '', // Field for custom crontab expression
  customInterval: null, // Added field for custom interval
})

const crontabError = ref('')

const validateCrontab = () => {
  const crontabRegex =
    /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/
  if (!crontabRegex.test(fields.customCrontab)) {
    crontabError.value = 'Expressão crontab inválida. Use o formato: * * * * *'
  } else {
    crontabError.value = ''
  }
}

const computedDates = computed(() => {
  if (recurrence.value === 'none') return [] // No dates for manual trigger

  const dates = []
  const start = new Date(startDateTime.value)
  if (isNaN(start.getTime())) return dates

  let current = new Date(start)
  let attempts = 0 // Prevent infinite loops
  while (dates.length < 3 && attempts < 100) {
    attempts++
    if (recurrence.value === 'once') {
      dates.push(new Date(current))
      break
    } else if (recurrence.value === 'daily') {
      dates.push(new Date(current))
      current.setDate(current.getDate() + fields.dailyInterval)
    } else if (recurrence.value === 'weekly') {
      current.setDate(current.getDate() + 1)
      if (fields.weekdays.length === 0 || fields.weekdays.includes(current.getDay())) {
        dates.push(new Date(current))
      }
    } else if (recurrence.value === 'monthly') {
      if (fields.months.includes(current.getMonth() + 1)) {
        if (fields.monthlyOption === 'days') {
          if (
            fields.monthDays.length === 0 ||
            fields.monthDays.includes(current.getDate()) ||
            (fields.monthDays.includes('last') && isLastDayOfMonth(current))
          ) {
            dates.push(new Date(current))
          }
        } else if (fields.monthlyOption === 'weekdays') {
          if (
            fields.monthWeekdays.length === 0 ||
            fields.monthWeekdays.includes(current.getDay())
          ) {
            dates.push(new Date(current))
          }
        }
      }
      current.setDate(1)
      current.setMonth(current.getMonth() + 1)
    } else if (recurrence.value === 'custom' && fields.customInterval) {
      const interval = parseInt(fields.customInterval)
      if (!isNaN(interval)) {
        current.setMinutes(current.getMinutes() + interval)
        dates.push(new Date(current))
      }
    }
  }

  // If no valid dates were generated, clear the array
  if (dates.length === 0 || attempts >= 100) {
    return []
  }

  return dates
})

const isLastDayOfMonth = (date) => {
  const testDate = new Date(date)
  testDate.setDate(testDate.getDate() + 1)
  return testDate.getDate() === 1
}

const formatDate = (date) => {
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
  })
  return formatter.format(date)
}
</script>
<style scoped>
.form-check {
  min-width: 50px;
  text-align: center;
}
</style>
