# bookmaker

A tool made to write documentation easy.

## Usage

### Creating a new book
```
bookmaker init
```

To create  initialize a new book. The folder directory will have the following configuration:
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
