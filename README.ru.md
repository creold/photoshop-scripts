![header](https://i.ibb.co/Ycswctn/emblem-ps.png)

# Adobe Photoshop Scripts

![Downloads](https://img.shields.io/badge/Скачивания-300+-27CF7D.svg) [![Telegram](https://img.shields.io/badge/Telegram--канал-%40aiscripts-0088CC.svg)](https://t.me/aiscripts) [![Yotube](https://img.shields.io/badge/Youtube-%40SergOsokinArt-FF0000.svg)](https://www.youtube.com/c/SergOsokinArt/videos)

*Инструкция на других языках: [English](README.md), [Русский](README.ru.md)*

## 👨‍💻 Привет
Это коллекция авторских скриптов для Adobe Photoshop. 

Описание каждого скрипта также находится внутри его файла. Тестировалось в Photoshop CC 2017-2019 (Mac OS).   

## Скрипты
* [ClearLayer](https://github.com/creold/photoshop-scripts/blob/master/README.ru.md#clearlayer)
* [ExportPathsToAi](https://github.com/creold/photoshop-scripts/blob/master/README.ru.md#exportpathstoai) `(new, 10.08.2022)`
* [GeneratePreview](https://github.com/creold/photoshop-scripts/blob/master/README.ru.md#generatepreview)
* [SaveAll](https://github.com/creold/photoshop-scripts/blob/master/README.ru.md#saveall)
* [SelectShapesByColor](https://github.com/creold/photoshop-scripts/blob/master/README.ru.md#selectshapesbycolor) `(upd, 10.08.2022)`
* [TIFF2Print](https://github.com/creold/photoshop-scripts/blob/master/README.ru.md#tiff2print-10)
* [ToggleLayersLocksByName](https://github.com/creold/photoshop-scripts/blob/master/README.ru.md#togglelayerslocksbyname)

<a href="http://bit.ly/2wLaIkq">
  <img width="126" height="43" src="https://i.ibb.co/VWMw1YV/download-ru-ps.png">
</a>

## Как скачать один скрипт
1. В описании скрипта нажмите кнопку «Прямая ссылка».
2. Во вкладке откроется код скрипта.
3. Нажмите <kbd>Cmd/Ctrl</kbd> + <kbd>S</kbd>, чтобы сохранить файл на диск.

## Как запускать скрипты

#### Вариант 1 — Установка 

1. [Скачайте архив](http://bit.ly/2wLaIkq) и распакуйте. Все скрипты находятся в папке `jsx`
2. Поместите `<имя_скрипта>.jsx` в папку скриптов Adobe Photoshop:
	- OS X: `/Applications/Adobe Photoshop [version]/Presets/Scripts/`
	- Windows (32 bit): `C:\Program Files (x86)\Adobe\Adobe Photoshop [version]\Presets\Scripts\`
	- Windows (64 bit): `C:\Program Files\Adobe\Adobe Photoshop [version] (64 Bit)\Presets\Scripts\`
3. Перезапустите Photoshop
4. Вы можете назначить горячие клавиши скриптам через `Edit → Keyboard Shortctus…`

#### Вариант 2 — Drag & Drop
Перетащите файл скрипта из папки напрямую на иконку Adobe Photoshop в панели задач Windows или Finder в Mac OS.

#### Вариант 3 — Расширения (Extension)
Если часто приходится запускать скрипты, то чтобы не открывать постоянно меню, можно установить бесплатную панель [Scripshon Trees](https://exchange.adobe.com/creativecloud.details.15873.scripshon-trees.html).

## Поддержка
Вы можете поддержать мою работу над новыми скриптами и их распространение любой суммой через [Buymeacoffee], [FanTalks] (иностр. карты), [Tinkoff], [ЮMoney], [Donatty], [DonatePay].   

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
[![Direct](https://img.shields.io/badge/Прямая%20ссылка-ClearLayer.jsx-4873FF.svg)](https://rebrand.ly/ps-clrlyr) [![Download](https://img.shields.io/badge/Скачать%20все-Zip--архив-AAA9BC.svg)](https://bit.ly/2wLaIkq)   

Скрипт удаляет видимое содержимое выбранного слоя. Заменяет ручные команды: выделить всё и очистить.

![ClearLayer](https://i.ibb.co/hV7NFxB/Clear-Layer.gif) 

## ExportPathsToAi
[![Direct](https://img.shields.io/badge/Прямая%20ссылка-ExportPathsToAi.jsx-4873FF.svg)](https://rebrand.ly/ps-exppths) [![Download](https://img.shields.io/badge/Скачать%20все-Zip--архив-AAA9BC.svg)](https://bit.ly/2wLaIkq)  

Экспортирует все видимые векторные слои из `.psd` в файл `.ai` в ту же папку, где и оригинальный файл. Ограничения Photoshop:

* контуры экспортируются без заливки
* обратный порядок слоев. Для этого выделите полученные контуры в Illustrator и примените команду `Reverse Order` в меню панели Layers

![ExportPathsToAi](https://i.ibb.co/SXt6r4X/Export-Paths-To-Ai.gif) 

## GeneratePreview
[![Direct](https://img.shields.io/badge/Прямая%20ссылка-GeneratePreview.jsx-4873FF.svg)](https://rebrand.ly/ps-genprvw) [![Download](https://img.shields.io/badge/Скачать%20все-Zip--архив-AAA9BC.svg)](https://bit.ly/2wLaIkq)  

Сохраняет JPG активного документа. При повторном запуске на документе может сохранять под новым номером, например, чтобы сохранять в множестве JPG разное состояние документа. Если хотите изменить размер JPG, откройте файл скрипта текстовым редактором и замените число в пикселях `var jpegSizeMax = 1200`. Это размер бОльшей стороны, которую скрипт автоматически определит и сохранит пропорционально.

![GeneratePreview](https://i.ibb.co/HrcPNvs/Generate-Preview.gif) 

## SaveAll
[![Direct](https://img.shields.io/badge/Прямая%20ссылка-SaveAll.jsx-4873FF.svg)](https://rebrand.ly/ps-svall) [![Download](https://img.shields.io/badge/Скачать%20все-Zip--архив-AAA9BC.svg)](https://bit.ly/2wLaIkq)  

Сохраняет все открытые документы.

## SelectShapesByColor
[![Direct](https://img.shields.io/badge/Прямая%20ссылка-SelectShapesByColor.jsx-4873FF.svg)](https://rebrand.ly/ps-selbycol) [![Download](https://img.shields.io/badge/Скачать%20все-Zip--архив-AAA9BC.svg)](https://bit.ly/2wLaIkq)  

Выделяет все векторные слои и текстовые объекты в документе, которые имеют тот же цвет, что и активный слой. Будут выделены и заблокированные слои. Если хотите выделять также слои-заливки `Layer > New Fill Layer > Solid Color...`, откройте файл скрипта текстовым редактором и поставьте `var inclSolid = true`.

![SelectShapesByColor](https://i.ibb.co/12FjgfN/Select-Shapes-By-Color.gif) 

## TIFF2Print 1.0
[![Direct](https://img.shields.io/badge/Прямая%20ссылка-TIFF2Print.jsx-4873FF.svg)](https://rebrand.ly/ps-tif2prt) [![Download](https://img.shields.io/badge/Скачать%20все-Zip--архив-AAA9BC.svg)](https://bit.ly/2wLaIkq)  

Сохраняет .tif файл для печати из макета.   

**Возможности**

* Добавление размеров (мм) в имя файла
* Автоматическое сокращение записи размеров до см или м   
* Сохранение уменьшенного jpg в той же папке
* Добавление индекса в имя при сохранении нескольких tif с одного файла  
* Изменение параметров в коде скрипта   

![TIFF2Print](https://i.ibb.co/ypbCFtX/tiff2print.gif) 

## ToggleLayersLocksByName
[![Direct](https://img.shields.io/badge/Прямая%20ссылка-ToggleLayersLocksByName.jsx-4873FF.svg)](https://rebrand.ly/ps-tglyrlock) [![Download](https://img.shields.io/badge/Скачать%20все-Zip--архив-AAA9BC.svg)](https://bit.ly/2wLaIkq)  

Блокирует в документе слои по ключевому слову в имени. Откройте файл скрипта текстовым редактором, если хотите задать другое ключевое слово и замените текст в кавычках `key = '[lock]'`.

![ToggleLayersLocksByName](https://i.ibb.co/48zYWg4/Toggle-Layers-Locks-By-Name.gif) 

Не забывайте поделиться ссылкой со знакомыми дизайнерами 🙂 

## 🤝 Развитие

Нашли ошибку? [Создайте запрос](https://github.com/creold/photoshop-scripts/issues) на Github или напишите мне на почту.

## ✉️ Контакты
Email <hi@sergosokin.ru>  
Telegram [@sergosokin](https://t.me/sergosokin)

### 📝 Лицензия

Скрипты распространяются по лицензии MIT.   
Больше деталей во вложенном файле LICENSE.