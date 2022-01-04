![header](https://i.ibb.co/Ycswctn/emblem-ps.png)

# Adobe Photoshop Scripts

[![Behance](https://img.shields.io/badge/Behance-%40creold-0055FF.svg)](https://behance.net/creold) [![Instagram](https://img.shields.io/badge/Instagram-%40serg_osokin-8034B2.svg)](https://www.instagram.com/serg_osokin/) [![Yotube](https://img.shields.io/badge/-YouTube%20Channel-FF0000.svg)](https://www.youtube.com/c/SergOsokinArt/videos)

*Инструкция на других языках: [English](README.md), [Русский](README.ru.md)*

## 👨‍💻 Привет
Это коллекция авторских скриптов для Adobe Photoshop. 

Описание каждого скрипта также находится внутри его файла. Тестировалось в Photoshop CC 2017-2019 (Mac OS).   

## ▶️ Как запускать скрипты

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

### 💸 Поддержка (по желанию)
Вы можете поддержать мою работу над новыми скриптами и их распространение любой суммой через [PayPal], [ЮMoney] или [Donatty] 🙂  

[PayPal]: https://paypal.me/osokin/3usd
[ЮMoney]: https://yoomoney.ru/to/410011149615582
[Donatty]: https://donatty.com/sergosokin

<a href="https://paypal.me/osokin/3usd">
  <img width="147" height="40" src="https://i.ibb.co/Z8Wd8Sn/paypal-badge.png" >
</a>

<a href="https://yoomoney.ru/to/410011149615582">
  <img width="147" height="40" src="https://i.ibb.co/448NHjM/yoomoney-badge.png" >
</a>

<a href="https://donatty.com/sergosokin">
  <img width="147" height="40" src="https://i.ibb.co/p2Qj9Fr/donatty-badge.png" >
</a>

## ClearLayer
Скрипт удаляет видимое содержимое выбранного слоя. Заменяет ручные команды: выделить всё и очистить.

![ClearLayer](https://i.ibb.co/hV7NFxB/Clear-Layer.gif) 

<a href="http://bit.ly/2wLaIkq">
  <img width="140" height="43" src="https://i.ibb.co/KyxKwxd/download-ru-ps.png">
</a>

## GeneratePreview
Сохраняет JPG активного документа. При повторном запуске на документе может сохранять под новым номером, например, чтобы сохранять в множестве JPG разное состояние документа. Если хотите изменить размер JPG, откройте файл скрипта текстовым редактором и замените число в пикселях `var jpegSizeMax = 1200;`. Это размер бОльшей стороны, которую скрипт автоматически определит и сохранит пропорционально.

![GeneratePreview](https://i.ibb.co/HrcPNvs/Generate-Preview.gif) 

<a href="http://bit.ly/2wLaIkq">
  <img width="140" height="43" src="https://i.ibb.co/KyxKwxd/download-ru-ps.png">
</a> 

## SaveAll
Сохраняет все открытые документы.

<a href="http://bit.ly/2wLaIkq">
  <img width="140" height="43" src="https://i.ibb.co/KyxKwxd/download-ru-ps.png">
</a> 

## TIFF2Print 1.0

Сохраняет .tif файл для печати из макета.   

**Возможности**

* Добавление размеров (мм) в имя файла
* Автоматическое сокращение записи размеров до см или м   
* Сохранение уменьшенного jpg в той же папке
* Добавление индекса в имя при сохранении нескольких tif с одного файла  
* Изменение параметров в коде скрипта   

![TIFF2Print](https://i.ibb.co/ypbCFtX/tiff2print.gif) 

<a href="http://bit.ly/2wLaIkq">
  <img width="140" height="43" src="https://i.ibb.co/KyxKwxd/download-ru-ps.png">
</a>

## ToggleLayersLocksByName
Блокирует в документе слои по ключевому слову в имени. Откройте файл скрипта текстовым редактором, если хотите задать другое ключевое слово и замените текст в кавычках `key = '[lock]'`.

![ToggleLayersLocksByName](https://i.ibb.co/48zYWg4/Toggle-Layers-Locks-By-Name.gif) 

<a href="http://bit.ly/2wLaIkq">
  <img width="140" height="43" src="https://i.ibb.co/KyxKwxd/download-ru-ps.png">
</a>

Не забывайте поделиться ссылкой со знакомыми дизайнерами 🙂 

## 🤝 Развитие

Нашли ошибку? [Создайте запрос](https://github.com/creold/photoshop-scripts/issues) на Github или напишите мне на почту.

## ✉️ Контакты
Email <hi@sergosokin.ru>  
Telegram [@sergosokin](https://t.me/sergosokin)

### 📝 Лицензия

Скрипты распространяются по лицензии MIT.   
Больше деталей во вложенном файле LICENSE.