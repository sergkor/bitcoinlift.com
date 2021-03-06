"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
function INIT_CryptoHelper() {
    function BytesToWordArray(bytes) {
        return (new self.CryptoJS.lib.WordArray.init(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes), bytes.length));
    }
    function WordArrayCopy(target) {
        var wordArrays = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            wordArrays[_i - 1] = arguments[_i];
        }
        var totalIndex = 0;
        for (var i = 0; i < wordArrays.length; ++i) {
            var currentWordArray = wordArrays[i];
            var words = currentWordArray.words;
            var count = currentWordArray.sigBytes;
            var index = 0;
            var offset = 0;
            for (var j = 0; j < count; ++j) {
                target[totalIndex++] = words[index] >> ((3 - offset) << 3) & 0xff;
                if (++offset === 4) {
                    offset = 0;
                    ++index;
                }
            }
        }
        return target;
    }
    function WordArrayToNumberArray() {
        var wordArrays = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            wordArrays[_i] = arguments[_i];
        }
        var totalCount = 0;
        wordArrays.forEach(function (e) { return totalCount += e.sigBytes; });
        return WordArrayCopy.apply(void 0, __spreadArray([new Array(totalCount)], wordArrays, false));
    }
    function WordArrayToUint8Array() {
        var wordArrays = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            wordArrays[_i] = arguments[_i];
        }
        var totalCount = 0;
        wordArrays.forEach(function (e) { return totalCount += e.sigBytes; });
        return WordArrayCopy.apply(void 0, __spreadArray([new Uint8Array(totalCount)], wordArrays, false));
    }
    function SHA256(msg) {
        var result = self.CryptoJS.SHA256(typeof msg === "string" ? msg : BytesToWordArray(msg));
        return WordArrayToNumberArray(result);
    }
    function SHA256Bytes(msg) {
        var result = self.CryptoJS.SHA256(typeof msg === "string" ? msg : BytesToWordArray(msg));
        return WordArrayToUint8Array(result);
    }
    function SHA256Hex(msg) {
        var result = self.CryptoJS.SHA256(typeof msg === "string" ? msg : BytesToWordArray(msg));
        return result.toString(self.CryptoJS.enc.Hex);
    }
    function RIPEMD160(bytes) {
        var result = self.CryptoJS.RIPEMD160(BytesToWordArray(bytes));
        return WordArrayToNumberArray(result);
    }
    function HmacSHA512(msg, key) {
        return WordArrayToNumberArray(self.CryptoJS.HmacSHA512(typeof msg === "string" ? msg : BytesToWordArray(msg), typeof key === "string" ? key : BytesToWordArray(key)));
    }
    function AES_Encrypt_ECB_NoPadding(msg, password) {
        var result = self.CryptoJS.AES.encrypt(BytesToWordArray(msg), BytesToWordArray(password), {
            mode: self.CryptoJS.mode.ECB,
            padding: self.CryptoJS.pad.NoPadding
        });
        return WordArrayToNumberArray(result.ciphertext);
    }
    function AES_Decrypt_ECB_NoPadding(ciphertext, password) {
        var result = self.CryptoJS.AES.decrypt({ ciphertext: BytesToWordArray(ciphertext) }, BytesToWordArray(password), {
            mode: self.CryptoJS.mode.ECB,
            padding: self.CryptoJS.pad.NoPadding
        });
        return WordArrayToNumberArray(result);
    }
    function PBKDF2(password, salt, iterations, dklen) {
        if (iterations === void 0) { iterations = 2048; }
        if (dklen === void 0) { dklen = 512 / 32; }
        return WordArrayToNumberArray(self.CryptoJS.PBKDF2(typeof password === "string" ? password : BytesToWordArray(password), typeof salt === "string" ? salt : BytesToWordArray(salt), {
            iterations: iterations,
            keySize: dklen,
            hasher: self.CryptoJS.algo.SHA512
        }));
    }
    // https://github.com/dchest/scrypt-async-js
    function scrypt(password, salt, logN, r, p, dkLen, encoding) {
        function PBKDF2_HMAC_SHA256_OneIter(password, salt, dkLen) {
            if (password.length > 64)
                password = SHA256Bytes(password);
            var innerLen = salt.length + 68;
            var inner = new Array(innerLen);
            var outerKey = new Array(64);
            var derivedKey = [];
            for (var i = 0; i < 64; i++)
                inner[i] = 0x36;
            for (var i = 0; i < password.length; i++)
                inner[i] ^= password[i];
            for (var i = 0; i < salt.length; i++)
                inner[64 + i] = salt[i];
            for (var i = innerLen - 4; i < innerLen; i++)
                inner[i] = 0;
            for (var i = 0; i < 64; i++)
                outerKey[i] = 0x5c;
            for (var i = 0; i < password.length; i++)
                outerKey[i] ^= password[i];
            function incrementCounter() {
                for (var i = innerLen - 1; i >= innerLen - 4; --i) {
                    if (++inner[i] <= 0xff)
                        return;
                    inner[i] = 0;
                }
            }
            while (dkLen >= 32) {
                incrementCounter();
                derivedKey = derivedKey.concat(SHA256(outerKey.concat(SHA256(inner))));
                dkLen -= 32;
            }
            if (dkLen > 0) {
                incrementCounter();
                derivedKey = derivedKey.concat(SHA256(outerKey.concat(SHA256(inner))).slice(0, dkLen));
            }
            return new Uint8Array(derivedKey);
        }
        function salsaXOR(tmp, B, bin, bout) {
            var j0 = tmp[0] ^ B[bin++];
            var j1 = tmp[1] ^ B[bin++];
            var j2 = tmp[2] ^ B[bin++];
            var j3 = tmp[3] ^ B[bin++];
            var j4 = tmp[4] ^ B[bin++];
            var j5 = tmp[5] ^ B[bin++];
            var j6 = tmp[6] ^ B[bin++];
            var j7 = tmp[7] ^ B[bin++];
            var j8 = tmp[8] ^ B[bin++];
            var j9 = tmp[9] ^ B[bin++];
            var j10 = tmp[10] ^ B[bin++];
            var j11 = tmp[11] ^ B[bin++];
            var j12 = tmp[12] ^ B[bin++];
            var j13 = tmp[13] ^ B[bin++];
            var j14 = tmp[14] ^ B[bin++];
            var j15 = tmp[15] ^ B[bin++];
            var x0 = j0;
            var x1 = j1;
            var x2 = j2;
            var x3 = j3;
            var x4 = j4;
            var x5 = j5;
            var x6 = j6;
            var x7 = j7;
            var x8 = j8;
            var x9 = j9;
            var x10 = j10;
            var x11 = j11;
            var x12 = j12;
            var x13 = j13;
            var x14 = j14;
            var x15 = j15;
            for (var i = 0; i < 8; i += 2) {
                var u = void 0;
                u = x0 + x12;
                x4 ^= u << 7 | u >>> (32 - 7);
                u = x4 + x0;
                x8 ^= u << 9 | u >>> (32 - 9);
                u = x8 + x4;
                x12 ^= u << 13 | u >>> (32 - 13);
                u = x12 + x8;
                x0 ^= u << 18 | u >>> (32 - 18);
                u = x5 + x1;
                x9 ^= u << 7 | u >>> (32 - 7);
                u = x9 + x5;
                x13 ^= u << 9 | u >>> (32 - 9);
                u = x13 + x9;
                x1 ^= u << 13 | u >>> (32 - 13);
                u = x1 + x13;
                x5 ^= u << 18 | u >>> (32 - 18);
                u = x10 + x6;
                x14 ^= u << 7 | u >>> (32 - 7);
                u = x14 + x10;
                x2 ^= u << 9 | u >>> (32 - 9);
                u = x2 + x14;
                x6 ^= u << 13 | u >>> (32 - 13);
                u = x6 + x2;
                x10 ^= u << 18 | u >>> (32 - 18);
                u = x15 + x11;
                x3 ^= u << 7 | u >>> (32 - 7);
                u = x3 + x15;
                x7 ^= u << 9 | u >>> (32 - 9);
                u = x7 + x3;
                x11 ^= u << 13 | u >>> (32 - 13);
                u = x11 + x7;
                x15 ^= u << 18 | u >>> (32 - 18);
                u = x0 + x3;
                x1 ^= u << 7 | u >>> (32 - 7);
                u = x1 + x0;
                x2 ^= u << 9 | u >>> (32 - 9);
                u = x2 + x1;
                x3 ^= u << 13 | u >>> (32 - 13);
                u = x3 + x2;
                x0 ^= u << 18 | u >>> (32 - 18);
                u = x5 + x4;
                x6 ^= u << 7 | u >>> (32 - 7);
                u = x6 + x5;
                x7 ^= u << 9 | u >>> (32 - 9);
                u = x7 + x6;
                x4 ^= u << 13 | u >>> (32 - 13);
                u = x4 + x7;
                x5 ^= u << 18 | u >>> (32 - 18);
                u = x10 + x9;
                x11 ^= u << 7 | u >>> (32 - 7);
                u = x11 + x10;
                x8 ^= u << 9 | u >>> (32 - 9);
                u = x8 + x11;
                x9 ^= u << 13 | u >>> (32 - 13);
                u = x9 + x8;
                x10 ^= u << 18 | u >>> (32 - 18);
                u = x15 + x14;
                x12 ^= u << 7 | u >>> (32 - 7);
                u = x12 + x15;
                x13 ^= u << 9 | u >>> (32 - 9);
                u = x13 + x12;
                x14 ^= u << 13 | u >>> (32 - 13);
                u = x14 + x13;
                x15 ^= u << 18 | u >>> (32 - 18);
            }
            B[bout++] = tmp[0] = (x0 + j0) | 0;
            B[bout++] = tmp[1] = (x1 + j1) | 0;
            B[bout++] = tmp[2] = (x2 + j2) | 0;
            B[bout++] = tmp[3] = (x3 + j3) | 0;
            B[bout++] = tmp[4] = (x4 + j4) | 0;
            B[bout++] = tmp[5] = (x5 + j5) | 0;
            B[bout++] = tmp[6] = (x6 + j6) | 0;
            B[bout++] = tmp[7] = (x7 + j7) | 0;
            B[bout++] = tmp[8] = (x8 + j8) | 0;
            B[bout++] = tmp[9] = (x9 + j9) | 0;
            B[bout++] = tmp[10] = (x10 + j10) | 0;
            B[bout++] = tmp[11] = (x11 + j11) | 0;
            B[bout++] = tmp[12] = (x12 + j12) | 0;
            B[bout++] = tmp[13] = (x13 + j13) | 0;
            B[bout++] = tmp[14] = (x14 + j14) | 0;
            B[bout++] = tmp[15] = (x15 + j15) | 0;
        }
        function blockCopy(dst, di, src, si, len) {
            dst.set(src.subarray(si, si + len), di);
        }
        function blockXOR(dst, di, src, si, len) {
            for (var i = 0; i < len; ++i)
                dst[di + i] ^= src[si + i];
        }
        function blockMix(tmp, B, bin, bout, r) {
            blockCopy(tmp, 0, B, bin + (2 * r - 1) * 16, 16);
            for (var i = 0; i < 2 * r; i += 2) {
                salsaXOR(tmp, B, bin + i * 16, bout + i * 8);
                salsaXOR(tmp, B, bin + i * 16 + 16, bout + i * 8 + r * 16);
            }
        }
        function integerify(B, bi, r) {
            return B[bi + (2 * r - 1) * 16];
        }
        function stringToUTF8Bytes(s) {
            var arr = [];
            for (var i = 0; i < s.length; ++i) {
                var c = s.charCodeAt(i);
                if (c < 0x80) {
                    arr.push(c);
                }
                else if (c < 0x800) {
                    arr.push(0xc0 | c >> 6);
                    arr.push(0x80 | c & 0x3f);
                }
                else if (c < 0xd800) {
                    arr.push(0xe0 | c >> 12);
                    arr.push(0x80 | (c >> 6) & 0x3f);
                    arr.push(0x80 | c & 0x3f);
                }
                else {
                    if (i >= s.length - 1)
                        throw new Error('invalid string');
                    ++i;
                    c = (c & 0x3ff) << 10;
                    c |= s.charCodeAt(i) & 0x3ff;
                    c += 0x10000;
                    arr.push(0xf0 | c >> 18);
                    arr.push(0x80 | (c >> 12) & 0x3f);
                    arr.push(0x80 | (c >> 6) & 0x3f);
                    arr.push(0x80 | c & 0x3f);
                }
            }
            return new Uint8Array(arr);
        }
        var hexEnc = '0123456789abcdef'.split('');
        function bytesToHex(p) {
            var len = p.length;
            var arr = [];
            for (var i = 0; i < len; ++i) {
                arr.push(hexEnc[(p[i] >>> 4) & 15]);
                arr.push(hexEnc[(p[i] >>> 0) & 15]);
            }
            return arr.join('');
        }
        var base64Enc = ('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/').split('');
        function bytesToBase64(p) {
            var len = p.length;
            var arr = [];
            var i = 0;
            while (i < len) {
                var a = i < len ? p[i++] : 0;
                var b = i < len ? p[i++] : 0;
                var c = i < len ? p[i++] : 0;
                var t = (a << 16) + (b << 8) + c;
                arr.push(base64Enc[(t >>> 3 * 6) & 63]);
                arr.push(base64Enc[(t >>> 2 * 6) & 63]);
                arr.push(base64Enc[(t >>> 1 * 6) & 63]);
                arr.push(base64Enc[(t >>> 0 * 6) & 63]);
            }
            if (len % 3 > 0) {
                arr[arr.length - 1] = '=';
                if (len % 3 == 1)
                    arr[arr.length - 2] = '=';
            }
            return arr.join('');
        }
        var MAX_UINT = (-1) >>> 0;
        if (p < 1)
            throw new Error('scrypt: invalid p');
        if (r <= 0)
            throw new Error('scrypt: invalid r');
        if (logN < 1 || logN > 31)
            throw new Error('scrypt: logN must be between 1 and 31');
        var N = (1 << logN) >>> 0;
        var XY = new Int32Array(64 * r);
        var V = new Int32Array(32 * N * r);
        var tmp = new Int32Array(16);
        if (r * p >= 1 << 30 || r > MAX_UINT / 128 / p || r > MAX_UINT / 256 || N > MAX_UINT / 128 / r)
            throw new Error('scrypt: parameters are too large');
        if (typeof password == 'string')
            password = stringToUTF8Bytes(password);
        else if (!(password instanceof Uint8Array))
            password = new Uint8Array(password);
        if (typeof salt == 'string')
            salt = stringToUTF8Bytes(salt);
        else if (!(salt instanceof Uint8Array))
            salt = new Uint8Array(salt);
        var B = PBKDF2_HMAC_SHA256_OneIter(password, salt, p * 128 * r); // uint8array
        var xi = 0;
        var yi = 32 * r;
        function smixStart(pos) {
            for (var i = 0; i < 32 * r; ++i) {
                var j = pos + i * 4;
                XY[xi + i] = ((B[j + 3] & 0xff) << 24) | ((B[j + 2] & 0xff) << 16) | ((B[j + 1] & 0xff) << 8) | ((B[j + 0] & 0xff) << 0);
            }
        }
        function smixStep1(start, end) {
            for (var i = start; i < end; i += 2) {
                blockCopy(V, i * (32 * r), XY, xi, 32 * r);
                blockMix(tmp, XY, xi, yi, r);
                blockCopy(V, (i + 1) * (32 * r), XY, yi, 32 * r);
                blockMix(tmp, XY, yi, xi, r);
            }
        }
        function smixStep2(start, end) {
            for (var i = start; i < end; i += 2) {
                var j = integerify(XY, xi, r) & (N - 1);
                blockXOR(XY, xi, V, j * (32 * r), 32 * r);
                blockMix(tmp, XY, xi, yi, r);
                j = integerify(XY, yi, r) & (N - 1);
                blockXOR(XY, yi, V, j * (32 * r), 32 * r);
                blockMix(tmp, XY, yi, xi, r);
            }
        }
        function smixFinish(pos) {
            for (var i = 0; i < 32 * r; ++i) {
                var j = XY[xi + i];
                B[pos + i * 4 + 0] = (j >>> 0) & 0xff;
                B[pos + i * 4 + 1] = (j >>> 8) & 0xff;
                B[pos + i * 4 + 2] = (j >>> 16) & 0xff;
                B[pos + i * 4 + 3] = (j >>> 24) & 0xff;
            }
        }
        for (var i = 0; i < p; i++) {
            smixStart(i * 128 * r);
            smixStep1(0, N);
            smixStep2(0, N);
            smixFinish(i * 128 * r);
        }
        var result = PBKDF2_HMAC_SHA256_OneIter(password, B, dkLen);
        if (encoding == 'base64')
            return bytesToBase64(result);
        else if (encoding == 'hex')
            return bytesToHex(result);
        else if (encoding == 'binary')
            return new Uint8Array(result);
        else
            return result;
    }
    return {
        SHA256: SHA256,
        SHA256Hex: SHA256Hex,
        RIPEMD160: RIPEMD160,
        HmacSHA512: HmacSHA512,
        AES_Encrypt_ECB_NoPadding: AES_Encrypt_ECB_NoPadding,
        AES_Decrypt_ECB_NoPadding: AES_Decrypt_ECB_NoPadding,
        PBKDF2: PBKDF2,
        scrypt: scrypt
    };
}
