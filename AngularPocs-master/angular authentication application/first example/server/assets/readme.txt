# Important commands to remove the dependencies 

npm uninstall <name> removes the module from node_modules, but not package.json

npm uninstall <name> --save also removes it from dependencies in package.json

npm uninstall <name> --save-dev also removes it from devDependencies in package.json

npm -g uninstall <name> --save also removes it globally