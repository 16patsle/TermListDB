export default class QuerySnapshotStub {
  get docs() {
    return []
  }

  get empty() {
    return true
  }

  get size() {
    return 0
  }

  forEach() {}

  get query() {
    return undefined
  }

  docChanges() {
    return []
  }

  isEqual() {
    return false
  }
}
