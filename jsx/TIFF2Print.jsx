// TIFF2Print.jsx for Adobe Photoshop
// Description: Simple script to save a print ready file in Photoshop.
// Features: + Does not change the source file
//           + Removes guides, empty vector paths before saving TIFF
//           + Shorten measure units MM > CM > M when possible
//           + The file name template is configured in the script code
//           + Allows you to overwrite an existing file or save it with a new index
// Date: August, 2018
// Author: Sergey Osokin, email: hi@sergosokin.ru
// ============================================================================
// Donate (optional): If you find this script helpful and want to support me 
// by shouting me a cup of coffee, you can by via PayPal http://www.paypal.me/osokin/usd
// ============================================================================
// Installation:
// 1. Place script in:
//    Win (32 bit): C:\Program Files (x86)\Adobe\Adobe Photoshop [vers.]\Presets\Scripts\
//    Win (64 bit): C:\Program Files\Adobe\Adobe Photoshop [vers.] (64 Bit)\Presets\Scripts\
//    Mac OS: <hard drive>/Applications/Adobe Photoshop [vers.]/Presets/Scripts
// 2. Restart Photoshop
// 3. Choose File > Scripts > TIFF2Print
// ============================================================================
// Donate (optional): If you find this script helpful and want to support me 
// by shouting me a cup of coffee, you can by via PayPal http://www.paypal.me/osokin/usd
// ============================================================================
// NOTICE:
// Tested with Adobe Photoshop CS5 (Win), CC 2017 & 2018 (Mac), CC 2018 (Win).
// This script is provided "as is" without warranty of any kind.
// Free to use, not for sale.
// ============================================================================
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
// ============================================================================
// Check other author's scripts: https://github.com/creold

#target photoshop
app.bringToFront();

// Const
var scriptName = 'TIFF2Print',
  scriptVersion = '1.0',
  scriptSettings = scriptName + "_settings",
  scriptAuthor = '\u00A9 Sergey Osokin, 2018',
  scriptDonate = 'Donate via PayPal';

// Configuration
if (app.documents.length > 0) {
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
    sizePref, unitPref, compressPref, previewPref; // Declare variables to initialize settings
}

// Main function
function main() {
  if (app.documents.length == 0) {
    alert('Error: \nOpen a document and try again.');
    return; // Stop script
  }
  initSettings();
  uiDialog().show();
}

// Create dialog window
function uiDialog() {
  var win = new Window('dialog', scriptName + ' ver.' + scriptVersion, undefined);
  win.orientation = 'column';
  win.alignChildren = ['fill', 'fill'];

  var namePan = win.add('panel', undefined, 'Name settings');
  namePan.alignChildren = 'left';
  // Add size in file name or not
  var chkName = namePan.add('checkbox', undefined, 'Add width and height (mm)');
  chkName.helpTip = 'Sample: <your-filename>-print.tif or <your-filename>-210x99mm-print.tif';
  chkName.value = sizePref;
  // Convert unit values when possible
  var chkUnit = namePan.add('checkbox', undefined, 'Shorten measure unit (cm/m)');
  chkUnit.helpTip = 'If size > 1000 mm convert mm > cm > m';
  chkUnit.value = unitPref;
  if (!sizePref) {
    chkUnit.enabled = false;
  }

  // Enable/disable convertation panel
  chkName.addEventListener('click', (function () {
    if (this.value) {
      chkUnit.enabled = true;
    }
    if (!this.value) {
      chkUnit.enabled = false;
    }
  }), false);

  // Select image compression
  var compressPan = win.add('panel', undefined, 'Image compression');
  compressPan.alignChildren = 'left';
  compressPan.orientation = 'row';
  var noneCompression = compressPan.add('radiobutton', undefined, 'None');
  var lzwCompression = compressPan.add('radiobutton', undefined, 'LZW');
  if (compressPref) {
    noneCompression.value = compressPref;
  } else {
    lzwCompression.value = true;
  }

  // Generate preview image
  var previewPan = win.add('group');
  previewPan.margins = [16, 0, 0, 0];
  var preview = previewPan.add('checkbox', undefined, 'Save JPG preview');
  preview.helpTip = 'Save a JPG of ' + jpgSizeMax + ' px on the larger side with the same name as the TIFF file';
  preview.value = previewPref;

  // Action buttons
  var btns = win.add('group');
  btns.alignChildren = ['fill', 'fill'];
  var cancel = btns.add('button', undefined, 'Cancel', {name: 'cancel'});
  cancel.helpTip = 'Press Esc to Close';
  var ok = btns.add('button', undefined, 'OK', {name: 'ok'});
  ok.helpTip = 'Press Enter to Run';
  cancel.onClick = function () {
    win.close();
  }
  ok.onClick = okClick;

  // Copyright
  var copyright = win.add('panel', undefined, '', {borderStyle:'none'});
  copyright.orientation = 'column';
  copyright.alignChild = ['center', 'center'];
  copyright.alignment = 'fill';
  copyright.margins = 5;
  var lblCopyright = copyright.add('statictext');
  lblCopyright.text = scriptAuthor;
  var donate = copyright.add('button', undefined, scriptDonate);
  // Opening PayPal donate page
  donate.onClick = function () {
    var fname, shortcut;
    fname = '_PSscript_donate.url';
    shortcut = new File('' + Folder.temp + '/' + fname);
    shortcut.open('w');
    shortcut.writeln('[InternetShortcut]');
    shortcut.writeln('URL=https://www.paypal.me/osokin/usd');
    shortcut.writeln();
    shortcut.close();
    shortcut.execute();
    $.sleep(4000);
    return shortcut.remove();
  }

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
    var compresionType;
    if (noneCompression.value) {
      compresionType = TIFFEncoding.NONE;
    } else {
      compresionType = TIFFEncoding.TIFFLZW
    };
    // Ruler setup
    if (chkName.value) {
      if (saveUnits != 'Units.MM') {
        app.preferences.rulerUnits = Units.MM;
      }
      var docSize = calcSize(originDoc, chkUnit.value); // Calculate doc width & height value 
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
        SaveTIFF(printName, printExt, compresionType);
      }
    } catch (e) { }
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
    sizePref = chkName.value, unitPref = chkUnit.value,
      compressPref = noneCompression.value, previewPref = preview.value;
    saveSettings();
  }
  return win;
}

function initSettings() {
  try {
    var desc = app.getCustomOptions(scriptSettings);
  } catch (e) { }
  if (undefined != desc) {
    try {
      sizePref = desc.getBoolean(0);
      unitPref = desc.getBoolean(1);
      compressPref = desc.getBoolean(2);
      previewPref = desc.getBoolean(3);
      return;
    }
    catch (e) { }
  }
  sizePref = true, unitPref = false,
    compressPref = true, previewPref = true;
}

function saveSettings() {
  var desc = new ActionDescriptor();
  desc.putBoolean(0, sizePref);
  desc.putBoolean(1, unitPref);
  desc.putBoolean(2, compressPref);
  desc.putBoolean(3, previewPref);
  app.putCustomOptions(scriptSettings, desc, true);
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
  return file; // Final name for save
}

// Add zero to the file name before the indexes are less then size
function fillZero(number, size) {
  var str = '000000000' + number;
  return str.slice(str.length - size);
}

function showError(err) {
  if (confirm(scriptName + ': an unknown error has occurred.\n' +
    'Would you like to see more information?', true, 'Unknown Error')) {
    alert(err + ': on line ' + err.line, 'Script Error', true);
  }
}

// Run script
try {
  main();
} catch (e) {
  if (e.number != 8007) {
    showError(e);
  }
}