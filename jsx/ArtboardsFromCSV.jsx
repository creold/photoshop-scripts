/*
  ArtboardsFromCSV.jsx for Adobe Photoshop
  Description: The script creates artboards of specified sizes in one column, one below the other

  Original idea by Kristian Andersen, krilleandersen@gmail.com:
  https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-to-create-artboards-from-script/td-p/9345492

  Modification by Sergey Osokin, email: hi@sergosokin.ru

  Installation: https://github.com/creold/photoshop-scripts#how-to-run-scripts

  Release notes:
  0.1 Initial version (Kristian Andersen)
  0.2 Parsing artboards data from CSV with options

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

function main(){
  if (!isCorrectEnv()) return;

  var doc = app.activeDocument;
  var units = getUnits();
  var origUnits = app.preferences.rulerUnits;
  app.preferences.rulerUnits = Units.PIXELS;

  var win = new Window('dialog', 'ArtboardsFromCSV v0.2');
      win.orientation = 'column';
      win.alignChildren = ['fill', 'top'];

  // CSV file
  var csvPnl = win.add('panel', undefined, 'Artboard List (WxH in ' + units + ')');
      csvPnl.alignChildren = ['fill', 'center'];
      csvPnl.margins = [12, 14, 10, 14];

  var selCSVInp = csvPnl.add('edittext', undefined, Folder.desktop, {readonly: false});
      selCSVInp.maximumSize.width = 180;
  var selCSVBtn = csvPnl.add('button', undefined, 'Select CSV');

  // Options
  var optPnl = win.add('panel', undefined, 'Vertical Spacing');
      optPnl.alignChildren = ['fill', 'center'];
      optPnl.margins = [12, 14, 10, 14];

  var padGrp = optPnl.add('group');

  var padInp = padGrp.add('edittext', undefined, 50);
      padInp.characters = 6;

  padGrp.add('statictext', undefined, units);

  // Name options
  var namePnl = win.add('panel', undefined, 'Artboard Name');
      namePnl.alignChildren = ['fill', 'center'];
      namePnl.margins = [12, 14, 10, 14];

  var isOnlyName = namePnl.add('radiobutton', undefined, 'Name from CSV');
      isOnlyName.value = true;

  var isNameWithSize = namePnl.add('radiobutton', undefined, 'Name with Size');
  var isOnlySize = namePnl.add('radiobutton', undefined, 'Only Size');

  // Background options
  var bgPnl = win.add('panel', undefined, 'Background');
      bgPnl.alignChildren = ['fill', 'center'];
      bgPnl.margins = [12, 14, 10, 14];

  var isWhite = bgPnl.add('radiobutton', undefined, 'White');
      isWhite.value = true;

  var isBlack = bgPnl.add('radiobutton', undefined, 'Black');
  var isTransparent = bgPnl.add('radiobutton', undefined, 'Transparent');

  if (/mm|cm|in/.test(units)) {
    win.add('statictext', undefined, 'Script can slowly add artboards');
  }

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

  // Select CSV file
  selCSVBtn.onClick = function () {
    selectFiles('.csv', 'Select CSV file...', selCSVInp);
  }

  cancel.onClick = win.close;

  ok.onClick = function () {
    doc.suspendHistory('Add Artboards', 'okClick()');
  }

  function okClick() {
    ok.text = 'Wait...';
    app.refresh();

    var sheet = new File(selCSVInp.text);
    if (!sheet.exists) {
      alert('CSV file not found\nMake sure the file path is correct', 'Script error');
      return;
    }

    var pad = convertUnits(toAbsNum(padInp.text, 0), units, 'px');
    var nameKey = isOnlyName.value ? 0 : (isNameWithSize.value ? 1 : 2);
    var bgKey = isWhite.value ? 1 : (isBlack.value ? 2 : 3);
    var abData = parseCsvData(sheet, units, nameKey);
    var delta = 0;

    for (var i = 0, len = abData.length; i < len; i++) {
      var ab = abData[i];
      createArtboard(ab.width, ab.height, delta, ab.name, bgKey);
      delta = parseFloat(delta + ab.height + pad);
    }

    saveSettings();
    win.close();
  }

  // Select files with the given extension
  function selectFiles(ext, title, inp) {
    var re = new RegExp('(' + ext + ')$', 'i');
    var fType = ($.os.match('Windows')) ? '*' + ext + ';' : function(f) {
      return f instanceof Folder || (f instanceof File && f.name.match(re));
    };
    var f = File.openDialog(title, fType, true);
    if (f.fullName !== null) inp.text = decodeURI(f);
  }

  function saveSettings() {
    var desc = new ActionDescriptor();
    desc.putString(0, selCSVInp.text);
    desc.putString(1, padInp.text);
    desc.putInteger(2, isOnlyName.value ? 0 : (isNameWithSize.value ? 1 : 2));
    desc.putInteger(3, isWhite.value ? 0 : (isBlack.value ? 1 : 2));
    app.putCustomOptions('AbFromCSV_settings', desc, true);
  }

  function loadSettings() {
    try {
      var desc = app.getCustomOptions('AbFromCSV_settings');
    } catch (err) {}
    if (typeof desc != 'undefined') {
      try {
        selCSVInp.text = desc.getString(0);
        padInp.text = desc.getString(1);
        namePnl.children[desc.getInteger(2)].value = true;
        bgPnl.children[desc.getInteger(3)].value = true;
        return;
      } catch (err) {}
    }
  }

  app.preferences.rulerUnits = origUnits;
  win.center();
  win.show();
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

// Convert units of measurement
function convertUnits(value, currUnits, newUnits) {
  UnitValue.baseUnit = UnitValue (1 / activeDocument.resolution, 'in');
  var newValue = new UnitValue(value, currUnits);
  newValue = newValue.as(newUnits);
  UnitValue.baseUnit = null;
  return newValue;
}

// Convert string to absolute number
function toAbsNum(str, def) {
  if (arguments.length == 1 || !def) def = 1;
  str = str.replace(/,/g, '.').replace(/[^\d.]/g, '');
  str = str.split('.');
  str = str[0] ? str[0] + '.' + str.slice(1).join('') : '';
  if (isNaN(str) || !str.length) return parseFloat(def);
  else return parseFloat(str);
}

// Get artboard name, width, height
function parseCsvData(f, units, nameKey) {
  var rows = readCSV(f);
  var arr = [];

  for (var i = 1, len = rows.length; i < len; i++) {
  var curRow = rows[i].replace(/\"/g, '');
    var data = curRow.split(/,|:/);
    if (!data[1] || !data[1].length) continue;
    if (!data[2] || !data[2].length) continue;

    var w = toAbsNum(data[1], 0);
    var h = toAbsNum(data[2], 0);
    var size = w + 'x' + h + units;

    w = convertUnits(w, units, 'px');
    h = convertUnits(h, units, 'px');

    if (w < 1 || h < 1) continue;

    var name = (data[0] && data[0].replace(/\s/g, '').length) ? data[0] : '';
    if (nameKey === 0 && name === '') name = size;
    else if (nameKey === 1) name += (name.length ? '_' : '') + size;
    else if (nameKey === 2) name = size;

    arr.push({
      name: name,
      width: w,
      height: h,
    });
  }

  return arr;
}

// Get data from a table
function readCSV(f) {
  f.open('r');
  var s = f.read();
  f.close();
  return s.split(/\r\n|\n/);
}

// Add an artboard with custom parameters
function createArtboard(w, h, delta, name, bg) {
  var ww = parseFloat(w);
  var hh = parseFloat(h);
  var size = w + 'x' + h + 'px';

  // Make artboard
  var idMk = cTID('Mk  ');
  var desc = new ActionDescriptor();
  var idNull = cTID('null');
  var ref = new ActionReference();
  var idArtboardSection = sTID('artboardSection');
  ref.putClass(idArtboardSection);
  desc.putReference(idNull, ref);
  var idLayerSectionStart = sTID('layerSectionStart');
  desc.putInteger(idLayerSectionStart, 5);
  var idLayerSectionEnd = sTID('layerSectionEnd');
  desc.putInteger(idLayerSectionEnd, 6);
  var idNm = cTID('Nm  ');
  desc.putString(idNm, "" + size + "");
  
  var idArtboardRect = sTID('artboardRect');
  var descRect = new ActionDescriptor();

  var idTop = cTID('Top ');
  descRect.putDouble(idTop, 0.000000);

  var idLeft = cTID('Left');
  descRect.putDouble(idLeft, 0.000000);

  var idBtom = cTID('Btom');
  descRect.putDouble(idBtom, parseInt(h)); // Height

  var idRght = cTID('Rght');
  descRect.putDouble(idRght, parseInt(w)); // Width

  var idClassFloatRect = sTID('classFloatRect');
  desc.putObject(idArtboardRect, idClassFloatRect, descRect);
  executeAction(idMk, desc, DialogModes.NO);

  // Set artboard name
  var idSetD = cTID('setd');
  var descName1 = new ActionDescriptor();
  var refName = new ActionReference();
  var idLyr = cTID('Lyr ');
  var idOrdn = cTID('Ordn');
  var idTrgt = cTID('Trgt');
  refName.putEnumerated(idLyr, idOrdn, idTrgt);
  descName1.putReference(idNull, refName);
  var idT = cTID('T   ');
  var descName2 = new ActionDescriptor();

  // Artboard name
  descName2.putString(idNm, "" + name + "");

  descName1.putObject(idT, idLyr, descName2);
  executeAction(idSetD, descName1, DialogModes.NO);

  // Artboard position
  var idEditArtboardEvent = sTID('editArtboardEvent');
  var descPos1 = new ActionDescriptor();
  var refPos = new ActionReference();
  refPos.putEnumerated(idLyr, idOrdn, idTrgt);
  descPos1.putReference(idNull, refPos);
  var idArtboard = sTID('artboard');
  var descPos2 = new ActionDescriptor();

  descRect.putDouble(idTop, delta); // Artboard Y
  descRect.putDouble(idLeft, 0.000000); // Artboard X
  descRect.putDouble(idBtom, hh);
  descRect.putDouble(idRght, ww);

  descPos2.putObject(idArtboardRect, idClassFloatRect, descRect);
  var idGuideIDs = sTID('guideIDs');
  var list = new ActionList();
  descPos2.putList(idGuideIDs, list);
  var idArtboardPresetName = sTID('artboardPresetName');
  descPos2.putString(idArtboardPresetName, "" + size + "");

  // Color
  var idClr = cTID('Clr ');
  var desc98 = new ActionDescriptor();
  var idRd = cTID('Rd  ');
  desc98.putDouble(idRd, 255.000000);
  var idGrn = cTID('Grn ');
  desc98.putDouble(idGrn, 255.000000);
  var idBl = cTID('Bl  ');
  desc98.putDouble(idBl, 255.000000);
  var idRGBC = cTID('RGBC');
  descPos2.putObject(idClr, idRGBC, desc98);
  var idArtboardBackgroundType = sTID('artboardBackgroundType');

  descPos2.putInteger(idArtboardBackgroundType, parseInt(bg));

  var idArtboard = sTID('artboard');
  descPos1.putObject(idArtboard, idArtboard, descPos2);
  var idChangeSizes = sTID('changeSizes');
  descPos1.putInteger(idChangeSizes, 5);
  executeAction(idEditArtboardEvent, descPos1, DialogModes.NO);
}

function cTID(s) { 
  return app.charIDToTypeID(s);
}

function sTID(s) {
  return app.stringIDToTypeID(s);
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