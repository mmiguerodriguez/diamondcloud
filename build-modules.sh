#!/bin/bash

if [[ $1 != "development" && $1 != "production" ]]; then
  echo 'The environment you are trying to build doesnt exists'
  exit 1
fi

# Function build
# params {String} module
# params {String} build
# Calls the webpack function to build a module
function build {
  # Open the folder
  cd $1
  # Check if the production or development build file exists
  if [ ! -f webpack.$2.config.js ]; then
    # If the build doesn't exists then show an error message
    # and return to the current folder
    echo 'File webpack.'$2'.config.js in '$1' doesnt exists'
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
