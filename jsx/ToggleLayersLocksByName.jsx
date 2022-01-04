/*
  ToggleLayersLocksByName.jsx for Adobe Photoshop
  Description: Locks layers in the document based on the keyword in the name
  Date: September, 2021
  Author: Sergey Osokin, email: hi@sergosokin.ru

  Donate (optional):
  If you find this script helpful, you can buy me a coffee
  - via YooMoney https://yoomoney.ru/to/410011149615582
  - via QIWI https://qiwi.com/n/OSOKIN
  - via Donatty https://donatty.com/sergosokin
  - via PayPal http://www.paypal.me/osokin/usd

  NOTICE:
  Tested with Adobe Photoshop CC 2019.
  This script is provided "as is" without warranty of any kind.
  Free to use, not for sale

  Released under the MIT license
  http://opensource.org/licenses/mit-license.php

  Check other author's scripts: https://github.com/creold
*/

//@target photoshop

function main() {
  if (!app.documents.length) return;

  var doc = app.activeDocument,
      key = '[lock]',
      allLayers = [];

  allLayers = collectAllLayers(doc, allLayers);
  
  for (var i = 0, len = allLayers.length; i < len; i++) {
    var theLayer = allLayers[i];
    if (!theLayer.isBackgroundLayer && theLayer.name.indexOf(key) !== -1) {
      theLayer.allLocked = !theLayer.allLocked;
    }
  }
}

function collectAllLayers(doc, allLayers) {
  for (var i = 0; i < doc.layers.length; i++) {
    var theLayer = doc.layers[i];
    if (theLayer.typename === 'ArtLayer') {
      allLayers.push(theLayer);
    } else if (theLayer.typename === 'LayerSet') {
      allLayers.push(theLayer);
      collectAllLayers(theLayer, allLayers);
    } else {
      collectAllLayers(theLayer, allLayers);
    }
  }

  return allLayers;
}

try {
  main();
} catch (e) {}