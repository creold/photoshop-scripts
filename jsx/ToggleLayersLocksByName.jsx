/*
  ToggleLayersLocksByName.jsx for Adobe Photoshop
  Description: Locks layers in the document based on the keyword in the name
  Date: September, 2021
  Author: Sergey Osokin, email: hi@sergosokin.ru

  Installation: https://github.com/creold/photoshop-scripts#how-to-run-scripts

  Donate (optional):
  If you find this script helpful, you can buy me a coffee
  - via Buymeacoffee: https://www.buymeacoffee.com/aiscripts
  - via Donatty https://donatty.com/sergosokin
  - via DonatePay https://new.donatepay.ru/en/@osokin
  - via YooMoney https://yoomoney.ru/to/410011149615582

  NOTICE:
  Tested with Adobe Photoshop CC 2019.
  This script is provided "as is" without warranty of any kind.
  Free to use, not for sale

  Released under the MIT license
  http://opensource.org/licenses/mit-license.php

  Check my other scripts: https://github.com/creold
*/

//@target photoshop

function main() {
  if (!isCorrectEnv()) return;

  var doc = app.activeDocument,
      key = '[lock]',
      allLayers = [];

  allLayers = collectAllLayers(doc, allLayers);
  
  for (var i = 0, len = allLayers.length; i < len; i++) {
    var lyr = allLayers[i];
    if (!lyr.isBackgroundLayer && lyr.name.indexOf(key) !== -1) {
      lyr.allLocked = !lyr.allLocked;
    }
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

function collectAllLayers(doc, allLayers) {
  for (var i = 0; i < doc.layers.length; i++) {
    var lyr = doc.layers[i];
    if (lyr.typename === 'ArtLayer') {
      allLayers.push(lyr);
    } else if (lyr.typename === 'LayerSet') {
      allLayers.push(lyr);
      collectAllLayers(lyr, allLayers);
    } else {
      collectAllLayers(lyr, allLayers);
    }
  }

  return allLayers;
}

try {
  main();
} catch (e) {}