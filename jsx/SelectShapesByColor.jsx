/*
  SelectShapesByColor.jsx for Adobe Photoshop
  Description: Select all Shape and Solid layers that have the same color as the selected layer
  Date: April, 2022
  Author: Sergey Osokin, email: hi@sergosokin.ru

  Installation: https://github.com/creold/photoshop-scripts#how-to-run-scripts

  Release notes:
  0.1 Initial version
  0.2 Added live text support

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

  var inclSolid = false; // Include Adjustment Layer > Solid Color to selection
  
  var aLayer = activeDocument.activeLayer;
  if (!aLayer.visible) return;

  var sample = getColor(aLayer), // Hex
      matches = search(sample, inclSolid); // Array of layer ID's

  deselect();

  forEach(matches, function (e) {
    selectByID(e);
  });
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

// Extract color from Shape or Solid color
function getColor(layer) {
  try {
    if (layer.kind == LayerKind.TEXT) {
      return layer.textItem.color.rgb.hexValue;
    } else {
      var desc = getLayerDescriptor(layer);
      var adjs = desc.getList(cTID('Adjs')); // Adjustments

      var clrDesc = adjs.getObjectValue(0),
          color = clrDesc.getObjectValue(cTID('Clr '));

      var red = Math.round(color.getDouble(cTID('Rd  '))),
          green = Math.round(color.getDouble(cTID('Grn '))),
          blue = Math.round(color.getDouble(cTID('Bl  ')));

      var rgbColor = setRGBColor(red, green, blue);

      return rgbColor.rgb.hexValue;
    }
  } catch (e) {
    return ''; // Adjustments is undefined
  }
}

function getLayerDescriptor(layer) {
  var prev = activeDocument.activeLayer;

  if (layer != prev) {
    try {
      activeDocument.activeLayer = layer;
    } catch (e) {}
  }

  var ref = new ActionReference();
  ref.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
  var desc = executeActionGet(ref);

  activeDocument.activeLayer = prev;

  return desc;
}

// Generate solid RGB color
function setRGBColor(r, g, b) {
  var rgb = new RGBColor();

  if (r instanceof Array) {
    r = r[0];
    g = r[1];
    b = r[2];
  }

  rgb.red = parseInt(r);
  rgb.green = parseInt(g);
  rgb.blue = parseInt(b);

  var sColor = new SolidColor();
  sColor.rgb = rgb;

  return sColor;
}

// Search layer color matches
function search(sample, inclSolid) {
  var layers = getLayers(activeDocument.layers),
      out = []; // Array of layer ID's

  forEach(layers, function (e) {
    var color = getColor(e);

    if (color == '') return; // The layer is not a shape or a solid color
    if (getLayerType(e) == 11 && !inclSolid) return; // Skip solid

    // Compare hex value
    if (color === sample) out.push(e.id);
  });

  return out;
}

// Get all single layers
function getLayers(collection) {
  var out = [];

  forEach(collection, function(e) {
    if (!e.visible) return;
    if (/art/i.test(e.typename)) { // ArtLayer
      out.push(e);
    } else if (/set/i.test(e.typename)) { // LayerSet
      out = [].concat(out, getLayers(e.layers));
    } else {
      out = [].concat(out, getLayers(e.layers));
    }
  });

  return out;
}

// Get LayerKind code
function getLayerType(layer) {
  var prev = activeDocument.activeLayer;

  if (layer != prev) {
    try {
      activeDocument.activeLayer = layer;
    } catch (e) {}
  }

  var ref = new ActionReference();
  var desc = new ActionDescriptor();
  ref.putProperty(sTID('property'), sTID('layerKind'));
  ref.putEnumerated(sTID('layer'), sTID('ordinal'), sTID('targetEnum'));
  var type = executeActionGet(ref).getInteger(sTID('layerKind'));

  activeDocument.activeLayer = prev;

  return type;
}

// Deselect all layers in the document
function deselect() { 
  var ref = new ActionReference();
  var desc = new ActionDescriptor();
  ref.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt') ); 
  desc.putReference(cTID('null'), ref); 
  executeAction(sTID('selectNoLayers'), desc, DialogModes.NO); 
}

// Select layer by ID
function selectByID(id) {
  var ref = new ActionReference();
  var desc = new ActionDescriptor();
  ref.putIdentifier(cTID('Lyr '), id);
  desc.putReference(cTID('null'), ref);
  desc.putEnumerated(sTID('selectionModifier'), sTID('selectionModifierType'), sTID('addToSelection'));
  desc.putBoolean(cTID('MkVs'), false);
  executeAction(cTID('slct'), desc, DialogModes.NO);
}

// Calls a provided callback function once for each element in an array
function forEach(collection, fn) {
  for (var i = 0, cLen = collection.length; i < cLen; i++) {
    fn(collection[i]);
  }
}

function cTID(s) { 
  return app.charIDToTypeID(s);
}

function sTID(s) {
  return app.stringIDToTypeID(s);
}

try {
  main();
} catch(e) {}