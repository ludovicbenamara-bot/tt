// Test loader for the TizenTube audio mod (used only by a test build of the APK).
// Loads the userscript from the test APK's local server on the TV itself, so
// changes can be tried without publishing each one. The normal APK uses u.js.
// YouTube TV enforces Trusted Types, so the code goes through a policy.
(function () {
    var policy = null;
    try {
        if (window.trustedTypes && window.trustedTypes.createPolicy) {
            policy = window.trustedTypes.createPolicy('tt-dev-' + Date.now(), {
                createScript: function (s) { return s; }
            });
        }
    } catch (e) { console.error('[dev] no policy: ' + e); }
    function run(code) {
        var script = policy ? policy.createScript(code) : code;
        try {
            (0, eval)(script);
            console.info('[dev] userscript loaded (eval)');
            return;
        } catch (e) { console.error('[dev] eval failed: ' + e); }
        // Fallback: an inline script carrying the page's nonce.
        var existing = document.querySelector('script[nonce]');
        var el = document.createElement('script');
        if (existing) el.setAttribute('nonce', existing.nonce || existing.getAttribute('nonce'));
        el.text = script;
        document.head.appendChild(el);
        console.info('[dev] userscript loaded (script tag)');
    }
    fetch('http://127.0.0.1:47913/dev/u.js', { cache: 'no-store' })
        .then(function (r) { return r.text(); })
        .then(run)
        .catch(function (e) { console.error('[dev] userscript not loaded: ' + e); });
})();
