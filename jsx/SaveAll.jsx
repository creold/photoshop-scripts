/*
  SaveAll.jsx for Adobe Photoshop
  Description: Simple script to save all opened docs.
  Date: October, 2018
  Author: Sergey Osokin, email: hi@sergosokin.ru

  Installation: https://github.com/creold/photoshop-scripts#how-to-run-scripts

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

var tempDoc = app.activeDocument;

for (var i = app.documents.length - 1; i >= 0; i--) {
  var currDoc = app.documents[i];
  // TRY..CATCH function for unsaved document
  try {
    if (!currDoc.saved) {
      app.activeDocument = currDoc;
      currDoc.save();
    }
  } catch (e) {}
}

app.activeDocument = tempDoc;