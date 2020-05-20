[asciinema] is a terminal screen recorder. [:running:] [:package:] [:moon:] [:ledger:]

Methods as separate packages:
- `@extra-asciinema/rec`: use [rollup] to bundle this es module.
- `@extra-asciinema/rec.min`: use in browser ([browserify], [uglify-js]).

With this package you can **auto-generate** terminal recordings
for Node.js examples through **asciinema** *programmatically*.

> Stability: Experimental.

```javascript
const asciinema = require('extra-asciinema');
// import * as asciinema from 'extra-asciinema';

asciinema.recSync('saved.cast', {input: 'example.js'});
// runs example.js interactively in node.js, saves "saved.cast"

asciinema.retimeSync('saved.cast', {inputDelay: 2});
// "saved.cast" is updated

asciinema.uploadSync('saved.cast');
// asciicast URL
```

### reference

| Method                | Action
|-----------------------|-------
| [rec]                 | Record terminal session.
| [cat]                 | Print full output of recorded asciicast to a terminal.
| [retime]              | Updates time in asciicast file.
| [upload]              | Upload recorded asciicast to asciinema.org site.

<br>

[![nodef](https://merferry.glitch.me/card/extra-asciinema.svg)](https://nodef.github.io)

[asciinema]: https://asciinema.org
[browserify]: https://www.npmjs.com/package/browserify
[rollup]: https://www.npmjs.com/package/rollup
[uglify-js]: https://www.npmjs.com/package/uglify-js
[extra-asciinema.min]: https://www.npmjs.com/package/extra-asciinema.min
[rec]: https://github.com/nodef/extra-asciinema/wiki/rec
[cat]: https://github.com/nodef/extra-asciinema/wiki/cat
[retime]: https://github.com/nodef/extra-asciinema/wiki/retime
[upload]: https://github.com/nodef/extra-asciinema/wiki/upload
[:running:]: https://npm.runkit.com/extra-asciinema
[:package:]: https://www.npmjs.com/package/extra-asciinema
[:moon:]: https://www.npmjs.com/package/extra-asciinema.min
[:ledger:]: https://unpkg.com/extra-asciinema/
