asciinema is a terminal screen recorder.

With this package you can **auto-generate** terminal recordings
for Node.js examples through **asciinema** *programmatically*.

```javascript
const asciinema = require('extra-asciinema');

asciinema.recSync('saved.cast', {input: 'example.js'});
// runs example.js interactively in node.js, saves "saved.cast"

asciinema.retimeSync('saved.cast', {inputDelay: 2});
// "saved.cast" is updated

asciinema.uploadSync('saved.cast');
// asciicast URL
```


