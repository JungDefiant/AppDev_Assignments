# Exploring package.json in Node.js

## Dependencies vs DevDependencies
Dependencies are packages that are required to run a JavaScript module. They are usually installed when someone installs the module. DevDependencies are not installed when the module is installed as a dependency, because these dependencies are intended as packages for testing, documentation, and other dev-specific tools.

## Versioning
Semantic versioning refers to a format used by software engineers to ensure backwards compatibility with dependencies from previous versions. Without a standard for versioning, engineers can run into issues with version lock, where dependencies can't be updated because the code would break, or version promiscuity, where dependencies are assumed to be compatible with future versions of dependencies. By designating different versions of a code base through semantic versioning, engineers can have more control over whether particular versions of a code base will have compatibility with older or newer versions of dependencies.

## Packaging & Maintenance
The fields repository, keywords, author, and license are used when distributing packages by providing metadata that is shared with other developers. When a package is published, developers want to know what license that the code is published under and the repository where the source code is located. The author field is to give proper credit to the creator of the package. The keywords field is used for metadata to quickly search for relevant packages.

## Package-Lock
The package lock file is used by npm to ensure that the packages used in one developer's environment are the exact same as ones used in another developer's environment while working on the same code base. The package file specifies a range of versions, but the package lock file will include the exact version used for an environment. This is useful for identifying differences in builds for the same code base when changes are made to dependencies. Another reason for having a package lock file is to identify bugs when new versions of dependencies are installed.

