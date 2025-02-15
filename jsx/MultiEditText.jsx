/*
  MultiEditText.jsx for Adobe Photoshop
  Description: Bulk editing of text layer contents. Replaces content separately or with the same text
  Date: April, 2024
  Modification date: February, 2025
  Author: Sergey Osokin, email: hi@sergosokin.ru

  Installation: https://github.com/creold/photoshop-scripts#how-to-run-scripts

  *******************************************************************************************
  * WARNING: The script does not support the mixed appearance of characters in a text layer *
  *******************************************************************************************

  Release notes:
  0.2 Added button to reset texts, saving entered texts when switching options
  0.1 Initial version

  Donate (optional):
  If you find this script helpful, you can buy me a coffee
  - via Buymeacoffee: https://www.buymeacoffee.com/aiscripts
  - via Donatty https://donatty.com/sergosokin
  - via DonatePay https://new.donatepay.ru/en/@osokin
  - via YooMoney https://yoomoney.ru/to/410011149615582

  NOTICE:
  Tested with Adobe Photoshop CC 2019, 2024 (Mac/Win).
  This script is provided "as is" without warranty of any kind.
  Free to use, not for sale

  Released under the MIT license
  http://opensource.org/licenses/mit-license.php

  Check my other scripts: https://github.com/creold
*/

//@target photoshop

function main() {
  var SCRIPT = {
    name: 'Multi-edit Text',
    version: 'v0.2'
  };

  var CFG = {
    width: 300, // Text area width, px
    height: 240, // Text area height, px
    ph: '<text>', // Content display placeholder
    divider: '\n@@@\n', // Symbol for separating multiple text layers
    softBreak: '@#', // Soft line break char
    coordTolerance: 10, // Object alignment tolerance for sorting
    isMac: /mac/i.test($.os),
    settings: 'MET_settings'
  };

  var doc = app.activeDocument;
  var currState = doc.activeHistoryState;
  var idx = getSelectedLayersIdx();

  var texts = getTextLayers(doc.layers, idx);
  if (!texts.length) {
    alert('Texts not found\nPlease select at least 1 text object and try again', 'Script error');
    return;
  }

  var isUndo = false;

  var sortedTexts = [].concat(texts);
  sortByPosition(sortedTexts, CFG.coordTolerance);

  var contents = extractContents(texts, CFG.softBreak);
  var sortedContents = extractContents(sortedTexts, CFG.softBreak);

  // Replace End of Text (ETX) to line break
  var placeholder = isEqualContents(texts, CFG.softBreak) ? 
  texts[0].textItem.contents.replace(/\x03/g, CFG.softBreak) : CFG.ph;

  var tmpText = {
    union: '',
    separate: ''
  };

  // DIALOG
  var win = new Window('dialog', SCRIPT.name + ' ' + SCRIPT.version);
      win.orientation = 'row';
      win.alignChildren = ['fill', 'top'];

  // INPUT
  var input = win.add('edittext', [0, 0, CFG.width, CFG.height], placeholder, {multiline: true, scrolling: true });
      input.helpTip = 'Press Tab to preview after typing.\nNew line: PC - Ctrl+Enter, Mac OS - Enter.';
      input.helpTip += '\n\nInsert ' + CFG.divider.replace(/\n/g, '') + ' on a new line\nto separate text objects';
      input.helpTip += '\n\nSoft line break special char: Shift+Enter';
      input.active = true;

  // OPTIONS AND BUTTONS
  var opt = win.add('group');
      opt.orientation = 'column';
      opt.alignChildren = ['fill', 'center'];

  var isSeparate = opt.add('checkbox', undefined, 'Edit Separately');
      isSeparate.helpTip = 'Edit each text layer\nindividually';
  var isSort = opt.add('checkbox', undefined, 'List by XY');
      isSort.helpTip = 'List text layers\nsorted by position';
      isSort.enabled = isSeparate.value;
  var isReverse = opt.add('checkbox', undefined, 'Reverse Apply');
      isReverse.helpTip = 'Replace the contents\nof text layers in\nreverse order';
      isReverse.enabled = isSeparate.value;

  var cancel, ok;
  if (CFG.isMac) {
    cancel = opt.add('button', undefined, 'Cancel', { name: 'cancel' });
    reset = opt.add('button', undefined, 'Reset', { name: 'reset' });
    ok = opt.add('button', undefined, 'OK', { name: 'ok' });
  } else {
    ok = opt.add('button', undefined, 'OK', { name: 'ok' });
    reset = opt.add('button', undefined, 'Reset', { name: 'reset' });
    cancel = opt.add('button', undefined, 'Cancel', { name: 'cancel' });
  }

  cancel.helpTip = 'Press Esc to Close';
  reset.helpTip = 'Reset to original texts';
  ok.helpTip = 'Press Enter to Run';

  var isPreview = opt.add('checkbox', undefined, 'Preview');

  var copyright = opt.add('statictext', undefined, 'Visit Github');
  copyright.justify = 'center';

  // EVENTS
  loadSettings();

  isSeparate.onClick = function () {
    isSort.enabled = this.value;
    isReverse.enabled = this.value;
    input.text = getInputText(placeholder);
    win.update();
    preview();
  };

  isSort.onClick = function () {
    preview();
  }

  isReverse.onClick = function () {
    input.text = reverseText(input.text, CFG.divider);
    win.update();
    preview();
  }

  input.onChange = function () {
    if (isSeparate.value) tmpText.separate = this.text;
    else tmpText.union = this.text;
    preview();
  }

  isPreview.onClick = preview;

  // Insert soft line break char
  input.addEventListener('keydown', function (kd) {
    var isShift = ScriptUI.environment.keyboardState['shiftKey'];
    if (isShift && kd.keyName == 'Enter') {
      this.textselection = CFG.softBreak;
      kd.preventDefault();
      preview();
    }
  });

  reset.onClick = function () {
    tmpText.separate = '';
    tmpText.union = '';
    input.text = getInputText(placeholder);

    preview();

    this.active = true;
    this.active = false;

    input.active = true;
    win.update();
  }

  cancel.onClick = win.close;

  ok.onClick = function () {
    if (isPreview.value && isUndo) {
      doc.activeHistoryState = currState;
    }

    ok.text = 'Wait...';
    win.update();

    changeTexts();

    saveSettings();
    isUndo = false;
    win.close();
  }

  /**
   * Retrieve the text based on the configuration settings and temporary text storage
   *
   * @param {string} def - The default text to return if no valid text is found
   * @returns {string} - The processed text
   */
  function getInputText(def) {
    var str = (isSort.value ? sortedContents : contents).join(CFG.divider);
    if (isSeparate.value) {
      return !isEmpty(tmpText.separate) ? tmpText.separate : (isReverse.value ? reverseText(str, CFG.divider) : str);
    } else {
      return !isEmpty(tmpText.union) ? tmpText.union : def;
    }
  }

  /**
   * Toggles the preview mode for text changes
   */
  function preview() {
    try {
      if (isPreview.enabled && isPreview.value) {
        if (isUndo) doc.activeHistoryState = currState;
        else isUndo = true;
        changeTexts();
        app.refresh();
      } else if (isUndo) {
        doc.activeHistoryState = currState;
        app.refresh();
        isUndo = false;
      }
    } catch (err) {}
  }

  /**
   * Change the text content of selected text layers based on the provided input text
   */
  function changeTexts() {
    if (isEmpty(input.text)) return;

    // Create a regular expression for soft breaks
    var regex = new RegExp(CFG.softBreak, 'gmi');

    // Handle separate text replacement mode
    if (isSeparate.value) {
      var srcTexts = [].concat(isSort.value ? sortedTexts : texts);
      // Split the input text using the configured divider
      var inpTexts = input.text.replace(regex, '\x03').split(CFG.divider);
      // Determine the minimum length to avoid out-of-bounds errors
      var min = Math.min(srcTexts.length, inpTexts.length);

      for (var i = 0; i < min; i++) {
        var txt = srcTexts[i];
        if (txt.textItem.contents !== inpTexts[i]) {
          txt.textItem.contents = inpTexts[i]
          .replace(/[\r\n]+/gm, '\r')
          .replace(regex, '\x03');
        }
      }
    } else {
      // Handle combined text replacement mode
      for (var i = 0, len = texts.length; i < len; i++) {
        var txt = texts[i];
        // Replace placeholders in the input text with the original content of the text layer
        var str = input.text.replace(/<text>/gi, contents[i])
        .replace(/[\r\n]+/gm, '\r')
        .replace(regex, '\x03');;
        if (txt.textItem.contents !== str) {
          txt.textItem.contents = str;
        }
      }
    }
  }

  win.onClose = function () {
    try {
      if (isUndo) doc.activeHistoryState = currState;
    } catch (err) {}
  }

  copyright.addEventListener('mousedown', function () {
    openURL('https://github.com/creold');
  });

  /**
   * Save UI options in Photoshop preferences
   */
  function saveSettings() {
    var desc = new ActionDescriptor();
    desc.putBoolean(0, isSeparate.value);
    desc.putBoolean(1, isSort.value);
    desc.putBoolean(2, isReverse.value);
    app.putCustomOptions(CFG.settings, desc, true);
  }

  /**
   * Load options from Photoshop preferences
   */
  function loadSettings() {
    try {
      var desc = app.getCustomOptions(CFG.settings);
    } catch (err) {}
    if (typeof desc != 'undefined') {
      try {
        isSeparate.value = desc.getBoolean(0);
        isSort.value = desc.getBoolean(1);
        isSort.enabled = desc.getBoolean(0);
        isReverse.value = desc.getBoolean(2);
        isReverse.enabled = desc.getBoolean(0);
        input.text = getInputText(placeholder);
        return;
      } catch (err) {}
    }
  }

  win.center();
  win.show();
}

/**
 * Get the indexes of all selected layers in the active Photoshop document
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-to-find-selected-layers-and-run-events/td-p/10269273 by Geppetto Luis
 *
 * @returns {Array} - An array containing the indexes of the selected layers
 */
function getSelectedLayersIdx() {
  var result = new Array;
  var ref = new ActionReference();
  ref.putEnumerated(cTID('Dcmn'), cTID('Ordn'), cTID('Trgt'));
  var desc = executeActionGet(ref);

  if (desc.hasKey(sTID('targetLayers'))) {
    desc = desc.getList(sTID('targetLayers'));
    var counter = desc.count;
    var result = new Array();
    for (var i = 0; i < counter; i++) {
      try {
        activeDocument.backgroundLayer;
        result.push(desc.getReference(i).getIndex());
      } catch (err) {
        result.push(desc.getReference(i).getIndex() + 1);
      }
    }
  } else {
    var ref = new ActionReference();
    ref.putProperty(cTID('Prpr'), cTID('ItmI'));
    ref.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    try {
      activeDocument.backgroundLayer;
      result.push(executeActionGet(ref).getInteger(cTID('ItmI')) - 1);
    } catch (err) {
      result.push(executeActionGet(ref).getInteger(cTID('ItmI')));
    }
  }
  return result;
}

/**
 * Convert a string identifier to a character identifier
 *
 * @param {string} s - The string identifier
 * @returns {number} - The corresponding character identifier
 */
function cTID(s) {
  return app.charIDToTypeID(s);
}

/**
 * Convert a string identifier to a type identifier
 *
 * @param {string} s - The string identifier
 * @returns {number} - The corresponding type identifier
 */
function sTID(s) {
  return app.stringIDToTypeID(s);
}

/**
 * Get all text layers from the given layers array that match the provided indexes
 *
 * @param {[Object|Array]} layers - The layers array to search
 * @param {number[]} idx - The array of indexes to match
 * @returns {Array} - An array containing the text layers matching the provided indexes
 */
function getTextLayers(layers, idx) {
  var result = [];

  for (var i = 0; i < layers.length; i++) {
    var lyr = layers[i];
    if (lyr.kind === LayerKind.TEXT) {
      for (var j = 0; j < idx.length; j++) {
        try {
          activeDocument.backgroundLayer;
          if (lyr.itemIndex - 1 === idx[j]) {
            result.push(lyr);
            break;
          }
        } catch (err) {
          if (lyr.itemIndex === idx[j]) {
            result.push(lyr);
            break;
          }
        }
      }
    } else if (lyr.typename === 'LayerSet') {
      result = [].concat(result, getTextLayers(lyr.layers, idx));
    }
  }

  return result;
}

/**
 * Sort items based on their position
 * 
 * @param {(Object|Array)} coll - Collection to be sorted
 * @param {number} tolerance - The tolerance within which objects are considered to have the same top position
 */
function sortByPosition(coll, tolerance) {
  if (arguments.length == 1 || tolerance == undefined) {
    tolerance = 10;
  }

  coll.sort(function(a, b) {
    if (Math.abs(a.bounds[1] - b.bounds[1]) <= tolerance) {
      return a.bounds[0] - b.bounds[0];
    }
    return a.bounds[1] - b.bounds[1];
  });
}

/**
 * Extract the contents of text layers from a given collection
 * 
 * @param {Array} coll - The collection of text layers
 * @param {string} softBreak - The soft line break special char
 * @returns {Array} - An array containing the contents of text layers
 */
function extractContents(coll, softBreak) {
  var result = [];

  for (var i = 0, len = coll.length; i < len; i++) {
    // Replace End of Text (ETX) to line break
    result.push(coll[i].textItem.contents.replace(/\x03/g, softBreak));
  }

  return result;
}

/**
 * Check if the contents of all texts in the collection are equal
 * 
 * @param {Array} coll - The collection of texts to compare
 * @param {string} softBreak - The soft line break special char
 * @returns {boolean} - Returns true if all texts have equal contents, otherwise false
 */
function isEqualContents(coll, softBreak) {
  var str = coll[0].textItem.contents.replace(/\x03/g, softBreak);

  for (var i = 1, len = coll.length; i < len; i++) {
    if (coll[i].textItem.contents.replace(/\x03/g, softBreak) !== str)
      return false;
  }

  return true;
}

/**
 * Reverse the order of texts within a string separated by a specified divider
 * @param {string} str - The delimited string to reverse
 * @param {string} divider - The divider used to split
 * @returns {string} - A reversed string
 */
function reverseText(str, divider) {
  var tmp = str.split(divider);

  tmp.reverse();
  var str = tmp.join(divider);

  return str;
}

/**
 * Check if a string is empty or contains only whitespace characters
 *
 * @param {string} str - The string to check for emptiness
 * @returns {boolean} - True if the string is empty, false otherwise
 */
function isEmpty(str) {
  return str.replace(/\s/g, '').length == 0;
}

/**
 * Open a URL in the default web browser
 * 
 * @param {string} url - The URL to open in the web browser
 * @returns {void}
 */
function openURL(url) {
  var html = new File(Folder.temp.absoluteURI + '/aisLink.html');
  html.open('w');
  var htmlBody = '<html><head><META HTTP-EQUIV=Refresh CONTENT="0; URL=' + url + '"></head><body> <p></body></html>';
  html.write(htmlBody);
  html.close();
  html.execute();
}

try {
  if (!/photoshop/i.test(app.name)) {
    alert('Error\nRun script from Adobe Photoshop');
  } else if (!documents.length) {
    alert('Error\nOpen a document and try again');
  } else {
    app.activeDocument.suspendHistory('Multi-edit Text', 'main()');
  }
} catch (err) {}