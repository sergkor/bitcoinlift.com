"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function InitBulkGeneratePage() {
    var AsyncNoParallel = Util().AsyncNoParallel;
    var GetQueryValue = Query().GetQueryValue;
    // address type
    var addressType = "bech32";
    var segwitAddressTypeRadioButton = document.getElementById("bulk-radio-type-segwit");
    var bech32AddressTypeRadioButton = document.getElementById("bulk-radio-type-bech32");
    var legacyAddressTypeRadioButton = document.getElementById("bulk-radio-type-legacy");
    segwitAddressTypeRadioButton.addEventListener("change", function () { return segwitAddressTypeRadioButton.checked && (addressType = "segwit"); });
    bech32AddressTypeRadioButton.addEventListener("change", function () { return bech32AddressTypeRadioButton.checked && (addressType = "bech32"); });
    legacyAddressTypeRadioButton.addEventListener("change", function () { return legacyAddressTypeRadioButton.checked && (addressType = "legacy"); });
    // bip38
    var bip38Checkbox = document.getElementById("bip38-enabled-bulk");
    var bip38PasswordContainer = document.getElementById("bip38-password-box-div-bulk");
    var bip38PasswordInput = document.getElementById("bip38-password-box-bulk");
    var bip38InfoLink = document.getElementById("show-bip38-info-link-bulk");
    var bip38InfoOverlay = document.getElementById("bip38-info");
    bip38InfoLink.addEventListener("click", function () { return bip38InfoOverlay.style.display = "table"; });
    bip38Checkbox.addEventListener("change", function () { return bip38PasswordContainer.style.display = bip38Checkbox.checked ? "table" : "none"; });
    // generate related elements
    var bulkGenerateButton = document.getElementById("bulk-generate-button");
    var bulkValidateButton = document.getElementById("bulk-validate-button");
    var bulkGenerateCountInput = document.getElementById("bulk-count");
    var resultTextArea = document.getElementById("bulk-addresses");
    var bulkValidateResults = document.getElementById("bulk-validate-results");
    var bulkValidateAutoCheckbox = document.getElementById("bulk-validate-auto");
    var bulkGenerateSlowCheckbox = document.getElementById("bulk-generate-slow");
    function BulkGenerate() {
        return __awaiter(this, void 0, void 0, function () {
            function UpdateProgress() {
                resultTextArea.value = "Generating: ".concat((generatedCount++), "/").concat(count);
            }
            function SetAndFormatResult(result) {
                resultTextArea.value = result
                    .map(function (_a, index) {
                    var address = _a.address, privateKey = _a.privateKey;
                    return "".concat((index + 1), ", \"").concat(address, "\", \"").concat(privateKey, "\"");
                })
                    .join("\n");
            }
            var count, bulkAddressType, generatedCount, slow, bip38Password, encryptionData, allPromises, i, result, allPromises, i, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bulkValidateResults.innerText = "";
                        count = Number(bulkGenerateCountInput.value) | 0;
                        if (isNaN(count)) {
                            resultTextArea.value = "Enter a number";
                            return [2 /*return*/];
                        }
                        if (count < 1) {
                            resultTextArea.value = "Number must be greater than zero";
                            return [2 /*return*/];
                        }
                        if (count > 10000) {
                            resultTextArea.value = "Number must be 10,000 at most";
                            return [2 /*return*/];
                        }
                        bulkAddressType = addressType;
                        generatedCount = 0;
                        slow = bulkGenerateSlowCheckbox.checked;
                        if (!bip38Checkbox.checked) return [3 /*break*/, 8];
                        bip38Password = bip38PasswordInput.value;
                        resultTextArea.value = "Generating initial values";
                        return [4 /*yield*/, WorkerInterface.GenerateRandomBIP38EncryptionData(bip38Password, bulkAddressType)];
                    case 1:
                        encryptionData = _a.sent();
                        if (encryptionData.type === "err") {
                            resultTextArea.value = encryptionData.error;
                            return [2 /*return*/];
                        }
                        UpdateProgress();
                        allPromises = new Array(count);
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < count)) return [3 /*break*/, 6];
                        if (!slow) return [3 /*break*/, 4];
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 50); })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        allPromises[i] = WorkerInterface
                            .GenerateRandomBIP38EncryptedAddress(encryptionData.result)
                            .then(function (res) {
                            UpdateProgress();
                            return res;
                        });
                        _a.label = 5;
                    case 5:
                        ++i;
                        return [3 /*break*/, 2];
                    case 6: return [4 /*yield*/, Promise.all(allPromises)];
                    case 7:
                        result = _a.sent();
                        SetAndFormatResult(result);
                        return [3 /*break*/, 15];
                    case 8:
                        UpdateProgress();
                        allPromises = new Array(count);
                        i = 0;
                        _a.label = 9;
                    case 9:
                        if (!(i < count)) return [3 /*break*/, 13];
                        if (!slow) return [3 /*break*/, 11];
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 50); })];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11:
                        allPromises[i] = WorkerInterface
                            .GenerateRandomAddress(bulkAddressType)
                            .then(function (res) {
                            UpdateProgress();
                            return res;
                        });
                        _a.label = 12;
                    case 12:
                        ++i;
                        return [3 /*break*/, 9];
                    case 13: return [4 /*yield*/, Promise.all(allPromises)];
                    case 14:
                        result = _a.sent();
                        SetAndFormatResult(result);
                        _a.label = 15;
                    case 15:
                        if (bulkValidateAutoCheckbox.checked) {
                            setTimeout(BulkValidate, 1000);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    bulkGenerateButton.addEventListener("click", AsyncNoParallel(BulkGenerate));
    function BulkValidate() {
        return __awaiter(this, void 0, void 0, function () {
            var xhttp;
            return __generator(this, function (_a) {
                bulkValidateResults.innerText = "Checking if generated addresses have transactions in the blockchain...";
                xhttp = new XMLHttpRequest();
                xhttp.open("POST", "https://api.bitcoinlift.com/verify.php", true);
                xhttp.setRequestHeader("Content-Type", "plain/text");
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        // Response
                        var response = this.responseText;
                        if (response) {
                            var parsed = JSON.parse(response);
                            if (parsed && parsed.data && parsed.data.length) {
                                var lines = [];
                                for (var _i = 0, _a = parsed.data; _i < _a.length; _i++) {
                                    var rec = _a[_i];
                                    var address = Object.keys(rec)[0];
                                    var pk = rec[address];
                                    lines.push("<br><a target=\"_blank\" href=\"https://www.blockchain.com/explorer/addresses/btc/".concat(address, "\">").concat(address, "<a><br>key:").concat(pk, "<br>"));
                                }
                                bulkValidateResults.innerHTML = "Found transactions for the following addresses: " + lines.join("");
                            }
                            else {
                                bulkValidateResults.innerText = "Generated addressed do not have any transactions yet! Total number of addresses checked is: " + parsed.total;
                                if (bulkValidateAutoCheckbox.checked) {
                                    setTimeout(BulkGenerate, 1000);
                                }
                            }
                        }
                        else {
                            bulkValidateResults.innerText = "ERROR: no validation response received!";
                        }
                    }
                };
                xhttp.send(resultTextArea.value);
                return [2 /*return*/];
            });
        });
    }
    bulkValidateButton.addEventListener("click", AsyncNoParallel(BulkValidate));
    var auto = GetQueryValue("auto");
    if (auto) {
        bulkValidateAutoCheckbox.checked = true;
        bulkGenerateCountInput.value = "1000";
        legacyAddressTypeRadioButton.checked = true;
        setTimeout(AsyncNoParallel(BulkGenerate), 1000);
    }
}
