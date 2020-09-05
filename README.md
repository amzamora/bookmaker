# bookmaker

A tool made to write documentation easier.

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
