# README

This project is an experiment at writing a Converter for Gregorian to [International Fixed Calendar](https://en.wikipedia.org/wiki/International_Fixed_Calendar) written in Typescript.

It also supports converting to the ["Proposed New Standard Year Calendar"](https://twitter.com/ltm/status/1160670266046816257) as seen on Twitter. This may also be known as the [CAL13 Fixed Calendar](http://www.inrete.ch/cal13/en/).

You can verify the International Fixed Calendar conversion is correct using: [http://faerymonarch.tripod.com/wikka.html](http://faerymonarch.tripod.com/wikka.html)

## Usage

```
$ ts-node index.ts // Prints out a set of predefined conversions
```

Or you can require it from a Typescript project and use `toIFCString(date [, useProposed=false ])`
