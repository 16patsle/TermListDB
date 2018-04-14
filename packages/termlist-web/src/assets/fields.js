export default [{
  name: 'term',
  type: 'short'
}, {
  name: 'desc',
  type: 'long'
}, {
  name: 'type',
  type: 'select',
  options: ['verb', 'noun', 'adjective', 'adverb', 'preposition', 'conjunction', 'pronounciation']
}, {
  name: 'date',
  type: 'date',
  immutable: true
}, {
  name: '',
  type: 'filler',
  immutable: true
}]
