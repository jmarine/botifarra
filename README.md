Botifarra game
=====================
Copyright © 2026 Jordi Mariné Fort

About
-----

This is a web application to play [Botifarra game](https://en.wikipedia.org/wiki/Botifarra_(card_game)), against remote players.


Installation
------------

### Requisites:
- Install Node JS (>= 24.14)
- Install GIT CLI

### Building instructions:
  $ git clone https://github.com/jmarine/botifarra.git
  $ cd botifarra
  $ npm install
  $ npx vite build --base=/botifarra/

### Deploy:
Copy generated files contained in "dist" folder to "/botifarra" virtual folder of your web server. Example for Apache Web Server:
  $ cp -r dist /var/www/html/botifarra

This application also requires a [WGS server](https://github.com/jmarine/wgs) to support multi-player online games. To install a private WGS server, follow these [instructions](https://github.com/jmarine/wgs/wiki/Installation). After installation, you need to access [WGS's administration page](http://localhost:8080/admin.html), and create 3 applications with the names: **botifarra-51**, **botifarra-101** and **botifarra-151** with the following properties:
- Validator: org.wgs.service.game.BotifarraCardGamesValidator
- Internal Data Class: select "Card"
- Min.: 4 players
- Max.: 4 players
- Roles (optional): P1S, P2E, P1N, P2W


License
-------

The source code of this game is licensed under [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.txt) and uses the libraries:
- [jQuery](http://jquery.com/)
- [L20n](https://github.com/l20n/l20n.js)
- [WGS](https://github.com/jmarine/wgs)
- [CryptoJS](http://code.google.com/p/crypto-js)
