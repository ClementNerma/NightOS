#!/bin/sh

if ! command -v cargo > /dev/null
then
    echo "Command 'cargo' was not found, please install the Rust toolchain:"
    echo "> https://rustup.rs/"
    exit 1
fi

if ! command -v broken-md-links > /dev/null
then
    echo "Installing 'broken-md-links'..."

    if ! cargo install broken-md-links
    then
        echo "Failed to install 'broken-md-links'"
        exit 2
    fi

    echo "Done!"
fi

if ! broken-md-links docs/
then
    echo "Broken link(s) found, aborting commit."
    exit 3
fi
