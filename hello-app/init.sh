#!/usr/bin/env bash

if [ "${BUILD_ENV}" = "development" ]; then
    npm run watch
else
    npm start
fi;
