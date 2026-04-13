## Roadmap

# Table of Contents
1. [Process](#process)
2. [Version History](#version-history)
   - 2.1 [Version 1.2.2](#version-122)
   - 2.2 [Version 1.2.1](#version-121)
   - 2.3 [Version 1.2.0](#version-120)
   - 2.4 [Version 1.1.5](#version-115)
   - 2.5 [Version 1.1.4](#version-114)
   - 2.6 [Version 1.1.3](#version-113)
   - 2.7 [Version 1.1.2](#version-112)
   - 2.8 [Version 1.1.1](#version-111)
   - 2.9 [Version 1.1.0](#version-110)
   - 3.0 [Version 1.0.0](#version-100)
   - 3.1 [Version 0.0.0](#verions-000)

# Process

The development process and goals of this project are split into the main versions -> 1.0.0, 2.0.0, 3.0.0 ....
Each version will have its own smaller roadmap and will be the goals and tasks that are currently most important - 1.1.0, 1.1.1, 1.2.0 ...
The patches or x.x.[patch] are not real goals of the project, but small bug fixes or ideas for improvement of the codebase.
The actual plans are x.[plan].x - with specific goals for this version. 

The version aim to resemble iterations with one or more big goals which are the aim of the iteration. The Roadmap will be updated per change in the goals for a version or a new major version added to the codebase.

# Version History

Order of versions - from newest to oldest.

### Version 1.2.2

- Insert/Remove/Change text based on caret position when it is related to text selection

### Version 1.2.1

- remove text based on the caret position

### Version 1.2.0

- write text on the caret position
   
### Version 1.1.5

- allow to search for text in file
- allow to replace the found text in file
- select text on ctrl + f command
- fix copy paste operations from content element
- change line loading structure
   - from two identical lines to text from a file


### Version 1.1.4

Build prototypes to understand how to have fast and stable content loading on the screen, so that there is no black screen when scrolling up/down:
- change the way elements are loaded: only the maximum visible lines on the screen are created - virtual scrolling
- change the way elements are relaoded: no new elemens are created or old removed, the visible lines on the screen get updated

Build prototypes for: text selection and search/replace functionalities with the new content loading approach:
- custom text selection algorithm
- custom caret element

Integrate the learnings from the prototypes in the main project


### Version 1.1.3

Small changes to the search container and styling of highlighted text:
 - change of highlight colors - for better visual composition.
 - change in style - width and height - of the search container and its elements - for more stable view when screen size changes.

### Version 1.1.2

Small changes to the reaplce actions were added:
 - now there are icons for the buttons
 - and there is helping text displayed when the user hovers over the buttons - similar to the way VSCode does it.

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
