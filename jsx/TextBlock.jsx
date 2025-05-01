/*
  TextBlock.jsx for Adobe Photoshop
  Description: Convert selected text layers into a block of text
  Date: March, 2025
  Modification date: April, 2025
  Author: Sergey Osokin, email: hi@sergosokin.ru

  Version for Adobe Illustrator:
  https://github.com/creold/illustrator-scripts/blob/master/md/Text.md

  Installation: https://github.com/creold/photoshop-scripts#how-to-run-scripts

  Release notes:
  0.2 Added option to center text block and hide/remove original layers
  0.1 Initial version

  Donate (optional):
  If you find this script helpful, you can buy me a coffee
  - via Buymeacoffee: https://www.buymeacoffee.com/aiscripts
  - via Donatty https://donatty.com/sergosokin
  - via DonatePay https://new.donatepay.ru/en/@osokin
  - via YooMoney https://yoomoney.ru/to/410011149615582

  NOTICE:
  Tested with Adobe Photoshop CC 2019-2024 (Mac/Win).
  This script is provided "as is" without warranty of any kind.
  Free to use, not for sale

  Released under the MIT license
  http://opensource.org/licenses/mit-license.php

  Check my other scripts: https://github.com/creold
*/

//@target photoshop
app.bringToFront();

function main() {
  var SCRIPT = {
    name: 'Text Block',
    version: 'v0.2'
  };

  var CFG = {
    width: '300 px', // Text Block width
    spacing: '10 px', // Text lines spacing
    units: app.preferences.rulerUnits,
    isMac: /mac/i.test($.os),
    settings: 'TB_settings',
  };

  if (!isCorrectEnv()) return;
  var doc = app.activeDocument;
  var idx = getSelectedLayersIdx();

  var texts = getTextLayers(doc.layers, idx);
  if (texts.length < 2) {
    alert('Texts not found\nPlease select at least two text layers and try again', 'Script error');
    return;
  }

  // Sort array by Y and X positions
  sortByPosition(texts, 10);

  // DIALOG
  var win = new Window('dialog', SCRIPT.name + ' ' + SCRIPT.version);
      win.alignChildren = ['fill', 'top'];

  // INPUTS
  var settPnl = win.add('panel', undefined, 'Block Settings');
      settPnl.alignChildren = ['fill', 'top'];
      settPnl.margins = [10, 15, 5, 15];

  var wrapper1 = settPnl.add('group');
      wrapper1.alignChildren = ['left', 'center'];

  var wLbl = wrapper1.add('statictext', undefined, 'Width:');
      wLbl.preferredSize.width = 55;

  var wInp = wrapper1.add('edittext', undefined, CFG.width);
      wInp.preferredSize.width = 80;
      wInp.helpTip = 'Supporterd units:\npx, pt, in, mm, cm, m, ft, yd';
      wInp.active = true;

  var wrapper2 = settPnl.add('group');
      wrapper2.alignChildren = ['left', 'center'];
  
  var spLbl = wrapper2.add('statictext', undefined, 'Spacing:');
      spLbl.preferredSize.width = 55;

  var spInp = wrapper2.add('edittext', undefined, CFG.spacing);
      spInp.preferredSize.width = 80;
      spInp.helpTip = 'Supporterd units:\npx, pt, in, mm, cm, m, ft, yd';

  var isToCenter = settPnl.add('checkbox', undefined, 'Center To Canvas');

  // ORIGINAL LAYERS POST-PROCESS
  var origPnl = win.add('panel', undefined, 'Original Texts');
      origPnl.alignChildren = ['fill', 'top'];
      origPnl.margins = [10, 15, 5, 15];

  var isKeep = origPnl.add('radiobutton', undefined, 'Keep');
      isKeep.value = true;
  var isHide = origPnl.add('radiobutton', undefined, 'Hide');
  var isRemove = origPnl.add('radiobutton', undefined, 'Remove');

  // BUTTONS
  var btns = win.add('group');
      btns.alignChildren = ['fill', 'center'];
      btns.spacing = 10;

  var cancel, ok;
  if (CFG.isMac) {
    cancel = btns.add('button', undefined, 'Cancel', { name: 'cancel' });
    ok = btns.add('button', undefined, 'OK', { name: 'ok' });
  } else {
    ok = btns.add('button', undefined, 'OK', { name: 'ok' });
    cancel = btns.add('button', undefined, 'Cancel', { name: 'cancel' });
  }

  cancel.helpTip = 'Press Esc to Close';
  ok.helpTip = 'Press Enter to Run';

  var copyright = win.add('statictext', undefined, 'Click Here To Visit Github');
      copyright.justify = 'center';

  // EVENTS
  loadSettings();

  wInp.onChange = spInp.onChange = function () {
    var units = parseUnits(this.text, 'px');
    var num = strToNum(this.text, CFG.width);
    this.text = num + ' ' + units;
  }

  /**
   * Use Up / Down arrow keys (+ Shift) to change value
   */
  bindStepperKeys(wInp, 0.1, 100000);
  bindStepperKeys(spInp, 0, 100000);

  cancel.onClick = win.close;

  ok.onClick = function () {
    doc.suspendHistory('TextBlock Script', 'okClick()');
  }

  copyright.addEventListener('mousedown', function () {
    openURL('https://github.com/creold');
  });

  function okClick() {
    saveSettings();

    app.preferences.rulerUnits = Units.PIXELS;

    var wUnits = parseUnits(wInp.text, 'px');
    var blockWidth = convertUnits( strToNum(wInp.text, CFG.width), wUnits, 'px' );

    var spUnits = parseUnits(spInp.text, 'px');
    var blockSpacing = convertUnits( strToNum(spInp.text, CFG.spacing), spUnits, 'px' );
  
    // Add a group to final output
    var textGroup = doc.layerSets.add();
    textGroup.name = 'Text Block';
  
    var nextTop = 0;
    var posLeft = texts[0].bounds[0];
    var posRight = texts[0].bounds[2];
    var posTop = texts[0].bounds[1];
  
    // Create text block
    for (var i = 0; i < texts.length; i++) {
      var currText = texts[i];
      var dupText = currText.duplicate(textGroup, ElementPlacement.PLACEATEND);
      dupText.name = currText.name;
  
      var bounds = dupText.bounds;
      var currWidth = bounds[2].value - bounds[0].value;
      var ratio = (blockWidth / currWidth) * 100;
  
      dupText.resize(ratio, ratio, AnchorPosition.TOPLEFT);
  
      bounds = dupText.bounds;
      var deltaX = bounds[0].value;
      var deltaY = bounds[1].value;
  
      dupText.translate(-deltaX, -deltaY + nextTop + blockSpacing);
      nextTop += bounds[3].value - bounds[1].value + blockSpacing;
    }

    // Align text block
    if (isToCenter.value) {
      alignToCenter(doc, textGroup);
    } else if (!isKeep.value) {
      textGroup.translate(posLeft, posTop);
    } else {
      textGroup.translate(posRight, posTop);
    }

    // Original layers
    for(var j = texts.length - 1; j >= 0; j--){
      if (isHide.value) {
        texts[j].visible = false;
      } else if (isRemove.value) {
        texts[j].remove();
      }
    }

    app.preferences.rulerUnits = CFG.units;

    win.close();
  }

  /**
   * Handle keyboard input to shift numerical values
   * @param {Object} input - The input element to which the event listener will be attached
   * @param {number} min - The minimum allowed value for the numerical input
   * @param {number} max - The maximum allowed value for the numerical input
   * @returns {void}
   */
  function bindStepperKeys(input, min, max) {
    input.addEventListener('keydown', function (kd) {
      var step = ScriptUI.environment.keyboardState['shiftKey'] ? 10 : 1;
      var units = parseUnits(this.text, 'pt');
      var num = parseFloat(this.text);
      if (kd.keyName == 'Down' || kd.keyName == 'LeftBracket') {
        this.text = (min && (num - step) < min) ? min : num - step;
        this.text += ' ' + units;
        kd.preventDefault();
      }
      if (kd.keyName == 'Up' || kd.keyName == 'RightBracket') {
        this.text = (max && (num + step) > max) ? max : num + step;
        this.text += ' ' + units;
        kd.preventDefault();
      }
    });
  }

  /**
   * Save UI options in Photoshop preferences
   */
  function saveSettings() {
    var desc = new ActionDescriptor();
    desc.putString(0, wInp.text);
    desc.putString(1, spInp.text);
    desc.putBoolean(2, isToCenter.value);
    desc.putBoolean(3, isKeep.value);
    desc.putBoolean(4, isHide.value);
    desc.putBoolean(5, isRemove.value);
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
        wInp.text = desc.getString(0);
        spInp.text = desc.getString(1);
        isToCenter.value = desc.getBoolean(2);
        isKeep.value = desc.getBoolean(3);
        isHide.value = desc.getBoolean(4);
        isRemove.value = desc.getBoolean(5);
        return;
      } catch (err) {}
    }
  }

  win.center();
  win.show();
}

/**
 * Checks if the script is running in the correct environment
 *
 * @returns {boolean} - Returns `true` if the environment is correct
 */
function isCorrectEnv() {
  var args = ['app', 'document'];

  for (var i = 0; i < args.length; i++) {
    switch (args[i].toString().toLowerCase()) {
      case 'app':
        if (!/photoshop/i.test(app.name)) {
          alert('Wrong application\nRun script from Adobe Photoshop', 'Script error');
          return false;
        }
        break;
      case 'document':
        if (!documents.length) {
          alert('No documents\nOpen a document and try again', 'Script error');
          return false;
        }
        break;
    }
  }

  return true;
}

/**
 * Get the indexes of all selected layers in the active Photoshop document
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-to-find-selected-layers-and-run-events/td-p/10269273 by Geppetto Luis
 *
 * @returns {Array} - An array containing the indexes of the selected layers
 */
function getSelectedLayersIdx() {
  var results = new Array;
  var ref = new ActionReference();
  ref.putEnumerated(cTID('Dcmn'), cTID('Ordn'), cTID('Trgt'));
  var desc = executeActionGet(ref);

  if (desc.hasKey(sTID('targetLayers'))) {
    desc = desc.getList(sTID('targetLayers'));
    var counter = desc.count;
    var results = new Array();
    for (var i = 0; i < counter; i++) {
      try {
        activeDocument.backgroundLayer;
        results.push(desc.getReference(i).getIndex());
      } catch (err) {
        results.push(desc.getReference(i).getIndex() + 1);
      }
    }
  } else {
    var ref = new ActionReference();
    ref.putProperty(cTID('Prpr'), cTID('ItmI'));
    ref.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    try {
      activeDocument.backgroundLayer;
      results.push(executeActionGet(ref).getInteger(cTID('ItmI')) - 1);
    } catch (err) {
      results.push(executeActionGet(ref).getInteger(cTID('ItmI')));
    }
  }

  return results;
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
  var results = [];

  for (var i = 0; i < layers.length; i++) {
    var lyr = layers[i];
    if (lyr.kind === LayerKind.TEXT) {
      for (var j = 0; j < idx.length; j++) {
        try {
          activeDocument.backgroundLayer;
          if (lyr.itemIndex - 1 === idx[j]) {
            results.push(lyr);
            break;
          }
        } catch (err) {
          if (lyr.itemIndex === idx[j]) {
            results.push(lyr);
            break;
          }
        }
      }
    } else if (lyr.typename === 'LayerSet') {
      results = [].concat(results, getTextLayers(lyr.layers, idx));
    }
  }

  return results;
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
    var boundsA = a.bounds;
    var boundsB = b.bounds;

    var yA = boundsA[1].value;
    var yB = boundsB[1].value;

    if (Math.abs(yA - yB) > tolerance) {
      return yA - yB;
    }

    var xA = boundsA[0].value;
    var xB = boundsB[0].value;

    if (Math.abs(xA - xB) > tolerance) {
      return xA - xB;
    }

    return 0;
  });
}

/**
 * Parse units from a mixed string
 * 
 * @param {string} str - The input string containing the numeric value and units (e.g., '10px').
 * @param {string} def - The default units to be returned if no units are found in the input string
 * @returns {string} - The parsed units or the default units if not found
 */
function parseUnits(str, def) {
  var match = str.match(/(\d+(\.\d+)?)\s*([a-zA-Z]+)\s*[^a-zA-Z]*$/);

  if (match) {
    var units = match[3].toLowerCase();
    var validUnits = ['px', 'pt', 'in', 'mm', 'cm', 'm', 'ft', 'yd'];

    for (var i = 0; i < validUnits.length; i++) {
      if (units === validUnits[i]) return units;
    }
  }

  return def;
}

/**
* Convert a value from one set of units to another
*
* @param {string} value - The numeric value to be converted
* @param {string} currUnits - The current units of the value (e.g., 'in', 'mm', 'pt')
* @param {string} newUnits - The desired units for the converted value (e.g., 'in', 'mm', 'pt')
* @returns {number} - The converted value in the specified units
*/
function convertUnits(value, currUnits, newUnits) {
  return UnitValue(value, currUnits).as(newUnits);
}

/**
 * Convert string to absolute number
 * 
 * @param {string} str - The string to convert to a number
 * @param {number} def - The default value to return if the conversion fails
 * @returns {number} - The converted number
 */
function strToNum(str, def) {
  if (arguments.length == 1 || def == undefined) def = 1;
  str = str.replace(/,/g, '.').replace(/[^\d.]/g, '');
  str = str.split('.');
  str = str[0] ? str[0] + '.' + str.slice(1).join('') : '';
  if (isNaN(str) || !str.length) return parseFloat(def);
  else return parseFloat(str);
}

/**
 * Center an item within the document canvas
 *
 * @param {Object} doc - The Photoshop document
 * @param {Object} item - The layer or group to be centered
 * @returns {void}
 */
function alignToCenter(doc, item) {
  var bnds = item.bounds;
  var width = bnds[2] - bnds[0];
  var height = bnds[3] - bnds[1];

  var docCenterX = doc.width / 2;
  var docCenterY = doc.height / 2;

  var currCenterX = bnds[0] + width / 2;
  var currCenterY = bnds[1] + height / 2;

  var offsetX = docCenterX - currCenterX;
  var offsetY = docCenterY - currCenterY;

  item.translate(offsetX, offsetY);
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
  main();
} catch(err) {}