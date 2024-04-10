/*
  ExportPathsToAi.jsx for Adobe Photoshop
  Description: Export all visible vector layers as unfilled paths to Illustrator
  Date: August, 2022
  Author: Sergey Osokin, email: hi@sergosokin.ru

  Original idea:
  https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-to-export-paths-to-ai-in-action-batch/td-p/11049168

  Installation: https://github.com/creold/photoshop-scripts#how-to-run-scripts

  Release notes:
  0.1 Initial version by Stephen_A_Marsh
  0.2 Added one-click export of all vector paths

  Donate (optional):
  If you find this script helpful, you can buy me a coffee
  - via Buymeacoffee: https://www.buymeacoffee.com/aiscripts
  - via Donatty https://donatty.com/sergosokin
  - via DonatePay https://new.donatepay.ru/en/@osokin
  - via YooMoney https://yoomoney.ru/to/410011149615582

  NOTICE:
  Tested with Adobe Photoshop CC 2019-2022.
  This script is provided "as is" without warranty of any kind.
  Free to use, not for sale

  Released under the MIT license
  http://opensource.org/licenses/mit-license.php

  Check my other scripts: https://github.com/creold
*/

//@target photoshop

function main() {
  if (!isCorrectEnv()) return;

  var doc = activeDocument,
      docName = doc.name.replace(/\.[^\.]+$/, ''),
      shapes = getVisShapes(doc),  // Array of layer ID's
      outFolder;

  try {
    outFolder = doc.path;
  } catch (e) {
    outFolder = Folder.desktop;
  }

  if (!shapes.length) {
    alert('Visible vector layers have not been found');
    return;
  }

  deselect();

  for (var i = 0; i < shapes.length; i++) {
    selectByID(shapes[i]);
  }

  var result = exportPaths(outFolder, docName, '.ai');
  if (result) {
    alert(shapes.length + ' visible vector layers have been exported to ' + '\n' + decodeURI(result));
  }
}

// Check the script environment
function isCorrectEnv() {
  var args = ['app', 'document'];

  for (var i = 0; i < args.length; i++) {
    switch (args[i].toString().toLowerCase()) {
      case 'app':
        if (!/photoshop/i.test(app.name)) {
          alert('Error\nRun script from Adobe Photoshop');
          return false;
        }
        break;
      case 'document':
        if (!documents.length) {
          alert('Error\nOpen a document and try again');
          return false;
        }
        break;
    }
  }

  return true;
}

// Get indexes of all visible vector layers
function getVisShapes(collection) {
  var out = [];

  for (var i = 0; i < collection.layers.length; i++) {
    var lyr = collection.layers[i];
    if (!lyr.visible) continue;
    if (/art/i.test(lyr.typename)) {
      if (isType(lyr, 4)) out.push(lyr.id); // const kVectorSheet = 4;
    } else if (/set/i.test(lyr.typename)) {
      out = [].concat(out, getVisShapes(lyr));
    } else {
      out = [].concat(out, getVisShapes(lyr));
    }
  }

  return out;
}

// Check LayerKind code
function isType(layer, code) {
  try {
    activeDocument.activeLayer = layer;
  } catch (e) {}

  var ref = new ActionReference();
  ref.putProperty(sTID('property'), sTID('layerKind'));
  ref.putEnumerated(sTID('layer'), sTID('ordinal'), sTID('targetEnum'));
  var type = executeActionGet(ref).getInteger(sTID('layerKind'));

  return type == code;
}

function cTID(s) { 
  return app.charIDToTypeID(s);
}

function sTID(s) {
  return app.stringIDToTypeID(s);
}

// Deselect all layers in the document
function deselect() { 
  var ref = new ActionReference(),
      desc = new ActionDescriptor();

  ref.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt') ); 
  desc.putReference(cTID('null'), ref); 
  executeAction(sTID('selectNoLayers'), desc, DialogModes.NO); 
}

// Select layer by index
function selectByID(id) {
  var ref = new ActionReference(),
      desc = new ActionDescriptor();

  ref.putIdentifier(cTID('Lyr '), id);
  desc.putReference(cTID('null'), ref);
  desc.putEnumerated(sTID('selectionModifier'), sTID('selectionModifierType'), sTID('addToSelection'));
  desc.putBoolean(cTID('MkVs'), false);
  executeAction(cTID('slct'), desc, DialogModes.NO);
}

// Export vector paths to Illustrator file
function exportPaths(folder, name, ext) {
  try {
    var aiFile = new File(folder + '/' + name + ext),
        expOptions = new ExportOptionsIllustrator;

    expOptions.path = IllustratorPathType.ALLPATHS;
    activeDocument.exportDocument(aiFile, ExportType.ILLUSTRATORPATHS, expOptions);
    return aiFile;
  } catch (e) {
    return null;
  }
}

try {
  main();
} catch(e) {}