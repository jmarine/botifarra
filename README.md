Botifarra game
=====================
Copyright © 2026 Jordi Mariné Fort

About
-----

This is a web application to play [Botifarra game](https://en.wikipedia.org/wiki/Botifarra_(card_game)), against remote players.


Installation
------------

The application files should be deployed into a web server to work properly in some web browsers.

This application also requires a [WGS server](https://github.com/jmarine/wgs) to support multi-player online games. To install a private WGS server, follow these [instructions](https://github.com/jmarine/wgs/wiki/Installation). After installation, you need to access [WGS's administration page](http://localhost:8080/admin.html), and create 3 applications with the names: **botifarra-51**, **botifarra-101** and **botifarra-151** with the following properties:
- Validator: org.wgs.service.game.BotifarraCardGamesValidator
- Internal Data Class: select "Card"
- Min./Max. players: 4
(the other settings don't need to be changed).


License
-------

The source code of this game is licensed under [GNU GPL v3](https://raw.githubusercontent.com/jmarine/webgl8x8boardgames/master/LICENSE.txt) and uses the libraries:
- [jQuery](http://jquery.com/)
- [L20n](https://github.com/l20n/l20n.js)
- [WGS](https://github.com/jmarine/wgs)
- [CryptoJS](http://code.google.com/p/crypto-js)
