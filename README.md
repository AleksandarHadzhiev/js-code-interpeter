# Table of Contents
1. [About me](#about-me)
2. [What's new](#whats-new)
   - 2.1 [Version 1.1.1](#version-111)
   - 2.2 [Version 1.1.0](#version-110)
   - 2.3 [Version 1.0.0](#version-100)
   - 2.4 [Version 0.0.0](#verions-000)
3. [How to run](#how-to-run)
4. [Documentation](#documentation)
4. [Author](#author)


## About me

This project is an online JS interpeter. 

**Main Features**:
 - Read and write JavaScript code. (Version 1.*)
 - Terminal integration, allowing commands based on the OS of the user. (Version 2.*)
 - Create and load proejcts on your local machine. (Version 3.*)
 - GitHub/GitLab SSO. (Version 4.*)
 - Work with projects from GitHub/GitLab without having to store them on your machine. (Version 4.*)

## What's new

Order of versions - from newest to oldest.

### Version 1.1.1

Small problems were found, with the code display and it not being completely matched with the text field, during the integration of search and replace. The search and replace were pushed as they worked for majority of the cases and the situations in which they didnt work - the problems appeared form the unmatched display with textarea. This problem was fixed in this patch.

### Version 1.1.0

This version adds the feature of searching for text in code. As such it allows the action to be done
via right click and then search, or via a shortcut (which by default will be `ctrl + f`).

Together with that the version will provide the feature of replacing text (if found) in the code. Similar to the search feature it will be via shortcut or the right click and then replace.

### Version 1.0.0

The first version of the project is uploaded to the repository. This version contains only the reader/writer of JavaScript code. 
As such it has the styling (colors, and how the project should work as elements) of the code.

### Verions 0.0.0

The actual project itself is not initialized. Instead, the main functionalities of the project are split into small prototypes, in which where and how to build and use them are practiced and learned. All of those functionalities can be found in the [protoypes](./code-editor/prototypes/) directory.

You can read more about the processes and building of each prototype [here](./docs/prototypes.md)

## How to run

Live version of the project can be found here: for now empty.

To work with the project on your machine (development server) run this command:

```
not yet added
```

You can read more information about how to run and build the project [here](./docs/buildAndRun.md)

## Documentation

For the full documenation visit [here](./docs/documentation.md).

**Summary**

This project has for a goal to provide an online JS IDE, which can work with both: GitHub/GitLab repositories projects and projects on your local machine. The project is split into two parts: frontend and backend. The frontend is build on: JavaScript, HTML and CSS. And the backend is build on python.

The frontend provides the reading, styling and error catching for the code. While the backend provides the creating new files/folders, creating new projects, removing files/folders and others project structure related functionalities.

## Author

The project is created and maitained by [@AleksandarHadzhiev](https://github.com/AleksandarHadzhiev).