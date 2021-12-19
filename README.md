# UTty

An advanced node.js tty class.

### Introduction

We know that `process.stdout` in node.js is a WriteStream with tty support.

But there is a lot of troubles using the standard tty class, because some unsupported methods.

> **We can't do these things through standard tty:**
>  - Get current cursor coordinate.
>  - Redraw a line that is not inside the screen.
>  - ...

So there is *UTty*, to solve these problems.

### Theory

Utty is a proxy of a standard tty.

It records the current line according to the outputs.

> CATION: current line **≠** current y!
> |name      | differences |
> |----------|-------------|
> |current line| Start as 0 when UTty is constructed|
> |current y|We don't know what its value is. It is safe to only operate delta y|

### Related Repos

 - [UCON](https://github.com/UniCoderGroup/ucon/)
