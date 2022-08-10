/*
  TIFF2Print.jsx for Adobe Photoshop
  Description: Simple script to save a print ready file in Photoshop.
  Features: + Does not change the source file
            + Removes guides, empty vector paths before saving TIFF
            + Shorten measure units MM > CM > M when possible
            + The file name template is configured in the script code
            + Allows you to overwrite an existing file or save it with a new index
  Date: August, 2018
  Author: Sergey Osokin, email: hi@sergosokin.ru

  Installation: https://github.com/creold/photoshop-scripts#how-to-run-scripts

  Release notes:
  1.0 Initial version
  1.1 Added ZIP compression.

  Donate (optional):
  If you find this script helpful, you can buy me a coffee
  - via DonatePay https://new.donatepay.ru/en/@osokin
  - via Donatty https://donatty.com/sergosokin
  - via YooMoney https://yoomoney.ru/to/410011149615582
  - via QIWI https://qiwi.com/n/OSOKIN
  - via PayPal (temporarily unavailable) http://www.paypal.me/osokin/usd

  NOTICE:
  Tested with Adobe Photoshop CS5 (Win), CC 2017 & 2018 (Mac), CC 2018 (Win).
  This script is provided "as is" without warranty of any kind.
  Free to use, not for sale.

  Released under the MIT license.
  http://opensource.org/licenses/mit-license.php

  Check other author's scripts: https://github.com/creold
*/

//@target photoshop
app.bringToFront();

// Const
var scriptName = 'TIFF2Print',
    scriptVersion = 'v.1.1',
    scriptSettings = scriptName + "_settings";

// Configuration
if (documents.length > 0) {
  var originDoc = app.activeDocument,
    savePath = '',
    saveUnits = app.preferences.rulerUnits, // Save current units
    printExt = '.tif', // Extension of a printed file
    printSuffix = 'print', // Suffix before print file extension
    previewExt = '.jpg', // Extension of a preview file
    previewSuffix = 'preview', // Suffix before preview file extension
    divider = '-', // For suffix and to replace spaces
    sizeSuffix = '', // Linear size suffix
    colorProfile = false, //Embed color profile in print file
    jpegQuality = 9, // Maximum value: 12
    jpgSizeMax = 1200, // Unit: px. Size on the larger side
    compressPref; // Declare variables to initialize settings
}

// Main function
function main() {
  if (!isCorrectEnv()) return;
  uiDialog().show();
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

// Create dialog window
function uiDialog() {
  var win = new Window('dialog', scriptName + ' ' + scriptVersion);
      win.orientation = 'column';
      win.alignChildren = ['fill', 'fill'];

  var namePnl = win.add('panel', undefined, 'Name settings');
      namePnl.alignChildren = 'left';
  // Add size in file name or not
  var isSize = namePnl.add('checkbox', undefined, 'Add width and height (mm)');
      isSize.helpTip = 'Sample: <your-filename>-print.tif or <your-filename>-210x99mm-print.tif';
      isSize.value = true;
  // Convert unit values when possible
  var isShort = namePnl.add('checkbox', undefined, 'Shorten measure unit (cm/m)');
      isShort.helpTip = 'If size > 1000 mm convert mm > cm > m';
      isShort.value = false;

  // Enable/disable convertation panel
  isSize.onClick = function () {
    isShort.enabled = this.value ? true : false;
  }

  // Select image compression
  var compPnl = win.add('panel', undefined, 'Image compression');
      compPnl.alignChildren = 'left';
      compPnl.orientation = 'row';
  var noneComp = compPnl.add('radiobutton', undefined, 'None');
      noneComp.value = true;
  var lzwComp = compPnl.add('radiobutton', undefined, 'LZW');
  var zipComp = compPnl.add('radiobutton', undefined, 'ZIP');

  // Generate preview image
  var previewPan = win.add('group');
      previewPan.margins = [16, 0, 0, 0];
  var preview = previewPan.add('checkbox', undefined, 'Save JPG preview');
      preview.helpTip = 'Save a JPG of ' + jpgSizeMax + 
                        ' px on the larger side with ' + 
                        'the same name as the TIFF file';
      preview.value = true;

  // Action buttons
  var btns = win.add('group');
      btns.alignChildren = ['fill', 'fill'];
  var cancel = btns.add('button', undefined, 'Cancel', {name: 'cancel'});
      cancel.helpTip = 'Press Esc to Close';
  var ok = btns.add('button', undefined, 'OK', {name: 'ok'});
      ok.helpTip = 'Press Enter to Run';
  
  initSettings();

  cancel.onClick = win.close;

  ok.onClick = okClick;

  var copyright = win.add('statictext', undefined, '\u00A9 Sergey Osokin. Visit Github');
      copyright.justify = 'center';

  copyright.addEventListener('mousedown', function () {
    openURL('https://github.com/creold');
  });

  function okClick() {
    // Setting file path
    try {
      savePath = originDoc.path;
    } catch (e) {
      // File path for unsaved document
      savePath = Folder.selectDialog('Select the folder for save TIFF');
      if (savePath == null) {
        alert('You need to select a folder to save.');
        return; // Return to dialog
      }
    }

    var compType = TIFFEncoding.NONE;
    if (lzwComp.value) {
      compType = TIFFEncoding.TIFFLZW;
    } else if (zipComp.value) {
      compType = TIFFEncoding.TIFFZIP;
    }

    // Ruler setup
    if (isSize.value) {
      if (saveUnits != 'Units.MM') {
        app.preferences.rulerUnits = Units.MM;
      }
      var docSize = calcSize(originDoc, isShort.value); // Calculate doc width & height value 
      sizeSuffix = divider + docSize.w + 'x' + docSize.h + docSize.unit; // Set suffix
    }

    var nameTpl = prepareName(originDoc) + sizeSuffix; // // Name template

    duplicateDoc(); // Duplicate Image
    clearAllGuides(); // Remove all guides from duplicate

    var doc = app.activeDocument;
    doc.flatten(); // Flatten Image
    delPaths(doc); // Remove empty paths

    try {
      if (savePath != null) {
        var fileName = decodeURI(savePath) + '/' + nameTpl;
        // Save print file
        var printName = fileName + divider + printSuffix;
        SaveTIFF(printName, printExt, compType);
      }
    } catch (e) {}

    // Save preview file 
    if (preview.value == true) {
      resizeDoc(doc, jpgSizeMax); // Resize before save preview
      doc.changeMode(ChangeMode.RGB);
      var previewName = fileName + divider + previewSuffix;
      saveJPEG(previewName, previewExt, jpegQuality);
    }

    doc.close(SaveOptions.DONOTSAVECHANGES); // Close duplicate
    app.preferences.rulerUnits = saveUnits; // Restore original ruler units
    win.close();

    // Save user settings
    saveSettings();
  }

  function initSettings() {
    try {
      var desc = app.getCustomOptions(scriptSettings);
    } catch (e) {}
    if (undefined != desc) {
      try {
        isSize.value = desc.getBoolean(0);
        isShort.value = desc.getBoolean(1);
        compPnl.children[desc.getInteger(2)].value = true;
        preview.value = desc.getBoolean(3);
        if (!isSize.value) isShort.enabled = false;
        return;
      }
      catch (e) {}
    }

    compressPref = true;
  }

  function saveSettings() {
    var comp = 0;
    if (lzwComp.value) {
      comp = 1;
    } else if (zipComp.value) {
      comp = 2;
    }
    var desc = new ActionDescriptor();
    desc.putBoolean(0, isSize.value);
    desc.putBoolean(1, isShort.value);
    desc.putInteger(2, comp);
    desc.putBoolean(3, preview.value);
    app.putCustomOptions(scriptSettings, desc, true);
  }

  return win;
}

// Calculate doc width & height value 
function calcSize(doc, value) {
  var unitType = 'mm';
  var width = Math.round(doc.width.value); // Remove unit type from width
  var height = Math.round(doc.height.value); // Remove unit type from height
  var newWidth = width;
  var newHeight = height;
  // Convert unit only for large layout >=1000x1000 mm
  if (value == true && width >= 1000 && height >= 1000) {
    if (isInteger(width / 1000) && isInteger(height / 1000)) {
      newWidth = convertUnit(width, '000');
      newHeight = convertUnit(height, '000');
      unitType = 'm';
    } else if (isInteger(width / 10) && isInteger(height / 10)) {
      newWidth = convertUnit(width, '0');
      newHeight = convertUnit(height, '0');
      unitType = 'cm';
    }
  }
  return { 'unit': unitType, 'w': newWidth, 'h': newHeight };
}

function isInteger(number) {
  return Math.round(number) === number;
}

function convertUnit(number, size) {
  var str = number.toString();
  var lastZeroPosition = str.lastIndexOf(size);
  if (lastZeroPosition > -1) {
    return str.slice(0, lastZeroPosition);
  }
  return str;
}

function prepareName(doc) {
  var name = decodeURI(doc.name);
  name = name.replace(/\s/g, divider); // Replace all space symbols
  var lastDotPosition = name.lastIndexOf('.');
  if (lastDotPosition > -1) {
    return name.slice(0, lastDotPosition); // Remove filename extension
  }
  return name;
}

// Duplicate original document
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

// Delete empty vector paths
function delPaths(target) {
  for (var i = 0; i < target.pathItems.length; i++) {
    target.pathItems[i].remove();
  }
}

// Resize image to specific size
function resizeDoc(doc, size) {
  app.preferences.rulerUnits = Units.PIXELS;
  if (doc.height.value > size || doc.width.value > size) {
    // If height > width resize based on height. Change DPI to 72
    if (doc.height.value > doc.width.value) {
      doc.resizeImage(null, UnitValue(size, 'px'), 72, ResampleMethod.BICUBIC);
    } else {
      doc.resizeImage(UnitValue(size, 'px'), null, 72, ResampleMethod.BICUBIC);
    }
  }
}

// Save print file in TIFF format
function SaveTIFF(fileName, ext, compression) {
  var file = saveFile(fileName, ext);
  tiffSaveOptions = new TiffSaveOptions();
  tiffSaveOptions.alphaChannels = false;
  tiffSaveOptions.byteOrder = ByteOrder.IBM;
  tiffSaveOptions.embedColorProfile = colorProfile;
  tiffSaveOptions.imageCompression = compression;
  tiffSaveOptions.layerCompression = LayerCompression.RLE;
  tiffSaveOptions.layers = false;
  tiffSaveOptions.transparency = false;
  app.activeDocument.saveAs(file, tiffSaveOptions, true, Extension.LOWERCASE);
  alert('The file saved as:\n' + decodeURI(file.name));
}

// Save preview file in JPEG format
function saveJPEG(fileName, ext, quality) {
  if (quality > 12) quality = 12; // Because max JPG quality = 12
  var file = saveFile(fileName, ext);
  if (app.activeDocument.bitsPerChannel != BitsPerChannelType.EIGHT) {
    app.activeDocument.bitsPerChannel = BitsPerChannelType.EIGHT;
  }
  jpgSaveOptions = new JPEGSaveOptions();
  jpgSaveOptions.embedColorProfile = false;
  jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
  jpgSaveOptions.matte = MatteType.NONE;
  jpgSaveOptions.quality = quality;
  app.activeDocument.saveAs(file, jpgSaveOptions, true, Extension.LOWERCASE);
  alert('The file saved as:\n' + decodeURI(file.name));
}

// Check if there is already such a file
function saveFile(fileName, ext) {
  var file = File(fileName + ext);
  var msg = 'A file with the same name already exists in the folder "' + 
            decodeURI(file.parent.name) + 
            '". Replacing it will overwrite its current contents.';
  if (file.exists) {
    var rewrite = confirm('"' + decodeURI(file.name) + 
                  '" already exists. Do you want to replace it?\n' + msg);
    if (!rewrite) {
      var counter = 2;
      do {
        var newName = fileName + '-' + fillZero(counter++, 2);
        file = File(newName + ext);
      } while (file.exists)
    }
  }
  return file; // Final name for save
}

// Add zero to the file name before the indexes are less then size
function fillZero(number, size) {
  var str = '000000000' + number;
  return str.slice(str.length - size);
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

// Run script
try {
  main();
} catch (e) {}