const { DiamondAPI } = window;
const INTERVAL = 1000;

let TIMEOUT;

window.onload = () => {
  /**
   * When module loads, DiamondAPI gets the data it has at first time
   * to check if we need to insert some startup data
   */
  DiamondAPI.get({
    collection: 'postIt',
    filter: {},
    callback: (error, result) => {
      if (error) {
        console.error(error);
      }

      /**
       * If we really need a startup data since there is none, then
       * we insert this data
       * If not we just handle this data to the handleNewData
       * function
       */
      if (!result || result.length === 0) {
        insertStartupData((error, result) => {
          if (error) {
            console.error(error);
          }
        });
      } else {
        handleNewData(result[0].text);
      }
    },
  });

  /**
   * Finally we subscribe to the data
   */
  DiamondAPI.subscribe({
    collection: 'postIt',
    filter: {},
    callback(error, result) {
      if (error) {
        console.error(error);
      }

      if (!!result && result.length > 0) {
        handleNewData(result[0].text);
      }
    },
  });
};

/**
 * insertStartupData(callback)
 * callback: Function
 *
 * Called when we need to insert startup data for the module.
 * TODO: Deprecate this.
 */
function insertStartupData(callback) {
  DiamondAPI.insert({
    collection: 'postIt',
    object: {
      text: '',
    },
    isGlobal: false,
    callback,
  });
}

/**
 * updatePostIt(e, key)
 * e: String // input or textarea target
 * key: String // text
 *
 * Called on the keyDown of the <input> and <textarea> elements.
 * It contains a timeout that is removed when the function gets
 * called again, since we want to update the data once every
 * 1000 ms.
 */
function updatePostIt(e) {
  clearTimeout(TIMEOUT);

  TIMEOUT = setTimeout(() => {
    DiamondAPI.update({
      collection: 'postIt',
      filter: {},
      updateQuery: {
        $set: {
          text: e.value,
        },
      },
      callback(error) {
        if (error) {
          console.error(error);
        }
      },
    });
  }, INTERVAL);
}

/**
 * handleNewData(data)
 * data: Object // text
 *
 * Handles the new data either called from the subscription
 * or the first APIGet and gives it to the respective
 * <input> and <textarea> elements.
 */
function handleNewData(text) {
  /**
   * pushData(e, value)
   * e: String // DOM Element Id
   * value: String // Value of the element
   *
   * Sets the value for a DOM element
   */
  function pushData(value) {
    const elem = document.getElementById('text');
    elem.value = value;
  }

  pushData(text);
}
