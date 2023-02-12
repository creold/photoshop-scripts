![header](https://i.ibb.co/Ycswctn/emblem-ps.png)

# Adobe Photoshop Scripts

![Downloads](https://img.shields.io/badge/Downloads-300+-27CF7D.svg) [![Telegram](https://img.shields.io/badge/Telegram%20Channel-%40aiscripts-0088CC.svg)](https://t.me/aiscripts) [![Yotube](https://img.shields.io/badge/Youtube-%40SergOsokinArt-FF0000.svg)](https://www.youtube.com/c/SergOsokinArt/videos)

*Instructions in other languages: [English](README.md), [Русский](README.ru.md)*

## 👨‍💻 Hi
This is a collection of JS scripts for Adobe Photoshop.

The descriptions for each file can be found in the file’s header text. Test environment: Photoshop CC 2017-2019 (Mac OS).   

## Scripts
* [ClearLayer](https://github.com/creold/photoshop-scripts#clearlayer)
* [ExportPathsToAi](https://github.com/creold/photoshop-scripts#exportpathstoai) `(new, 10.08.2022)`
* [GeneratePreview](https://github.com/creold/photoshop-scripts#generatepreview)
* [SaveAll](https://github.com/creold/photoshop-scripts#saveall)
* [SelectShapesByColor](https://github.com/creold/photoshop-scripts#selectshapesbycolor) `(upd, 10.08.2022)`
* [TIFF2Print](https://github.com/creold/photoshop-scripts#tiff2print-10)
* [ToggleLayersLocksByName](https://github.com/creold/photoshop-scripts#togglelayerslocksbyname)

## How to download one script 
1. In the script description, click the "Direct Link" button.
2. The tab will open the script code.
3. Press <kbd>Cmd/Ctrl</kbd> + <kbd>S</kbd> for download.


## How to run scripts

#### Variant 1 — Install 

1. [Download archive](http://bit.ly/2wLaIkq) and unzip. All scripts are in the folder `jsx`
2. Place `<script_name>.jsx` in the Photoshop Scripts folder:
	- OS X: `/Applications/Adobe Photoshop [version]/Presets/Scripts/`
	- Windows (32 bit): `C:\Program Files (x86)\Adobe\Adobe Photoshop [version]\Presets\Scripts\`
	- Windows (64 bit): `C:\Program Files\Adobe\Adobe Photoshop [version] (64 Bit)\Presets\Scripts\`
3. Restart Photoshop
4. You can also setup a custom hotkey in `Edit → Keyboard Shortctus…`

#### Variant 2 — Drag & Drop
Drag and drop the script file (JS or JSX) on Adobe Photoshop icon

#### Variant 3 — Use extensions
I recommend the [Scripshon Trees](https://exchange.adobe.com/creativecloud.details.15873.scripshon-trees.html) panel. In it you can specify which folder your script files are stored in.

## Donate
You can support my work on new scripts via [Buymeacoffee], [FanTalks], [Tinkoff], [ЮMoney], [Donatty], [DonatePay].   

[Buymeacoffee]: https://www.buymeacoffee.com/osokin
[FanTalks]: https://fantalks.io/r/sergey
[Tinkoff]: https://www.tinkoff.ru/rm/osokin.sergey127/SN67U9405/
[ЮMoney]: https://yoomoney.ru/to/410011149615582
[Donatty]: https://donatty.com/sergosokin
[DonatePay]: https://new.donatepay.ru/@osokin

<a href="https://www.buymeacoffee.com/osokin">
  <img width="111" height="40" src="https://i.ibb.co/0ssTJQ1/bmc-badge.png">
</a>

<a href="https://fantalks.io/r/sergey">
  <img width="111" height="40" src="https://i.ibb.co/vcds3vF/fantalks-badge.png">
</a>

<a href="https://yoomoney.ru/to/410011149615582">
  <img width="111" height="40" src="https://i.ibb.co/wwrYWJ5/yoomoney-badge.png">
</a>

<a href="https://donatty.com/sergosokin">
  <img width="111" height="40" src="https://i.ibb.co/s61FGCn/donatty-badge.png">
</a>

<a href="https://new.donatepay.ru/@osokin">
  <img width="111" height="40" src="https://i.ibb.co/0KJ94ND/donatepay-badge.png">
</a>

## ClearLayer
[![Direct](https://img.shields.io/badge/Direct%20Link-ClearLayer.jsx-4873FF.svg)](https://rebrand.ly/ps-clrlyr) [![Download](https://img.shields.io/badge/Download%20All-Zip%20archive-AAA9BC.svg)](https://bit.ly/2wLaIkq)   

Simple script to clear layers content.

![ClearLayer](https://i.ibb.co/hV7NFxB/Clear-Layer.gif) 

## ExportPathsToAi
[![Direct](https://img.shields.io/badge/Direct%20Link-ExportPathsToAi.jsx-4873FF.svg)](https://rebrand.ly/ps-exppths) [![Download](https://img.shields.io/badge/Download%20All-Zip%20archive-AAA9BC.svg)](https://bit.ly/2wLaIkq)   

Exports all visible vector layers from `.psd` to a `.ai` file in the same folder as the original file. Known Photoshop restrictions:

* paths are exported unfilled
* reverse paths order. To fix this, select the paths in Illustrator and click `Reverse Order` in the Layers panel

![ExportPathsToAi](https://i.ibb.co/SXt6r4X/Export-Paths-To-Ai.gif) 

## GeneratePreview
[![Direct](https://img.shields.io/badge/Direct%20Link-GeneratePreview.jsx-4873FF.svg)](https://rebrand.ly/ps-genprvw) [![Download](https://img.shields.io/badge/Download%20All-Zip%20archive-AAA9BC.svg)](https://bit.ly/2wLaIkq)   

Generate JPG preview image from active document. Supports multiple saving with auto-numbering. If you want to change JPG size, edit number in script file `var jpegSizeMax = 1200`.

![GeneratePreview](https://i.ibb.co/HrcPNvs/Generate-Preview.gif)

## SaveAll
[![Direct](https://img.shields.io/badge/Direct%20Link-SaveAll.jsx-4873FF.svg)](https://rebrand.ly/ps-svall) [![Download](https://img.shields.io/badge/Download%20All-Zip%20archive-AAA9BC.svg)](https://bit.ly/2wLaIkq)   

Save all opened docs in one click.

## SelectShapesByColor
[![Direct](https://img.shields.io/badge/Direct%20Link-SelectShapesByColor.jsx-4873FF.svg)](https://rebrand.ly/ps-selbycol) [![Download](https://img.shields.io/badge/Download%20All-Zip%20archive-AAA9BC.svg)](https://bit.ly/2wLaIkq)   

Selects all vector layers and text objects in the document that have the same color as the active layer. Locked layers will also be selected. If you also want to select solid layers `Layer > New Fill Layer > Solid Color...`, edit in script file `var inclSolid = true`.

![SelectShapesByColor](https://i.ibb.co/12FjgfN/Select-Shapes-By-Color.gif) 

## TIFF2Print 1.0
[![Direct](https://img.shields.io/badge/Direct%20Link-TIFF2Print.jsx-4873FF.svg)](https://rebrand.ly/ps-tif2prt) [![Download](https://img.shields.io/badge/Download%20All-Zip%20archive-AAA9BC.svg)](https://bit.ly/2wLaIkq)   

Script to save a print ready .tif file.   

**Features**

* Adding width and height (mm) in file name   
* Shorten measure units (cm/m) when possible   
* Save the preview image with the file for printing   
* Auto adding an index to the name, to save multiple files   
* Parameters are easily configured in the script code   

![TIFF2Print](https://i.ibb.co/ypbCFtX/tiff2print.gif) 

## ToggleLayersLocksByName
[![Direct](https://img.shields.io/badge/Direct%20Link-ToggleLayersLocksByName.jsx-4873FF.svg)](https://rebrand.ly/ps-tglyrlock) [![Download](https://img.shields.io/badge/Download%20All-Zip%20archive-AAA9BC.svg)](https://bit.ly/2wLaIkq)   

Locks layers in the document based on the keyword in the name. Open the script file with a text editor if you want to specify another keyword and replace the text in quotes `key = '[lock]'`.

![ToggleLayersLocksByName](https://i.ibb.co/48zYWg4/Toggle-Layers-Locks-By-Name.gif) 

Don't forget sharing link with a friend 🙂 

## 🤝 Contribute

Found a bug? Please [submit a new issues](https://github.com/creold/photoshop-scripts/issues) on GitHub.

## ✉️ Contact
Email <hi@sergosokin.ru>  
Telegram [@sergosokin](https://t.me/sergosokin)

### 📝 License

All scripts is licensed under the MIT licence.  
See the included LICENSE file for more details.