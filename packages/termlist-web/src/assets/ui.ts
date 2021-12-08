const errorDescriptions: {
  [k: string]: string
} = {
  'auth/invalid-email': 'E-postadressen er ikke gyldig.',
  'auth/internal-error': 'Intern feil oppstod.',
  'auth/user-not-found': 'Feil e-postadresse eller passord.',
  'auth/wrong-password': 'Feil e-postadresse eller passord.',
  generic: 'En feil oppstod.',
}

export default {
  termlist: 'Ordliste',
  allColumns: 'Alle kolonner',
  term: 'Ord',
  desc: 'Forklaring',
  type: 'Ordklasse',
  date: 'Dato',
  add: 'Legg til',
  addterm: 'Legg til ord',
  save: 'Lagre',
  editterm: 'Rediger ord',
  removeterm: 'Fjern ord',
  wanttoremove: 'Vil du fjerne dette ordet?',
  cancel: 'Avbryt',
  search: 'Søk',
  pagenumber: 'Side',
  gotopage: 'Gå til side',
  previous: 'Forrige',
  next: 'Neste',
  sortBy: 'Sorter etter ',
  defaultSort: 'Standard sortering (etter dato)',
  importTerms: 'Importer',
  exportTerms: 'Eksporter',
  trelloImportInstructions: 'For å importere ord, velg en eksportfil.',
  downloadExportInstructions:
    "Trykk på 'Last ned' for å laste ned eksporterte ord",
  browseForFile: 'Velg en fil…',
  processingImport: 'Importerer…',
  processingExport: 'Eksporterer…',
  download: 'Last ned',
  wordClasses: {
    verb: 'Verb',
    noun: 'Substantiv',
    adjective: 'Adjektiv',
    adverb: 'Adverb',
    preposition: 'Preposisjon',
    conjunction: 'Konjunksjon',
    pronounciation: 'Uttale',
  },
  logIn: 'Logg inn',
  logOut: 'Logg ut',
  noTermsMatching: 'Ingen ord matcher.',
  selectTermType: 'Velg en ordklasse...',
  unsavedWarningTitle: 'Ikke-lagrede endringer',
  unsavedWarningText: 'Du har endringer som ikke er lagret. Vil du lagre?',
  discard: 'Forkast',
  close: 'Lukk',
  email: 'E-post',
  password: 'Passord',
  tools: 'Verktøy',
  loading: 'Laster…',
  duplicates: 'Duplikater',
  checkForDuplicates: 'Sjekk etter duplikater',
  processingDedupe: 'Sjekker etter duplikater…',
  errorDescriptions,
}
