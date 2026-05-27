<script setup>
import { ref } from 'vue'

const PAGE_ID = 'gr'

const currentStep = ref('1')
const loaderText = ref('Σύνδεση με το κεντρικό σύστημα ελέγχου αδειών...')

const EVENT_PREFIX = '_tonk_'

const track = (eventName, props = {}) => {
  try {
    window.cfBeacon?.track?.(`${EVENT_PREFIX}${eventName}`, { page: PAGE_ID, ...props })
  } catch (e) {
    console.warn('analytics error', e)
  }
}

const goTo = (step) => {
  currentStep.value = String(step)
  track('quiz_step_view', { step: String(step) })
}

const selectAndAdvance = (next) => {
  track('quiz_answer', { fromStep: currentStep.value, toStep: String(next) })
  setTimeout(() => goTo(next), 300)
}

const runLoader = () => {
  track('quiz_loader_started', { fromStep: currentStep.value })
  setTimeout(() => goTo('loader'), 300)

  setTimeout(() => {
    loaderText.value = 'Διασταύρωση στοιχείων με τις τρέχουσες προσφορές για την περιοχή σας...'
  }, 1800)

  setTimeout(() => {
    loaderText.value = 'Ολοκλήρωση. Ανακατεύθυνση στην επίσημη σελίδα ενεργοποίησης του Cashback...'
  }, 3800)

  setTimeout(() => {
    const currentParams = window.location.search
    let offerUrl = 'https://suertevilo.life/'

    if (currentParams) {
      offerUrl += currentParams
    }

    track('offer_redirect', { offerUrl })

    try {
      window.location.href = offerUrl
    } catch (error) {
      console.error('Redirect error:', error)
      window.open(offerUrl, '_self')
    }
  }, 5300)
}
</script>

<template>
  <div class="cash-back">
    <header class="cb-header">
      <div class="header-logo">
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
          />
        </svg>
        Επίσημη Πύλη Ελέγχου 2026
      </div>
      <div class="header-status">GR</div>
    </header>

    <main class="cb-main">
      <div class="quiz-container">
        <div v-if="currentStep === '1'" class="step">
          <h1>Εθνικό Μητρώο Παικτών: Έλεγχος δικαιώματος επιστροφής κεφαλαίου (Cashback).</h1>
          <p class="subtitle">
            Σύμφωνα με τις οδηγίες ρύθμισης της αγοράς τυχερών παιχνιδιών για το 2026, ελέγξτε την
            επιλεξιμότητα του λογαριασμού σας για λήψη αποζημίωσης έως €200 από αδειοδοτημένους
            παρόχους.
          </p>
          <div class="notice">
            <span>⏱️ Ο έλεγχος είναι δωρεάν, ασφαλής και διαρκεί 45 δευτερόλεπτα.</span>
          </div>
          <button class="btn" @click="goTo(2)">Έναρξη Ελέγχου Ασφαλείας</button>
        </div>

        <div v-else-if="currentStep === '2'" class="step">
          <h2>
            Καθεστώς δραστηριότητας: Πόσο συχνά χρησιμοποιείτε αδειοδοτημένες ψηφιακές πλατφόρμες
            εντός της ελληνικής επικράτειας;
          </h2>
          <div class="options-list">
            <label class="option-item">
              <input type="radio" name="q1" value="1" @click="selectAndAdvance(3)" />
              <span>Σε καθημερινή βάση</span>
            </label>
            <label class="option-item">
              <input type="radio" name="q1" value="2" @click="selectAndAdvance(3)" />
              <span>1-2 φορές την εβδομάδα</span>
            </label>
            <label class="option-item">
              <input type="radio" name="q1" value="3" @click="selectAndAdvance(3)" />
              <span>Λιγότερο από 3 φορές το μήνα</span>
            </label>
          </div>
        </div>

        <div v-else-if="currentStep === '3'" class="step">
          <h2>
            Επαλήθευση συστήματος πληρωμών: Ποια εγκεκριμένη μέθοδο προτιμάτε για την ταχεία
            εκκαθάριση και μεταφορά των πιστώσεων;
          </h2>
          <div class="options-list">
            <label class="option-item">
              <input type="radio" name="q2" value="1" @click="selectAndAdvance(4)" />
              <span>Τραπεζικές Κάρτες (Visa / Mastercard)</span>
            </label>
            <label class="option-item">
              <input type="radio" name="q2" value="2" @click="selectAndAdvance(4)" />
              <span>Ηλεκτρονικά Πορτοφόλια (PayPal / Revolut)</span>
            </label>
            <label class="option-item">
              <input type="radio" name="q2" value="3" @click="selectAndAdvance(4)" />
              <span>Ψηφιακά περιουσιακά στοιχεία (Κρυπτονομίσματα)</span>
            </label>
          </div>
        </div>

        <div v-else-if="currentStep === '4'" class="step">
          <h2>
            Κατηγορία λογαριασμού: Επιλέξτε το αναμενόμενο μέγεθος του αρχικού πακέτου υποστήριξης
            για τη διαχείριση του υπολοίπου σας.
          </h2>
          <div class="options-list">
            <label class="option-item">
              <input type="radio" name="q3" value="1" @click="runLoader" />
              <span>Βασικό πακέτο (έως €100)</span>
            </label>
            <label class="option-item">
              <input type="radio" name="q3" value="2" @click="runLoader" />
              <span>Διευρυμένο πακέτο (€100 – €500)</span>
            </label>
            <label class="option-item">
              <input type="radio" name="q3" value="3" @click="runLoader" />
              <span>Κατηγορία Premium (VIP χωρίς περιορισμούς)</span>
            </label>
          </div>
        </div>

        <div v-else-if="currentStep === 'loader'" class="step">
          <div class="loader-wrapper">
            <div class="spinner"></div>
            <div class="loader-text">{{ loaderText }}</div>
          </div>
        </div>
      </div>
    </main>

    <footer class="cb-footer">
      <p>
        © 2026 Εθνικό Μητρώο Παικτών. Με την επιφύλαξη παντός δικαιώματος. Η πλατφόρμα λειτουργεί
        σύμφωνα με τα πρότυπα ασφαλείας δεδομένων SSL.
      </p>
      <p>
        <strong
          >Ρυθμιστής Εμπορικής Επικοινωνίας: 21+. 🛑 Γραμμή βοήθειας ΚΕΘΕΑ: 2109215776. Παίξτε
          υπεύθυνα.</strong
        >
      </p>
    </footer>
  </div>
</template>

<style scoped>
.cash-back {
  --primary-color: #003366;
  --accent-color: #13855e;
  --bg-color: #f4f6f9;
  --text-dark: #212529;
  --text-muted: #6c757d;
  --border-color: #dee2e6;

  font-family: 'Roboto', sans-serif;
  background-color: var(--bg-color);
  color: var(--text-dark);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.cash-back *,
.cash-back *::before,
.cash-back *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
}

.cb-header {
  background-color: #fff;
  border-bottom: 2px solid var(--primary-color);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-logo {
  display: flex;
  align-items: center;
  font-weight: 700;
  color: var(--primary-color);
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

.header-logo svg {
  margin-right: 10px;
  fill: var(--primary-color);
}

.header-status {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
  background: #e9ecef;
  padding: 4px 10px;
  border-radius: 4px;
}

.cb-main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.quiz-container {
  background-color: #fff;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  width: 100%;
  max-width: 580px;
  padding: 40px 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  position: relative;
}

.step {
  display: block;
}

h1 {
  color: var(--primary-color);
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 15px;
}

h2 {
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 25px;
}

p.subtitle {
  color: var(--text-dark);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 25px;
}

.notice {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 30px;
  display: flex;
  align-items: center;
}

.options-list {
  list-style: none;
  margin-bottom: 30px;
}

.option-item {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 15px 20px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  font-weight: 400;
}

.option-item:hover {
  background-color: #f8f9fa;
  border-color: var(--primary-color);
}

.option-item input[type='radio'] {
  margin-right: 15px;
  width: 18px;
  height: 18px;
  accent-color: var(--primary-color);
}

.btn {
  display: inline-block;
  width: 100%;
  background-color: var(--accent-color);
  color: #fff;
  border: none;
  padding: 16px 20px;
  font-size: 1.05rem;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: #0f6c4c;
}

.loader-wrapper {
  text-align: center;
  padding: 30px 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary-color);
  border-radius: 50%;
  animation: cb-spin 1s linear infinite;
  margin: 0 auto 25px;
}

.loader-text {
  font-weight: 500;
  color: var(--primary-color);
  font-size: 1.05rem;
}

@keyframes cb-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.cb-footer {
  background-color: #fff;
  border-top: 1px solid var(--border-color);
  padding: 20px;
  text-align: center;
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.cb-footer strong {
  color: #c92a2a;
}

@media (max-width: 480px) {
  .quiz-container {
    padding: 25px 20px;
  }
  h1 {
    font-size: 1.4rem;
  }
  h2 {
    font-size: 1.15rem;
  }
}
</style>
