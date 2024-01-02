/*
  GeneratePreview.jsx for Adobe Photoshop
  Description: Generate JPG preview image from active document.
  Date: October, 2018
  Author: Sergey Osokin, email: hi@sergosokin.ru

  Installation: https://github.com/creold/photoshop-scripts#how-to-run-scripts

  Donate (optional):
  If you find this script helpful, you can buy me a coffee
  - via Buymeacoffee: https://www.buymeacoffee.com/osokin
  - via Donatty https://donatty.com/sergosokin
  - via DonatePay https://new.donatepay.ru/en/@osokin
  - via YooMoney https://yoomoney.ru/to/410011149615582

  NOTICE:
  Tested with Adobe Photoshop CC 2019-2022.
  This script is provided "as is" without warranty of any kind.
  Free to use, not for sale

  Released under the MIT license.
  http://opensource.org/licenses/mit-license.php

  Check my other scripts: https://github.com/creold
*/

//@target photoshop

if (app.documents.length > 0) {
  var fName = app.activeDocument.name;
  var fileExt = '.jpg';
  var jpegSizeMax = 1200; // for resizeDoc() function. Unit: px
  var newName = prepareName(app.activeDocument);
  var savePath = '';
  // File path for saved doc
  try {
    savePath = app.activeDocument.path;
  } catch (e) {
    // File path for unsaved doc
    savePath = Folder.selectDialog('Select the folder for save preview image');
  }
}

// Main function
function main() {
  duplicateDoc(); // Duplicate Image
  clearAllGuides(); // Remove all guides from duplicate
  var doc = app.activeDocument;
  doc.flatten(); // Flatten Image
  resizeDoc(doc, jpegSizeMax); // Resize image to specific size
  doc.changeMode(ChangeMode.RGB); // Convert Image Mode to RGB
  if (savePath != null) {
    var fileName = decodeURI(savePath) + '/' + newName;
    exportJPG(doc, fileName, fileExt);
  }
  doc.close(SaveOptions.DONOTSAVECHANGES); // Close duplicate
};

function prepareName(doc) {
  var name = decodeURI(doc.name);
  name = name.replace(/\s/g, '-'); // Replace all space symbols
  var lastDotPosition = name.lastIndexOf('.');
  if (lastDotPosition > -1) {
    return name.slice(0, lastDotPosition); // Remove filename extension
  }
  return name;
}

// Duplicate Image
function duplicateDoc(enabled, withDialog) {
  if (enabled != undefined && !enabled) return;
  var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
  var desc1 = new ActionDescriptor();
  var ref1 = new ActionReference();
  ref1.putEnumerated(charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Frst'));
  desc1.putReference(charIDToTypeID('null'), ref1);
  executeAction(charIDToTypeID('Dplc'), desc1, dialogMode);
}

// Remove all guides from duplicate
function clearAllGuides(enabled, withDialog) {
  if (enabled != undefined && !enabled) return;
  var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putEnumerated(charIDToTypeID('Gd  '), charIDToTypeID('Ordn'), charIDToTypeID('Al  '));
  desc.putReference(charIDToTypeID('null'), ref);
  executeAction(charIDToTypeID('Dlt '), desc, dialogMode);
}

// Resize image to specific size
function resizeDoc(doc, size) {
  // If height > width resize based on height. Change DPI to 72
  app.preferences.rulerUnits = Units.PIXELS;
  if (doc.height.value > size || doc.width.value > size) {
    if (doc.height > doc.width) {
      doc.resizeImage(null, UnitValue(size, 'px'), 72, ResampleMethod.BICUBIC);
    } else {
      doc.resizeImage(UnitValue(size, 'px'), null, 72, ResampleMethod.BICUBIC);
    }
  }
}

function exportJPG(doc, fileName, ext) {
  // Web export options
  var options = new ExportOptionsSaveForWeb();
  options.quality = 85;
  options.format = SaveDocumentType.JPEG;
  options.optimized = true;

  var file = File(fileName + ext);
  var msg = 'A file with the same name already exists in the folder "' + decodeURI(file.parent.name) + '". Replacing it will overwrite its current contents.';
  if (file.exists) {
    var rewrite = confirm('"' + decodeURI(file.name) + '" already exists. Do you want to replace it?\n' + msg);
    if (!rewrite) {
      var counter = 2;
      do {
        var newName = fileName + '-' + fillZero(counter++, 2);
        file = File(newName + ext);
      } while (file.exists)
    }
  }
  doc.exportDocument(file, ExportType.SAVEFORWEB, options);
  alert('The file saved as:\n' + decodeURI(file.name));
}

// Add zero to the file name before the indexes are less then size
function fillZero(number, size) {
  var str = '000000000' + number;
  return str.slice(str.length - size);
}

// Run script
try {
  main();
} catch (e) { }