# bookmaker

A tool made for writing documentation easier.

## Usage

### Creating a new book
```
bookmaker init
```

Initializes a new bookmaker project. The folder directory ends with the following layout:
```
sections/
themes/
   default/
settings.toml
```

### Sections
To add or change the order of sections edit them on the settings.toml. Then run:
```
bookmaker update
```

### Build
To generate the the book as static content:
```
bookmaker build
```


### Themes
A theme consist of a folder containing a assets folder and a process.js file. The
assets folder contains everything the theme needs like css and javascript files.
On building it's content will be copied to the output folder. (the output folder
is named *book*)

The process file must export a function that receive a list of sections and returns
a list of html files. Each section has a name and it's content. The content
is already as html. So it may look somethings like this:

```
[
   {
      name: "Introduction",
      content: `<h1>Introduction</h1>
                <p>Very welcoming paragraph</p>`
   },
   {
      name: "Development",
      content: `<h1>Development</h1>
                <p>Very important paragraph</p>`
   }
   {
      name: "Conclusion"
      content: `<h1>Conclusion</h1>
                <p>Very conclusive paragraph</p>`
   }
]
```
After processing each resulting html file is also composed of a name and it's content.
