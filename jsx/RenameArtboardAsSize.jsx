/*
  RenameArtboardAsSize.jsx for Adobe Photoshop
  Description: The script renames artboards according to their size in units from Preferences > Units & Rulers
  Date: January, 2024
  Author: Sergey Osokin, email: hi@sergosokin.ru

  Installation: https://github.com/creold/photoshop-scripts#how-to-run-scripts

  Release notes:
  0.1 Initial version
  0.1.1 Fixed convertUnits() function

  Donate (optional):
  If you find this script helpful, you can buy me a coffee
  - via Buymeacoffee: https://www.buymeacoffee.com/aiscripts
  - via Donatty https://donatty.com/sergosokin
  - via DonatePay https://new.donatepay.ru/en/@osokin
  - via YooMoney https://yoomoney.ru/to/410011149615582

  NOTICE:
  Tested with Adobe Photoshop CC 2019, 2024 (Mac OS).
  This script is provided "as is" without warranty of any kind.
  Free to use, not for sale

  Released under the MIT license
  http://opensource.org/licenses/mit-license.php

  Check my other scripts: https://github.com/creold
*/

//@target photoshop
app.bringToFront();

function main() {
  var CFG = {
    units: getUnits(), // Active document units
    isSaveName: true, // Set false to overwrite the full name
    isRound: true, // Set true to get a round number
    precision: 2,  // Size rounding precision
    isAddUnit: true,
    separator: '_',
    settings: 'RAAS_settings',
  };

  if (!isCorrectEnv()) return;

  if (!app.activeDocument.layerSets.length) {
    alert("The document doesn't seem to have artboards", 'Script Error');
    return;
  }

  invokeUI(CFG);
}

// Show UI
function invokeUI(prefs) {
  var doc = app.activeDocument;

  var win = new Window('dialog', 'Rename Artboard As Size');
      win.alignChildren = ['fill', 'fill'];

  // Range
  var rangePnl = win.add('panel', undefined, 'Artboards range');
      rangePnl.alignChildren = ['fill', 'center'];
      rangePnl.margins = [12, 14, 10, 14];

  var isAll = rangePnl.add('radiobutton', undefined, 'All artboards');
      isAll.value = true;

  var isCurr = rangePnl.add('radiobutton', undefined, 'Active artboard');

  // Options
  var optPnl = win.add('panel', undefined, 'Options');
      optPnl.alignChildren = ['fill', 'center'];
      optPnl.margins = [12, 14, 10, 14];

  var isSaveName = optPnl.add('checkbox', undefined, 'Add size as suffix');
      isSaveName.value = prefs.isSaveName;

  var isRound = optPnl.add('checkbox', undefined, 'Round to integer');
      isRound.value = prefs.isRound;

  var isAddUnit = optPnl.add('checkbox', undefined, 'Add units after size');
      isAddUnit.value = prefs.isAddUnit;

  // Buttons
  var btns = win.add('group');
      btns.alignChildren = ['fill', 'center'];

  var cancel, ok;
  if (/mac/i.test($.os)) {
    cancel = btns.add('button', undefined, 'Cancel', { name: 'cancel' });
    ok = btns.add('button', undefined, 'OK', { name: 'ok' });
  } else {
    ok = btns.add('button', undefined, 'OK', { name: 'ok' });
    cancel = btns.add('button', undefined, 'Cancel', { name: 'cancel' });
  }
  cancel.helpTip = 'Press Esc to Close';
  ok.helpTip = 'Press Enter to Run';

  var copyright = win.add('statictext', undefined, '\u00A9 Sergey Osokin. Visit Github');
  copyright.justify = 'center';

  loadSettings();

  copyright.addEventListener('mousedown', function () {
    openURL('https://github.com/creold');
  });

  cancel.onClick = win.close;

  ok.onClick = function () {
    doc.suspendHistory('Rename Artboards', 'okClick()');
  }

  function okClick() {
    var doc = app.activeDocument;
    var range = isAll.value ? doc.layerSets : [doc.activeLayer];

    prefs.isSaveName = isSaveName.value;
    prefs.isRound = isRound.value;
    prefs.isAddUnit = isAddUnit.value;

    for (var i = 0, len = range.length; i < len; i++) {
      renameArtboard(range[i], prefs);
    }

    saveSettings();
    win.close();
  }

  function loadSettings() {
    try {
      var desc = app.getCustomOptions(prefs.settings);
    } catch (err) {}
    if (typeof desc != 'undefined') {
      try {
        rangePnl.children[desc.getInteger(0)].value = true;
        isSaveName.value = desc.getBoolean(1);
        isRound.value = desc.getBoolean(2);
        isAddUnit.value = desc.getBoolean(3);
        return;
      } catch (err) {}
    }

    compressPref = true;
  }

  function saveSettings() {
    var desc = new ActionDescriptor();
    desc.putInteger(0, isAll.value ? 0 : 1);
    desc.putBoolean(1, isSaveName.value);
    desc.putBoolean(2, isRound.value);
    desc.putBoolean(3, isAddUnit.value);
    app.putCustomOptions(prefs.settings, desc, true);
  }

  win.center();
  win.show();
}

// Rename an artboard by its size
function renameArtboard(ab, prefs) {
  var abName = ab.name;
  var separator = /\s/.test(abName) ? ' ' : (/-/.test(abName) ? '-' : prefs.separator);

  var abRect = getArtboardSize(ab);

  var width = convertUnits(abRect[2] - abRect[0], 'px', prefs.units);
  var height = convertUnits(abRect[3] - abRect[1], 'px', prefs.units);

  // It's probably a group of layers
  if (width === 0 || height === 0) return;

  width = prefs.isRound ? Math.round(width) : width.toFixed(prefs.precision);
  height = prefs.isRound ? Math.round(height) : height.toFixed(prefs.precision);

  var size = width + 'x' + height;
  if (prefs.isAddUnit) size += prefs.units;

  if (prefs.isSaveName) {
    ab.name += separator + size;
  } else {
    ab.name = size;
  }
}

// Get ruler units
function getUnits() {
  var units = 'px';
  var ruler = app.preferences.rulerUnits.toString();
  var key = ruler.replace('Units.', '');

  switch (key) {
    case 'PIXELS': units = 'px'; break;
    case 'INCHES': units = 'in'; break;
    case 'CM': units = 'cm'; break;
    case 'MM': units = 'mm'; break;
    case 'POINTS': units = 'pt'; break;
    case 'PICAS': units = 'pc'; break;
    case 'PERCENT': units = 'px'; break;
  }

  return units;
}

// Check the script environment
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

// Get artboard dimensions (artboar has type LayerSet) by Chuck Uebele
// https://community.adobe.com/t5/photoshop-ecosystem-discussions/photoshop-scripting-artboard-size-values/m-p/13256092#M677004
function getArtboardSize(layer) {
  try {
    var ref = new ActionReference();
    ref.putProperty(sTID('property'), sTID('artboard'));
    if (layer) {
      ref.putIdentifier(sTID('layer'), layer.id);
    } else {
      ref.putEnumerated(sTID('layer'), sTID('ordinal'), sTID('targetEnum'));
    }

    var desc = executeActionGet(ref).getObjectValue(sTID('artboard')).getObjectValue(sTID('artboardRect'));
    var bounds = [];
    bounds[0] = desc.getUnitDoubleValue(sTID('left'));
    bounds[1] = desc.getUnitDoubleValue(sTID('top'));
    bounds[2] = desc.getUnitDoubleValue(sTID('right'));
    bounds[3] = desc.getUnitDoubleValue(sTID('bottom'));

    return bounds;
  } catch(err) {
    return [0, 0, 0, 0];
  }
}

function sTID(s) {
  return app.stringIDToTypeID(s);
}

// Convert units of measurement
function convertUnits(value, currUnits, newUnits) {
  UnitValue.baseUnit = UnitValue (1 / activeDocument.resolution, 'in');
  var newValue = new UnitValue(value, currUnits);
  newValue = newValue.as(newUnits);
  UnitValue.baseUnit = null;
  return newValue;
}


// Open link in browser
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