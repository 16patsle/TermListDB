const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.documentWriteListener = functions.firestore
  .document('users/{userId}/termlists/{documentId}')
  .onWrite((change, context) => {
    if (!change.before.exists) {
      // New document Created : add one to count

      // Check if event already handled
      const eventRef = db.collection('eventsHandled').doc(context.eventId);
      return shouldHandle(eventRef).then(handle => {
        if (handle) {
          db.collection('users')
            .doc(context.params.userId)
            .update({
              termlists_total: admin.firestore.FieldValue.increment(1)
            });
          return markHandled(eventRef);
        }
        return false
      });
    } else if (change.before.exists && change.after.exists) {
      // Updating existing document : Do nothing
    } else if (!change.after.exists) {
      // Deleting document : subtract one from count

      // Check if event already handled
      const eventRef = db.collection('eventsHandled').doc(context.eventId);
      return shouldHandle(eventRef).then(handle => {
        if (handle) {
          db.collection('users')
            .doc(context.params.userId)
            .update({
              termlists_total: admin.firestore.FieldValue.increment(-1)
            });
          return markHandled(eventRef);
        }
        return false
      });
    }

    return;
  });

function shouldHandle(eventRef) {
  return eventRef.get().then(eventDoc => {
    return !eventDoc.exists || !eventDoc.data().handled;
  });
}

function markHandled(eventRef) {
  return eventRef.set({ handled: true });
}
