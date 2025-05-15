// public/state/pubsub.js
// Purpose: Publish/subscribe mechanism for state change notifications.

const listeners = new Set();
let _currentState = null; // Stores the latest state (a clone) for new subscribers

/**
 * Notifies all subscribed listeners about a state change.
 * Also updates the internal _currentState.
 * @param {object} newState - The new state object (expected to be a clone from indexState).
 */
export function notify(newState) {
  _currentState = newState;
  // console.log('[PubSub] Notifying subscribers. Current state snapshot:', _currentState);
  listeners.forEach(fn => {
    try {
      // Pass a structured clone to prevent accidental mutation of the shared _currentState
      // or direct mutation of what the listener receives if it holds onto the reference.
      fn(structuredClone(_currentState));
    } catch (error) {
      console.error("[PubSub] Error in subscriber function:", error);
    }
  });
}

/**
 * Allows modules to subscribe to state changes.
 * The callback is executed with a clone of the current state immediately upon subscription (if state exists)
 * and on every subsequent state change.
 * @param {Function} callbackFn - The function to call when the state changes.
 * @returns {Function} An unsubscribe function.
 */
export function subscribe(callbackFn) {
  if (typeof callbackFn !== 'function') {
    console.error('[PubSub] Invalid argument: subscriber callback must be a function.');
    return () => {}; // Return a no-op unsubscribe function
  }
  listeners.add(callbackFn);

  // If there's already a known state, immediately notify the new subscriber
  // This ensures new subscribers get the current state without waiting for the next change.
  if (_currentState) {
    try {
      callbackFn(structuredClone(_currentState));
    } catch (error)      {
      console.error("[PubSub] Error in new subscriber function (immediate call):", error);
    }
  }
  return () => {
    listeners.delete(callbackFn);
    // console.log('[PubSub] Listener unsubscribed.');
  };
}

console.info('[pubsub.js] Publish/subscribe module loaded.');