#!/bin/bash

# Function build
# params {String} module
# params {String} build
function build {
  # Open the folder
  cd $1
  # Check if the production or development build file exists
  if [ ! -f webpack.$2.config.js ]; then
    # If the build doesn't exists then show an error message
    # and return to the current folder
    echo 'File webpack.'$2'.config.js in '$1' doesnt exists, watch out!'
    cd ..
    return
  fi
  # Call the webpack command to create the bundle
  webpack --config webpack.$2.config.js
  # Return to the modules folders
  cd ..
}

# Open the modules folders
cd public/modules
# Iterate for each module folder we find
for module in */ ; do
  # Call the build function with the module folder name
  # and the parameter we passed to the script
  # (development|production)
  build $module $1
done
