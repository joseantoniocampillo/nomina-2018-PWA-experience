importScripts('workbox-sw.prod.v2.1.3.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */
const fileManifest = [
  {
    "url": "404.html",
    "revision": "b9e9fc0893227f025f419ec555daeaf3"
  },
  {
    "url": "bundle.js",
    "revision": "71ed4ed584b3f94c28a0b5f95a3e967c"
  },
  {
    "url": "clock-lib/bootstrap-clockpicker.min.css",
    "revision": "6cb5bb3ffadf83183891fbb1bcd698b7"
  },
  {
    "url": "clock-lib/bootstrap-clockpicker.min.js",
    "revision": "63b29c3dfefe7810658fecd4cb7890b6"
  },
  {
    "url": "clock-lib/jquery-clockpicker.min.css",
    "revision": "9a80c41d27aa84d083362d005e2547d1"
  },
  {
    "url": "clock-lib/jquery-clockpicker.min.js",
    "revision": "63b29c3dfefe7810658fecd4cb7890b6"
  },
  {
    "url": "css/bootstrap-datepicker.min.css",
    "revision": "418b1224f277136501a1364160fc32f4"
  },
  {
    "url": "css/bootstrap.min.css",
    "revision": "282654c5ee87b36cbae19c44a5d64e00"
  },
  {
    "url": "css/mystyles.css",
    "revision": "e0ab7c32907517625472c1245516cdad"
  },
  {
    "url": "index.html",
    "revision": "da33e4b90e8afba11331dd15c0c40095"
  },
  {
    "url": "js/bootstrap-datepicker.min.js",
    "revision": "2814134f125eda0e55aac5846ac49ce7"
  },
  {
    "url": "js/bootstrap.min.js",
    "revision": "d1ea2970e53802116381cfd3f61a747a"
  },
  {
    "url": "js/jquery.min.js",
    "revision": "473957cfb255a781b42cb2af51d54a3b"
  },
  {
    "url": "locales/bootstrap-datepicker.es.min.js",
    "revision": "0c240809f25d1bf69a78e589d81b15fd"
  }
];

const workboxSW = new self.WorkboxSW();
workboxSW.precache(fileManifest);
