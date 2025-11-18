## Roadmap
The development process and goals of this project are split into the main versions -> 1.0.0, 2.0.0, 3.0.0 ....
Each version will have its own smaller roadmap and will be the goals and tasks that are currently most important - 1.1.0, 1.1.1, 1.2.0 ...
The patches or x.x.[patch] are not real goals of the project, but small bug fixes or ideas for improvement of the codebase.
The actual plans are x.[plan].x - with specific goals for this version. 

The version aim to resemble iterations with one or more big goals which are the aim of the iteration. The Roadmap will be updated per major version.

### Version 0.0.0
The goal is to figure out how to build the code reader in such a way, that will allow the user to provide the content (codebase) and the reader will
generate the code colorised (VSCode colorisation as example of color composition).

### Version 1.x.x
- Integrate the found solution in the actual project
- Have a preview view - to the right of the actual code - which disaplys the code in smaller format
- Search and replace
   - Search for content in the file
   - Colorise the content and allow switching between found elements
   - Replace the content with new content
      - One by one
      - All at once
- Redirect between code in file
   - When the user clicks on a variable, function, class, object name - he should be redirected to the initialization of it.
    
