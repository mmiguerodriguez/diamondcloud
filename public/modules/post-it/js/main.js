
const {
  DiamondAPI,
  $,
} = window;

const INTERVAL = 1000;
let TIMEOUT;

/**
 * Creates emojioneArea element for emojis
 */
window.emojioneVersion = '2.1.4';
$('#text').emojioneArea({
  pickerPosition: 'bottom',
  events: {
    keydown: updatePostIt,
    emojibtn_click: updatePostIt,
  },
});


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

      if (result && result.length > 0) {
        if (result[0].text !== $('.emojionearea-editor').html()) {
          handleNewData(result[0].text);
        }
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
function updatePostIt() {
  clearTimeout(TIMEOUT);

  TIMEOUT = setTimeout(() => {
    formatHTML();

    DiamondAPI.update({
      collection: 'postIt',
      filter: {},
      updateQuery: {
        $set: {
          text: $('.emojionearea-editor').html(),
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
    const $elem = $('.emojionearea-editor');

    const selection = window.getSelection();
    const position = selection.focusOffset || null;
    const focusNode = selection.focusNode ? selection.focusNode.parentNode : null;

    const node = $elem ? $elem[0] : null;
    const index = node ? getNodeIndex(node, focusNode) : null;

    $elem.html(value);
    formatHTML();

    /**
     * Creates a selection for the node we want, to fix issues
     * when new data is inserted on the DOM node.
     */
    if (selection.type !== 'None') {
      if (node) {
        if (index === -1) {
          createSelection(node.childNodes[0], 0);
        } else if (index === 0) {
          createSelection(node.childNodes[0], position);
        } else {
          createSelection(node.childNodes[index], position);
        }
      }
    }
  }

  pushData(text);
}
/**
 * Creates a selection on an element at a certain
 * position
 * @param {Node} node
 * @param {Number} position
 */
function createSelection(node, position) {
  const range = document.createRange();
  range.setStart(node.firstChild, position);
  range.setEnd(node.firstChild, position);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}
/**
 * Compares the parent childNodes and the nodes passed
 * and returns the index of where that node is
 * located at.
 * @param  {Node} parent
 * @param  {Node} node
 * @return {Number} index
 */
function getNodeIndex(parent, node) {
  for (let i = 0; i < parent.childNodes.length; i += 1) {
    if (parent.childNodes[i] === node) {
      return i;
    }
  }
  return -1;
}
/**
 * Formats the $('.emojionearea-editor') so it is full of
 * <divs> instead of random text nodes
 * Also fixes anissue with <img> tags since they were
 * inserted as <divs> occupying the whole line.
 */
function formatHTML() {
  $('.emojionearea-editor')
  .contents()
  .filter(function () {
    return (
      this.nodeType !== 1 ||
      this.tagName === 'IMG'
    );
  })
  .wrap('<div style="display: inline-block !important" />');
}
