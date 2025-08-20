#!/bin/bash

VERSION=0.2.6

# Linux builds
NO_STRIP=true pnpm tauri build

# Windows builds
pnpm tauri build --runner cargo-xwin --target x86_64-pc-windows-msvc
pnpm tauri build --debug --runner cargo-xwin --target x86_64-pc-windows-msvc

# Move Files

mkdir builds
mkdir builds/$VERSION

mv "src-tauri/target/release/bundle/appimage/VRC Macros_0.1.0_amd64.AppImage" builds/$VERSION/vrcm-$VERSION.AppImage
mv "src-tauri/target/release/bundle/deb/VRC Macros_0.1.0_amd64.deb" builds/$VERSION/vrcm-$VERSION.deb
mv "src-tauri/target/release/bundle/rpm/VRC Macros-0.1.0-1.x86_64.rpm" builds/$VERSION/vrcm-$VERSION.rpm

mv src-tauri/target/x86_64-pc-windows-msvc/release/VRCMacros.exe builds/$VERSION/vrcm-$VERSION.exe
mv src-tauri/target/x86_64-pc-windows-msvc/debug/VRCMacros.exe builds/$VERSION/vrcm-$VERSION-debug.exe

mv "src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/VRC Macros_0.1.0_x64-setup.exe" builds/$VERSION/vrcm-$VERSION-setup.exe