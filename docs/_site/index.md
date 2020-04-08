Mallard is a Chrome devtool extension that can turn any webpage into a contextualized prototyping environment for Machine Learning. More details can be found in our UIST2019 paper [Mallard: Turn the Web into a Contextualized Prototyping Environment for Machine Learning](http://www.pgbovine.net/publications/Mallard-web-as-machine-learning-prototyping-environment_UIST-2019.pdf).

<script src="https://unpkg.com/freezeframe/dist/freezeframe.min.js"></script>
<script src="assets/js/gif.js"></script>

# Installation
Currently, Mallard is distributed as an unpacked extension. You will need to use the __Load unpacked__ functionality in the `chrome://extension` panel to install it. Use this link to download the latest build.

# Mallard Workflow

# Build Instructions
We are able to build the system with the following environment: macOS 10.15.4, node 10, webpack 4.

To build the system, in the project root, simply type `npm run build` (after npm install). If everything goes correctly you should be able to find the compiled and bundled js code in the build/ directory. Then load it as an unpacked extension into Chrome to test.

# License
MIT