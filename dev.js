// Test loader for the TizenTube audio mod (used only by a test build of the APK).
// Loads the userscript from the test APK's local server on the TV itself, so
// changes can be tried without publishing each one. The normal APK uses u.js.
(function () {
    fetch('http://127.0.0.1:47913/dev/u.js', { cache: 'no-store' })
        .then(function (r) { return r.text(); })
        .then(function (code) { (0, eval)(code); })
        .catch(function (e) { console.error('[dev] userscript not loaded: ' + e); });
})();
