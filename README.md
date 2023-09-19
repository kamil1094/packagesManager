# packagesManager
Script allowing to update npm package in package.json and create pull request iwth given branch name, inluding option to specify version of updated package

# Example usage

Remember to create .evn based on .env.dist with all envs filled

`node src/index.js updatePackage --name="bitbucket" --version="2.11.0" --repository="redocly-trial" --sourceBranch="updatePackageVersion"`


# Command to run with available options:

```Command:
node src/index.js updatePackage
```

```Options:
    -n --name <name>' - 'name of the package you want to update'
    -v --version <version>' - 'version of the package you want to update'
    -r --repository <repository>' - 'repository name'
    -s --sourceBranch <sourceBranch>' - 'name of the source branch'
```

# TODO
* create some sort of configLoader for envs checking
* add some error logging service
* add more options to set custom branch name, etc.
* add option to create dependency if doesnt exist
* add nested package.json file search
