#!/bin/bash
# pack everything into an .xpi archive
zip -rq crush-those-cookies.xpi \
    forms \
    images \
    modules \
    bootstrap.js \
    chrome.manifest \
    install.rdf \
    LICENSE