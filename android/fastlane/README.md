fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew cask install fastlane`

# Available Actions
## Android
### android firebase
```
fastlane android firebase
```
Submit a new Beta Build to Firebase App Distribution
### android beta_android
```
fastlane android beta_android
```
Deploy a new ALPHA version to the Google Play
### android prod_android
```
fastlane android prod_android
```
Deploy a new PROD version to the Google Play
### android build
```
fastlane android build
```
Build

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
