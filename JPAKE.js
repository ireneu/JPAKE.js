/*
 * JPAKE.js
 */

(function (module, exports, BN, CryptoJS) {
    var availableParameterSizes = [80, 112, 128];
    // Check environment
    var isBrowser = typeof window !== 'undefined' && this === window;
    // Make necessary Crypto
    var crypto;
    if (isBrowser) {
        crypto = window.crypto || window.msCrypto;
        assert(typeof crypto !== 'undefined', 'No browser crypto support!');
    } else {
        try {
            crypto = require('crypto');
        } catch (e) {
            throw 'No NodeJS crypto support!';
        }
    }
    // Check CryptoJS has SHA512
    assert(CryptoJS.SHA512, 'CryptoJS is missing SHA512!');

    function assert(val, msg) {
        if (!val) throw new Error(msg || 'Assertion failed');
    }

    // https://tc39.github.io/ecma262/#sec-array.prototype.includes
    if (!Array.prototype.includes) {
        Object.defineProperty(Array.prototype, 'includes', {
            value: function(searchElement, fromIndex) {

                // 1. Let O be ? ToObject(this value).
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }

                var o = Object(this);

                // 2. Let len be ? ToLength(? Get(O, "length")).
                var len = o.length >>> 0;

                // 3. If len is 0, return false.
                if (len === 0) {
                    return false;
                }

                // 4. Let n be ? ToInteger(fromIndex).
                //    (If fromIndex is undefined, this step produces the value 0.)
                var n = fromIndex | 0;

                // 5. If n ≥ 0, then
                //  a. Let k be n.
                // 6. Else n < 0,
                //  a. Let k be len + n.
                //  b. If k < 0, let k be 0.
                var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

                function sameValueZero(x, y) {
                    return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
                }

                // 7. Repeat, while k < len
                while (k < len) {
                    // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                    // b. If SameValueZero(searchElement, elementK) is true, return true.
                    // c. Increase k by 1.
                    if (sameValueZero(o[k], searchElement)) {
                        return true;
                    }
                    k++;
                }

                // 8. Return false
                return false;
            }
        });
    }

    function JPAKE(password, parameterSize, signer) {
        this.chosenParameters = getParametersForSize(parameterSize);
        this.pModulo = BN.red(this.chosenParameters.p);
        this.qModulo = BN.red(this.chosenParameters.q);
        this.sharedPassword = new BN(CryptoJS.SHA512(password).toString(), 16);
        this.signerId = signer;
        // Check if copy + paste works as expected:
        assert(this.chosenParameters.p.toRed(this.qModulo).toNumber() === 1);
        assert(this.chosenParameters.g.toRed(this.pModulo).redPow(this.chosenParameters.q).toNumber() === 1);
    }

    function getParametersForSize(parameterSize) {
        assert(availableParameterSizes.includes(parameterSize), 'Bad parameter size!');

        var parameters = {
            80: {
                'p': 'FD7F53811D75122952DF4A9C2EECE4E7F611B7523CEF4400C31E3F80B6512669455D402251FB593D8D58FABFC5F5BA30F6CB9B556CD7813B801D346FF26660B76B9950A5A49F9FE8047B1022C24FBBA9D7FEB7C61BF83B57E7C6A8A6150F04FB83F6D3C51EC3023554135A169132F675F3AE2B61D72AEFF22203199DD14801C7',
                'q': '9760508F15230BCCB292B982A2EB840BF0581CF5',
                'g': 'F7E1A085D69B3DDECBBCAB5C36B857B97994AFBBFA3AEA82F9574C0B3D0782675159578EBAD4594FE67107108180B449167123E84C281613B7CF09328CC8A6E13C167A8B547C8D28E0A3AE1E2BB3A675916EA37F0BFA213562F1FB627A01243BCCA4F1BEA8519089A883DFE15AE59F06928B665E807B552564014C3BFECF492A'
            },
            112: {
                'p': 'C196BA05AC29E1F9C3C72D56DFFC6154A033F1477AC88EC37F09BE6C5BB95F51C296DD20D1A28A067CCC4D4316A4BD1DCA55ED1066D438C35AEBAABF57E7DAE428782A95ECA1C143DB701FD48533A3C18F0FE23557EA7AE619ECACC7E0B51652A8776D02A425567DED36EABD90CA33A1E8D988F0BBB92D02D1D20290113BB562CE1FC856EEB7CDD92D33EEA6F410859B179E7E789A8F75F645FAE2E136D252BFFAFF89528945C1ABE705A38DBC2D364AADE99BE0D0AAD82E5320121496DC65B3930E38047294FF877831A16D5228418DE8AB275D7D75651CEFED65F78AFC3EA7FE4D79B35F62A0402A1117599ADAC7B269A59F353CF450E6982D3B1702D9CA83',
                'q': '90EAF4D1AF0708B1B612FF35E0A2997EB9E9D263C9CE659528945C0D',
                'g': 'A59A749A11242C58C894E9E5A91804E8FA0AC64B56288F8D47D51B1EDC4D65444FECA0111D78F35FC9FDD4CB1F1B79A3BA9CBEE83A3F811012503C8117F98E5048B089E387AF6949BF8784EBD9EF45876F2E6A5A495BE64B6E770409494B7FEE1DBB1E4B2BC2A53D4F893D418B7159592E4FFFDF6969E91D770DAEBD0B5CB14C00AD68EC7DC1E5745EA55C706C4A1C5C88964E34D09DEB753AD418C1AD0F4FDFD049A955E5D78491C0B7A2F1575A008CCD727AB376DB6E695515B05BD412F5B8C2F4C77EE10DA48ABD53F5DD498927EE7B692BBBCDA2FB23A516C5B4533D73980B2A3B60E384ED200AE21B40D273651AD6060C13D97FD69AA13C5611A51B9085'
            },
            128: {
                'p': '90066455B5CFC38F9CAA4A48B4281F292C260FEEF01FD61037E56258A7795A1C7AD46076982CE6BB956936C6AB4DCFE05E6784586940CA544B9B2140E1EB523F009D20A7E7880E4E5BFA690F1B9004A27811CD9904AF70420EEFD6EA11EF7DA129F58835FF56B89FAA637BC9AC2EFAAB903402229F491D8D3485261CD068699B6BA58A1DDBBEF6DB51E8FE34E8A78E542D7BA351C21EA8D8F1D29F5D5D15939487E27F4416B0CA632C59EFD1B1EB66511A5A0FBF615B766C5862D0BD8A3FE7A0E0DA0FB2FE1FCB19E8F9996A8EA0FCCDE538175238FC8B0EE6F29AF7F642773EBE8CD5402415A01451A840476B2FCEB0E388D30D4B376C37FE401C2A2C2F941DAD179C540C1C8CE030D460C4D983BE9AB0B20F69144C1AE13F9383EA1C08504FB0BF321503EFE43488310DD8DC77EC5B8349B8BFE97C2C560EA878DE87C11E3D597F1FEA742D73EEC7F37BE43949EF1A0D15C3F3E3FC0A8335617055AC91328EC22B50FC15B941D3D1624CD88BC25F3E941FDDC6200689581BFEC416B4B2CB73',
                'q': 'CFA0478A54717B08CE64805B76E5B14249A77A4838469DF7F7DC987EFCCFB11D',
                'g': '5E5CBA992E0A680D885EB903AEA78E4A45A469103D448EDE3B7ACCC54D521E37F84A4BDD5B06B0970CC2D2BBB715F7B82846F9A0C393914C792E6A923E2117AB805276A975AADB5261D91673EA9AAFFEECBFA6183DFCB5D3B7332AA19275AFA1F8EC0B60FB6F66CC23AE4870791D5982AAD1AA9485FD8F4A60126FEB2CF05DB8A7F0F09B3397F3937F2E90B9E5B9C9B6EFEF642BC48351C46FB171B9BFA9EF17A961CE96C7E7A7CC3D3D03DFAD1078BA21DA425198F07D2481622BCE45969D9C4D6063D72AB7A0F08B2F49A7CC6AF335E08C4720E31476B67299E231F8BD90B39AC3AE3BE0C6B6CACEF8289A2E2873D58E51E029CAFBD55E6841489AB66B5B4B9BA6E2F784660896AFF387D92844CCB8B69475496DE19DA2E58259B090489AC8E62363CDF82CFD8EF2A427ABCD65750B506F56DDE3B988567A88126B914D7828E2B63A6D7ED0747EC59E0E0A23CE7D8A74C1D2C2A7AFB6A29799620F00E11C33787F7DED3B30E1A22D09F1FBDA1ABBBFBF25CAE05A13F812E34563F99410E73B'
            }
        };

        var chosenParameters = parameters[parameterSize];
        for (var number in chosenParameters) {
            chosenParameters[number] = new BN(chosenParameters[number], 16);
        }
        return chosenParameters;
    }

    function uint8arrayTouint32array(typedArray) {
        assert(typedArray.length % 4 === 0);
        var newArray = new Uint32Array(typedArray.length / 4);
        for (var i = 0; i < typedArray.length / 4; i++) {
            var j = i * 4;
            newArray[i] = typedArray[j] << 24 | typedArray[j+1] << 16 | typedArray[j+2] << 8 | typedArray[j+3]
        }
        return newArray;
    }

    function hexStringToByteArray(hexString) {
        if (hexString.length % 8 !== 0) {
            throw 'Bad hex string length!';
        }

        var myIntArray = [], stringToConvert = hexString;
        while (stringToConvert.length >= 8) {
            myIntArray.push(parseInt(stringToConvert.substring(0, 8), 16));
            stringToConvert = stringToConvert.substring(8, stringToConvert.length);
        }
        return new Uint32Array(myIntArray);
    }

    function byteArrayToHexString(byteArray) {
        var convertedString = '';
        for (var i = 0; i < byteArray.length; i++) {
            convertedString += ('00000000' + byteArray[i].toString(16)).substr(-8);
        }
        return convertedString.toUpperCase();
    }

    function getRandomLowerThan(maxVal) {
        function getRandomUInt32Array(size) {
            if (isBrowser) {
                var browserRandom = new Uint32Array(size);
                crypto.getRandomValues(browserRandom);
                return browserRandom;
            } else {  // NodeJS
                var nodeRandom = new Uint8Array(size * 4);
                crypto.randomFillSync(nodeRandom);
                return uint8arrayTouint32array(nodeRandom);
            }
        }

        var generatedArray;
        var numberOfTriesLeft = 10000;
        while (numberOfTriesLeft > 0) {
            generatedArray = getRandomUInt32Array(maxVal.length);
            if (byteArrayToHexString(generatedArray).localeCompare(byteArrayToHexString(maxVal)) === -1) {
                return generatedArray;
            } else {
                numberOfTriesLeft--;
            }
        }
        throw 'Max number of tries exceded!';
    }

    function addOneToByteArray(byteArray) {
        var newByteArray = byteArray;
        for (var i = newByteArray.length - 1; i >= 0; i--) {
            if (newByteArray[i] < 4294967295) {
                newByteArray[i]++;
                for (var j = i + 1; j < newByteArray.length; j++) {
                    newByteArray[j] = 0;
                }
                return newByteArray;
            }
        }
        throw 'Byte array will overflow!';
    }

    function subtractOneToByteArray(byteArray) {
        newByteArray = byteArray;
        for (var i = newByteArray.length - 1; i >= 0; i--) {
            if (newByteArray[i] > 0) {
                newByteArray[i]--;
                for (var j = i + 1; j < newByteArray.length; j++) {
                    newByteArray[j] = 4294967295;
                }
                return newByteArray;
            }
        }
        throw 'Byte array is already 0!';
    }

    function hashBn(bn) {
        var hash = bn.toString(16);
        var hashLength = ('0000' + hash.length.toString(16)).substr(-4);
        return hashLength + hash;
    }

    JPAKE.prototype.createZKP = function createZKP(generator, exponent, gx) {
        assert(!(generator.red || exponent.red || gx.red));

        var q = this.chosenParameters.q;
        var rand = new BN(  // [0, q)
            byteArrayToHexString(
                getRandomLowerThan(
                    hexStringToByteArray(this.chosenParameters.q.toString(16)))),
            16
        );
        var gr = generator.toRed(this.pModulo).redPow(rand);  // gr = (generator ** rand) mod p
        var s = ''.concat(
            hashBn(generator),
            hashBn(gr),
            hashBn(gx),
            ('0000' + this.signerId.length.toString(16)).substr(-4),
            this.signerId
        );
        var h = new BN(CryptoJS.SHA512(s).toString(), 16);
        var b = (rand.sub(exponent.mul(h))).umod(q);
        return {
            'gr': gr.toString(16),
            'b': b.toString(16),
            'id': this.signerId
        };
    };

    JPAKE.prototype.verifyZKP = function verifyZKP(generator, gx, zkp) {
        assert(!(generator.red || gx.red));

        var gr = new BN(zkp.gr, 16),
            b = new BN(zkp.b, 16);
        if (zkp.id === this.signerId) throw 'Same signer id!';
        var s = ''.concat(
            hashBn(generator),
            hashBn(gr),
            hashBn(gx),
            ('0000' + zkp.id.length.toString(16)).substr(-4),
            zkp.id
        );
        var h = new BN(CryptoJS.SHA512(s).toString(), 16);
        gb = generator.toRed(this.pModulo).redPow(b);
        var y = gx.toRed(this.pModulo).redPow(h);
        if (gr.toString(16) !== gb.redMul(y).toString(16)) throw 'Bad Zero knowledge proof!';
    };

    JPAKE.prototype.firstStep = function () {
        var g = this.chosenParameters.g;
        this.x1 = new BN(  // [0, q)
            byteArrayToHexString(
                getRandomLowerThan(
                    hexStringToByteArray(this.chosenParameters.q.toString(16)))),
            16
        );
        this.x2 = new BN(  // [1, q)
            byteArrayToHexString(
                addOneToByteArray(
                    getRandomLowerThan(
                        subtractOneToByteArray(
                            hexStringToByteArray(
                                this.chosenParameters.q.toString(16)))))),
            16
        );
        this.gx1 = g.toRed(this.pModulo).redPow(this.x1);  // gx1 = (g**x1) mod p
        this.gx2 = g.toRed(this.pModulo).redPow(this.x2);  // gx2 = (g**x2) mod p
        var zkp_x1 = this.createZKP(g, this.x1, this.gx1.fromRed());
        var zkp_x2 = this.createZKP(g, this.x2, this.gx2.fromRed());
        return {
            'gx1': this.gx1.toString(16),
            'gx2': this.gx2.toString(16),
            'zkp_x1': zkp_x1,
            'zkp_x2': zkp_x2
        };
    };

    JPAKE.prototype.secondStep = function (firstStepMessage) {
        var g = this.chosenParameters.g;
        this.gx3 = new BN(firstStepMessage.gx1, 16);
        this.gx4 = new BN(firstStepMessage.gx2, 16);
        if (this.gx4.toString(16) === '1') throw 'gx4 is equal to 1!';
        this.verifyZKP(g, this.gx3, firstStepMessage.zkp_x1);
        this.verifyZKP(g, this.gx4, firstStepMessage.zkp_x2);
        var gA = this.gx1.redMul(this.gx3.toRed(this.pModulo)).redMul(this.gx4.toRed(this.pModulo));
        var eA = this.x2.mul(this.sharedPassword).toRed(this.qModulo).fromRed();
        var A = gA.redPow(eA);
        var zkp_A = this.createZKP(gA.fromRed(), eA, A.fromRed());
        return {
            'A': A.toString(16),
            'zkp_A': zkp_A
        };
    };

    JPAKE.prototype.thirdStep = function (secondStepMessage) {
        var q = this.chosenParameters.q,
            B = (new BN(secondStepMessage.A, 16)).toRed(this.pModulo);
        var generator = this.gx1.redMul(this.gx2).redMul(this.gx3.toRed(this.pModulo));
        this.verifyZKP(generator.fromRed(), B.fromRed(), secondStepMessage.zkp_A);
        var kA = this.x2.mul(this.sharedPassword).neg().umod(q);
        var K = this.gx4.toRed(this.pModulo).redPow(kA).redMul(B).redPow(this.x2);
        return CryptoJS.SHA512(K.toString(16)).toString();
    };

    if (isBrowser) {
        exports.JPAKE = JPAKE;
    } else {
        module.exports = exports = JPAKE;
    }
})(typeof module === 'undefined' || module, this, BN, CryptoJS);
