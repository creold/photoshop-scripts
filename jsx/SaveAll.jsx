/*
	SaveAll.jsx for Adobe Photoshop
	Description: Simple script to save all opened docs.
	Date: October, 2018
	Author: Sergey Osokin, email: hi@sergosokin.ru
	============================================================================
	Donate (optional): If you find this script helpful and want to support me 
	by shouting me a cup of coffee, you can by via PayPal http://www.paypal.me/osokin/usd
	============================================================================
	NOTICE:
	This script is provided "as is" without warranty of any kind.
	============================================================================
	Released under the MIT license.
	http://opensource.org/licenses/mit-license.php
	============================================================================
	Check other author's scripts: https://github.com/creold
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