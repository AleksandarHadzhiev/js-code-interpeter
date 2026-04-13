# Table of Contents
1. [About me](#about-me)
2. [What's new](#whats-new)
3. [How to run](#how-to-run)
4. [Documentation](#documentation)
4. [Author](#author)


## About me

This project is an online IDE which aims to support reading and writing HTML/CSS/JS code in both local (browser with the data stored on the machine) and online (browser with codebase being stored in the DB in cloud).

**Main Features**:
 - Read and write HTML/CSS/JS code. (Version 1.*)
 - Terminal integration, allowing commands based on the OS of the user. (Version 2.*)
 - Create and load proejcts on your local machine. (Version 3.*)
 - GitHub/GitLab SSO. (Version 4.*)
 - Work with projects from GitHub/GitLab without having to store them on your machine. (Version 4.*)

## What's new

For the full explanation behind the versions and their goals visit the [Roadmap](./docs/roadMap.md)

The current version of the project is `1.2.1` and is in the process of becoming `1.2.2`.

**Newly added**
   - Remove text based on the caret position

**Supported functionality untill now**:
   - Insert text based on the caret position
   - Load the code on the screen
   - Colorise the code to showcase difference between variables, keywords, functions, etc.
   - Search for code
   - Replace the found code (one by one, or all at once)
   - Select text (pick a point in the text and start moving the mouse around)
   - Copy paste (with allowing to copy the selected text in the clipboard so you can paste it outside the app)

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
