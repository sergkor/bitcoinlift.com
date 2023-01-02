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
window.addEventListener("load", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, IsDarkMode, SetDarkMode, IsTestnet, AsyncNoParallel, ShowRandomnessCanvas, newLink, isTestnet, RunTests_1, testOverlay_1, testRunningDiv_1, testRunningProgress_1, testDoneDiv_1, testResultTextDiv_1, testResultCloseButton, GenerateSingleAddress;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                CreateWorkers();
                _a = Util(), IsDarkMode = _a.IsDarkMode, SetDarkMode = _a.SetDarkMode, IsTestnet = _a.IsTestnet, AsyncNoParallel = _a.AsyncNoParallel;
                ShowRandomnessCanvas = EntropyCanvas().ShowRandomnessCanvas;
                // set testnet value
                WorkerInterface.SetIsTestnet(IsTestnet());
                // initialize favicon
                {
                    newLink = document.createElement("link");
                    newLink.rel = "shortcut icon";
                    newLink.type = "image/png";
                    newLink.href = "data:image/png;base64,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";
                    document.getElementsByTagName("head")[0].appendChild(newLink);
                }
                // show warning if not running from a local file
                if (window.location.protocol !== "file:") {
                    document.getElementById("warning-text").style.display = "";
                }
                // dark mode events
                {
                    SetDarkMode(IsDarkMode());
                    document.getElementById("light-mode-button").addEventListener("click", function () { return SetDarkMode(false); });
                    document.getElementById("dark-mode-button").addEventListener("click", function () { return SetDarkMode(true); });
                }
                // setup testnet links / texts
                {
                    isTestnet = IsTestnet();
                    if (isTestnet) {
                        document.getElementById("testnet-text").style.display = "";
                        document.getElementById("run-tests-link").style.display = "none";
                    }
                    document.getElementById("testnet-link-li").style.display = isTestnet ? "none" : "";
                    document.getElementById("mainnet-link-li").style.display = isTestnet ? "" : "none";
                }
                // tests
                {
                    RunTests_1 = InitTests();
                    testOverlay_1 = document.getElementById("tests-overlay");
                    testRunningDiv_1 = document.getElementById("tests-running-container");
                    testRunningProgress_1 = document.getElementById("tests-running-progress");
                    testDoneDiv_1 = document.getElementById("tests-done-container");
                    testResultTextDiv_1 = document.getElementById("tests-result");
                    testResultCloseButton = document.getElementById("tests-result-close-button");
                    document.getElementById("run-tests-link").addEventListener("click", AsyncNoParallel(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var failedTestMessages;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    testOverlay_1.style.display = "flex";
                                    testRunningDiv_1.style.display = "flex";
                                    testDoneDiv_1.style.display = "none";
                                    return [4 /*yield*/, RunTests_1(function (current, total) {
                                            testRunningProgress_1.textContent = "".concat(current, "/").concat(total);
                                        })];
                                case 1:
                                    failedTestMessages = _a.sent();
                                    testRunningDiv_1.style.display = "none";
                                    testDoneDiv_1.style.display = "flex";
                                    if (failedTestMessages.length === 0) {
                                        testResultTextDiv_1.textContent = "All tests OK!";
                                    }
                                    else {
                                        testResultTextDiv_1.textContent = "".concat(failedTestMessages.length, " test").concat(failedTestMessages.length === 1 ? "" : "s", " failed! Please report this issue! Check the developer console for details.");
                                        failedTestMessages.forEach(console.error);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); }));
                    testResultCloseButton.addEventListener("click", function () { return testOverlay_1.style.display = "none"; });
                }
                InitializePage();
                GenerateSingleAddress = InitSingleAddressPage();
                InitAddressDetailsPage();
                InitBulkGeneratePage();
                InitPaperWalletPage();
                InitMnemonicSeedPage();
                GetCustomPaperWalletDesign = InitCustomPaperWalletDesign();
                return [4 /*yield*/, ShowRandomnessCanvas()];
            case 1:
                _b.sent();
                return [4 /*yield*/, GenerateSingleAddress()];
            case 2:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
