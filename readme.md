# JPAKE.js

JPAKE.js depends on [CryptoJS](https://code.google.com/archive/p/crypto-js/) for the SHA512 hashing function and on [BN.js](https://github.com/indutny/bn.js) for BigNum manipulation.

Using JPAKE.js on the browser:
```
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/core.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/x64-core.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/sha512.js"></script>
<script src="https://cdn.rawgit.com/indutny/bn.js/v4.11.8/lib/bn.js"></script>
<script src="JPAKE.js"></script>
```

## About JPAKE

JPAKE is a password-authenticated key exchange.
It provides a way for two parties to derive a strong shared key from a shared weak password.

The algorithm offers mutual authentication, giving a MITM attacker only one chance to guess the shared password in order to succeed.

To know more, the paper [Password Authenticated Key Exchange by Juggling, by F. Hao and P. Ryan](http://grouper.ieee.org/groups/1363/Research/contributions/hao-ryan-2008.pdf) is available.
This library has been implemented following the example Java implementation by the authors.

## Motivation

The idea to implement JPAKE in JS arose while trying to establish "secure" communication between a browser and server in a non HTTPS-friendly environment (i.e. local network).
Creating a JS implementation solved the issues for the browser and for the NodeJS server.

## Disclaimer

I am not a cryptography expert and I don't offer any guarantee whatsoever for this library.
Furthermore, the code relies on external open-source libraries making it even harder to ensure tight security.

Feedback and suggestions are welcome in the issues.

## License

This software is licensed under the MIT License.

Copyright Ireneu Pla, 2017.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
