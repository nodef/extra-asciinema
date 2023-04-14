[asciinema] is a terminal screen recorder.<br>
📦 [Node.js](https://www.npmjs.com/package/extra-asciinema),
🌐 [Web](https://www.npmjs.com/package/extra-asciinema.web),
📜 [Files](https://unpkg.com/extra-asciinema/),
📰 [Docs](https://nodef.github.io/extra-asciinema/).
📘 [Wiki](https://github.com/nodef/extra-asciinema/wiki/).

With this package you can **auto-generate** terminal recordings
for Node.js examples through **asciinema** *programmatically*.
But you need to [install asciinema first]!

This package is available in *Node.js* and *Web* formats (for `retimeData()`).
The web format is exposed as `extra_asciinema` standalone variable and can be
loaded from [jsDelivr CDN].

> Stability: [Experimental](https://www.youtube.com/watch?v=L1j93RnIxEo).

[jsDelivr CDN]: https://cdn.jsdelivr.net/npm/extra-asciinema.web/index.js

<br>

```javascript
const asciinema = require('extra-asciinema');
// import * as asciinema from 'extra-asciinema';

asciinema.recSync('saved.cast', {input: 'example.js'});
// runs example.js interactively in node.js, saves 'saved.cast'

asciinema.retimeSync('saved.cast', {inputDelay: 2});
// 'saved.cast' is updated

asciinema.uploadSync('saved.cast');
// asciicast URL
```

<br>
<br>


## Index

| Property | Description |
|  ----  |  ----  |
| [rec] | Record terminal session. |
| [recSync] | Record terminal session. |
| [cat] | Print full output of recorded asciicast to a terminal. |
| [catSync] | Print full output of recorded asciicast to a terminal. |
| [retime] | Update time in asciicast file. |
| [retimeData] | Update time in asciicast data. |
| [retimeSync] | Update time in asciicast file. |
| [upload] | Upload recorded asciicast to asciinema.org site. |
| [uploadSync] | Upload recorded asciicast to asciinema.org site. |

<br>
<br>


## References

- [asciinema - Record and share your terminal sessions, the simple way](https://asciinema.org)

<br>
<br>


[![](https://img.youtube.com/vi/rjDX5ItsOnQ/maxresdefault.jpg)](https://www.youtube.com/watch?v=rjDX5ItsOnQ)<br>
[![ORG](https://img.shields.io/badge/org-nodef-green?logo=Org)](https://nodef.github.io)


[asciinema]: https://asciinema.org
[install asciinema first]: https://asciinema.org/docs/installation
[rec]: https://nodef.github.io/extra-asciinema/modules.html#rec
[recSync]: https://nodef.github.io/extra-asciinema/modules.html#recSync
[cat]: https://nodef.github.io/extra-asciinema/modules.html#cat
[catSync]: https://nodef.github.io/extra-asciinema/modules.html#catSync
[retime]: https://nodef.github.io/extra-asciinema/modules.html#retime
[retimeData]: https://nodef.github.io/extra-asciinema/modules.html#retimeData
[retimeSync]: https://nodef.github.io/extra-asciinema/modules.html#retimeSync
[upload]: https://nodef.github.io/extra-asciinema/modules.html#upload
[uploadSync]: https://nodef.github.io/extra-asciinema/modules.html#uploadSync
