# Shell scripting

The scripting language of [Hydre](../technical/shell.md) offers a lot of powerful easy-to-use features. This allows to create complex script that are still very readable and maintanable.

## Running a command

Hydre uses an intuitive syntax. Commands are written like they would be in \*-sh shells: the command name is followed by arguments, each separated by a space.

Arugments can either be positional (they are written directly), shorts (prefixed by a `-` symbol and one-character long), or longs (prefixed by two `-` symbols). Here is an example:

```hydre
cmdname "pos1" "pos2" -a --arg1
```

This line runs the command called `cmdname`, provides two positional arguments `pos1` and `pos2`, a short one `a` and a long one `arg1`.
Short and long arguments are called _dash arguments_.

### Combining short arguments

It's possible to combine multiple short arguments in once by writing them one after the other:

```hydre
cmdname -abc
```

This line is strictly equivalent to:

```hydre
cmdname -a -b -c
```

### Argument values

Short and long arguments can also require a value. This value must be provided using an `=` symbol or by simply using a space:

```hydre
cmdname -s=1 --long=2
# or:
cmdname -s 1 --long 2
```

## Comments

Comments can be written on a single line with the `#` symbol:

```hydre
cmdname # single-line comment
```

Everything after the `#` symbol is ignored. For multiple-line comments, it's required to use three `#` symbols:

```hydre
###
this
is a
multi-line
comment
###
```

## Variables

Variables are declared with the `var` keyword:

```hydre
var age = 19
```

Here, we declare a variable `age` with value `19`. As variables are typed, this variable will only be allowed to contain numbers from now on - no strings, no booleans, nothing else.

And to assign a new value to it:

```hydre
age = 20
```

## Value types

All arguments must match their expected _type_: if the command is expecting a number, we can't give it a list for instance.

Here is the list of all types and how they are written:

```hydre
# Booleans (bool) (`true` or `false`)
_ = true

# Integers (int)
_ = 3

# Floating-point numbers (float)
_ = 3.14

# Characters (char)
_ = 'a'

# Strings (string)
_ = "abc"

# Lists of a given type (list[type])
_ = [ 3, 3.14 ]

# Paths (path) - must contain at least one `/` to indicate clearly that it's a path and not a string or something else
_ = dir/file.ext
_ = ./file.ext
_ = /tmp

# Commands (used to run custom commands later in functions)
@{ command "pos1" -s --long }
```

One usual type is not listed here: `stream`, which is notably used by commands which manipulate potentially long and/or asynchronous data.

A `string` is composed of multiple `char`s, which are made of single codepoints. This means a _grapheme cluster_ made of multiple codepoints will need to be encoded in a `string`.  
There is also the `num` type which accepts integers and floating-point numbers, and `any` which allows values of all types.  
Finally, there is the `void` type which cannot be written 'as is' but is used in special contexts like [commands return values](#commands-typing). It's a type that contains no data at all.

There are also _presential arguments_, which are dash arguments that take no value. The command will simply check if the argument was provided or not.

**NOTE:** In order to avoid writing errors, positional arguments cannot be provided after a presential argument.

For instance, considering `pos1` and `pos2` are positional arguments, `--pres` a presential argument and `--val` a non-presential long argument:

```hydre
# VALID
command "pos1" "pos2" --pres --val 2

# VALID
command "pos1" --val 2 "pos2" --pres

# VALID
command "pos1" --pres --val 2 "pos2"

# VALID
command --press --val 2 "pos1" "pos2"

# INVALID (we could think by reading this that "pos2" is the
#          value of the non-presential argument "--pres")
command "pos1" --pres "pos2" --val 2
```

## Expressions

To use a variable, we can directly use it like this::

```hydre
tellage ${age}
```

So this code:

```hydre
var age = 20
tellage ${age}
```

Is equivalent to this one:

```hydre
tellage 20
```

It's also possible to perform computations using expressions:

```hydre
var age = 20
var add = 12
tellage ${age + add}
```

String and characters can also be inserted inside a string:

```hydre
var name = "Jack"
echo "Hello, ${name}!" # Hello, Jack!
```

Values in lists through their index (starting at 0):

```hydre
var names = [ "Jack" ]
echo "Hello, ${names[0]}!" # Hello, Jack!
```

Note that getting an out-of-bound index will make the program _panic_, which means it exits immediatly with an error message.

```hydre
var names = [ "Jack" ]
echo "Hello, ${names[1]}!" # Panics
```

## Computing values

It's also possible to compute values using operators. Each operator takes one or multiple operands, which can be either a variable or a literal value.

### Mathematical operators

Mathematical operators all take two operands. If any of the operands is not a number, it will fail.
If both operands are integers, the result will be an integer, but if at least one is a floating-point number, so will be the result.

The operators are:

- `+`: addition
- `-`: substraction
- `*`: multiplication
- `**`: pow
- `/`: division
- `//`: floating-point division (gives a floating-point number even if the two operands are integers)
- `%`: remainder (works only with two integers)

### Bit-wise operators

Bit-wise operators only take integer operands and produce an integer result:

- `&` bit-by-bit and
- `|` bit-by-bit or
- `^` bit-by-bit exclusive or
- `<<` binary left shift operator
- `>>` binary right shift operator
- `~` one's complement - takes a single number

### Logical operators

Logical operators take two operands and return a boolean:

| Symbol | Name                     | Returns `true` if...                 |
| ------ | ------------------------ | ------------------------------------ |
| `&&`   | and                      | `a` and `b` are `true` booleans      |
| `\|\|` | or                       | `a`, `b` or both are `true` booleans |
| `==`   | equal to                 | `a` is equal to `b`                  |
| `!=`   | different than           | `a` is different than `b`            |
| `>`    | greater than             | `a` is greater than `b`              |
| `<`    | lower than               | `a` is lower than `b`                |
| `>=`   | greater than or equal to | `a` is greater than or equal to `b`  |
| `<=`   | lower than or equal to   | `a` is lower than or equal to `b`    |

Finally, there is the `!` operator, which takes a single operand on its right, and simply reverts a boolean.

### Assignment operators

The neutral assignment operator `=` can be prefixed by any mathematical, bit-wise or logical operator's symbol(s). The operator's left operand will be the current variable's content, while the right one will be the value on the left of the assignment operator. The result will then be stored in the variable.

Here is an example:

```hydre
var a = 3

a += 1
a *= 8
a /= 2

echo ${a} # 16
```

Note that the result's type must be compatible with the variable:

```hydre
var a = 0

a &&= 1 # ERROR: Cannot assign a 'bool' to an 'int'
```

There are also the `++` and `--` operators, which respectively increase and decrease the desired variable:

```hydre
var a = 0

a ++
a ++
a --

echo ${a} # 1
```

## Blocks

Blocks allow to run a piece of code multiple times or if a specific condition is met. They are useful combined to comparison operators.

### Conditionals

Conditionals uses the following syntax:

```hydre
if # condition
  command1
end
```

When this block is ran, if `condition` (which is an expression that must result in a boolean) is equal to `true`, `command1` is ran. Here is an example:

```hydre
if 2 + 2 == 4
  command1
end
```

It's possible to specify multiple commands at once:

```hydre
if 2 + 2 == 4
  command1
  command2
  command3
end
```

Note that all commands must be indented by one tabulation.

It's also possible to run a set of commands in case the condition isn't met too using `else`:

```hydre
if 2 + 2 == 4
  command1
else
  command2
end
```

Finally, conditions can be chained using `elif`:

```hydre
if 1 + 1 == 4
  echo "Bizarre."
elif 1 + 1 == 3
  echo "Bizarre!"
else
  echo "Normal."
end
```

## Switches

A _switch_ allows to perform actions depending on a value. It's roughly equivalent to a combination of multiple `if` and `elif` statements.

```hydre
switch rand_int(0, 10)
  when 0
    echo "It's zero!"

  when 1
    echo "It's one!"

  else
    echo "It's something else"
end
```

Note that, for blocks that only contain a single instruction, we can shorten this using the following syntax:

```hydre
switch rand_int(0, 10)
  when 0 -> echo "It's zero!"
  when 1 -> echo "It's one!"
  else   -> echo "It's something else!"
end
```

## Loops

Loops allow to run a piece of code for a while. The most common loop is the range loop:

```hydre
for i in 0..10
  command ${i}
end
```

This will run `command 0` to `command 9`. To include the upper bound, we must add an `=` symbol:

```hydre
for i in 0..=10
  command ${i}
end
```

This will run `command 0` to `command 10`.

We can also iterate on a list:

```hydre
var str = "Jack"

var list = [ "Jack", "John" ]

for name in list
  echo ${name}
end
```

This will display `Jack` and `John`.

To get the indexes as well, we can do:

```hydre
for i, name in list
  echo "${i}: ${name}"
end
```

This will display `0: Jack` and `1: John`.

There is another type of loop, which runs a piece of code while a condition is met:

```hydre
while # condition
  command
end
```

If the `condition` is `false` when the loop is reached, the `command` will not be ran once. Else, it will be ran as long as the `condition` is `true`.

Note that loops can be broke anytime using the `break` keyword:

```hydre
for i in 0..10
  command ${i}

  if i == 2
    break
  end
end
```

This will run `command 0`, `command 1` and `command 2` only.

### Filesystem iteration

It's possible to iterate on a list of files and directories:

```hydre
for file in (./*.txt)
  echo "Found a text file: ${file}"
end
```

The pattern between parenthesis must be a glob pattern. Recursivity is supported to:

```hydre
for file in (**/*.txt)
  echo "Found a text file: ${file}"
end
```

## Functions

Functions allow to split the code in several parts to make it more readable, as well as to re-use similar pieces of code across the script.

```hydre
fn hello()
  echo "Hello!"
end
```

Now we can call `hello` this way:

```hydre
hello() # Will print "Hello !"
```

### Arguments

Function can also take arguments, which must have a type.

```hydre
fn hello (name: string)
  echo "Hello, ${name}!"
end

hello("Jack") # Will print "Hello, Jack!"
```

Arguments can be made optional by providing default values. This also allows to get rid of their explicit type as it's now implicit:

```hydre
fn hello (name = "Unknown")
  echo "Hello, ${name}!"
end

hello()       # Will print "Hello, Unknown!"
hello("Jack") # Will print "Hello, Jack!"
```

Note that a function's arguments do not require to wrap the value between `${...}` as it's implicit. Which means we can write:

```hydre
var name = "Jack"
hello(name) # Prints: "Hello, Jack!"
```

We can also combine functions and blocks, for instance:

```hydre
fn greet (names: list[string]) -> int
  # .len() is called an _extension_, we will see more about that later
  if names.len() == 0
    echo "No one to greet :|"
  else
    for name in names
      echo "Hello, ${name}!"
    end
  end
end

hello([])               # No one to greet :|
hello(["John", "Jack"]) # Hello, John! Hello, Jack!
```

### Return types

Functions can also return values. In such case, they must specify the type of values they return, and ensure all code paths will return a value of this type:

```hydre
fn add (a: num, b: num) -> num
  return a + b
end
```

### Failing

Functions can also _fail_ to indicate something went wrong:

```hydre
fn divide (a: num, b: num) -> fallible num
  if b == 0
    fail "Cannot divide by 0!"
  else
    return a / b
  end
end
```

The `fallible` keyword must be present before the return type to indicate the function may fail (even if the function doesn't return anything).

When a function fails, the program stops and print the provided error message. But it's also possible to handle the error:

```hydre
fn handle_bad_div (a: num, b: num) -> num
  catch divide(a, b)
    ok result
      echo "Divided successfully: ${a} / ${b} = ${result}"

    err errmsg
      echo "Division failed :("
      echo "Here is the error message: ${errmsg}"
  end
end
```

Note that you may handle only the success or error case depending on your needs ; you do not have to handle both cases.

This keyword also allows to catch errors from commands:

```hydre
# Run a command and get error messages from CMDERR instead if the command fails
catch $(somecommand)
  ok data -> echo "Success: ${data}"
  err msg -> echo "Errors: ${msg.join("; ")}"
end
```

#### Retries

It's possible to retry a function until it succeeds using the `retry` keyword:

```hydre
fn may_fail ()
  if rand() > 0.5
    fail "I don't like high numbers"
  end
end

retry may_fail
```

This will run `may_fail`, and run it again if it fails, until it succeeds.

It's also possible to specify a maximum number of retries:

```hydre
retry(5) may_fail()
```

For information, here is the declaration of the native `retry_cmd` command, which allows to try to run a command until it succeeds:

```hydre
fn retry_cmd(cmd: command, retries: string) -> fallible
  retry(retries) cmd.fallible()
  if status() != 0
    fail "Command did not suceed after ${retries} retries."
  end
end
```

It can be used like this:

```hydre
retry_cmd(@{ read "file.txt" }, 10)
```

#### Global failing

A whole script can fail using this keyword, which will result in displaying the error message in CMDERR and exiting immediatly.  
The failure may be handled using `fallible` in the caller script.

## Optional types

Sometimes, it's useful to be able to represent a value that may be either _something_ or _nothing_. In many programming languages, "nothing" is represented as the `null`, `nil` or `()` value.

Optional types are suffixed by a `?` symbol, and may either contain a value of the provided type **or** `null`. Here is an example:

```hydre
fn custom_rand() -> int?
  var rnd = rand_int(-5, 5)

  if rnd > 0
    return rnd
  else
    return null
  end
end
```

To declare a variable with an optional type, we wrap its initialization value in the optional operator `?(...)`:

```hydre
var a = 1 # int
var b = ?(1) # int?
```

Or we explicitly give the variable a nullable type:

```hydre
var b: int? = 1 # int?
```

To initialize the variable with the `null` value instead, we must use the explicit version:

```hydre
var c: int? = null # int?
```

Note that imbricated types are not supported, which means we cannot create `int??` values for instance.

### Handle the `null` value

If we try to access an optional value "as is", we will get a type error:

```hydre
var a = ?(1)

var b = 0
b = a # ERROR: Cannot use an `int?` value where `int` is expected
```

We then have multiple options. We can use one of the nullable types' function:

```hydre
var a = ?(1)

var b = 0

# Make the program exit with an error message if 'a' is null
b = a.unwrap()

# Make the program exit with a custom error message if 'a' is null
b = a.expect("'a' should not be null :(")
```

We can also detect if a value is `null` by using the `.isNull()` method:

```hydre
var a = ?(1)
var b: int? = null

echo ${a.isNull()} # false
echo ${b.isNull()} # true
```

There is also the `.default(T)` method that allows to use a fallback value in case of `null`:

```hydre
var a = ?(1)
var b: int? = null

echo ${a.default(3)} # 1
echo ${b.default(3)} # 3
```

We can also use special syntaxes in blocks:

```hydre
var a = ?(1)

if some a
  # While we are in this block, 'a' is considered as an 'int'
else
  # While we are in this block, 'a' is considered as 'null'
end

while some a
  # Same here
end
```

### The case of optional arguments

When a command takes an optional argument, it's possible to provide a nullable value of the same type instead:

```hydre
var no_newline = ?(false)

echo "Hello!" -n ${no_newline}
```

If the value is `null`, the argument will not be provided. Else, it will be provided with the non-null value.

## Event listeners

Scripts can listen to events using the `on` keyword:

```hydre
on keypress as keycode
  echo "A key was pressed: ${keycode}"
end
```

This program will display a message each time a key is pressed.

If the event listener is registered in a function, the is automatically unregistered when that function returns. If it's registered outside a function, it is unregistered when the script ends.

```hydre
fn test()
  on keypress as keycode # (1)
    # Do something
  end
  # Event listener (1) is unregistered here
end

on keypress as keycode # (2)
  # Do something
end

echo "Hello world!"
# Event listener (2) is unregistered here
```

### Waiting

Scripts may wait for a specific event before continuing. This can be achieved without a `while` loop that consumes a lot of CPU, using the `wait` keyword:

```hydre
wait condition
```

The script will block while the provided `condition` is not `true`. The checking interval is defined by the system, and the condition should as fast to check as possible to consume as little CPU as possible.

```hydre
echo "Please press the <F> key to validate your choice"

var validated = false

on keypress as keycode
  if keycode == KEY_F
    validated = true
  end
end

wait validated

echo "Thanks for validating your choice :D"
```

It's also possible to wait for a variable to not be `null`:

```hydre
echo "Please press a key"

var key: int? = null

on keypress as keycode
  key = keycode
end

wait some key

echo "You pressed key: ${key}"
```

## Imports

As you may already know, command names can be [quite long and complicated](../concepts/applications.md#commands). In order to prevent from having to repeat very long names that are not really readable, it's recommanded to use _imports_ which are declared at the beginning of script with the form `<dev>::<app>::<command>`:

```hydre
import system::fs::read_file

read_file # ...
```

It's then possible to use the `read_file` without prefixing.

To perform multiple imports at once:

```hydre
import system::fs::{read_file, write_file}
```

It's also possible to only bind the application itself:

```hydre
import system::fs

fs::read_file # ...
```

### Aliases

Imported commands can also be aliased:

```hydre
import system::fs as sysfs

sysfs::read_file # ...
```

### Volatile imports

As [volatile applications](../concepts/applications.md#volatile-applications)' commands [are not exposed globally](applications/commands.md#volatile-applications), there is a special import syntax for such applications, allowing to import their commands directly from their [application package](applications/package.md):

```hydre
import ./app.nva::super_command
super_command # ...

# OR
import ./app.nva as app
app::super_command # ...
```

## Commands input & output

### Reading a command's output

Commands output data through _pipes_. There are several output pipes that can be used:

- CMDOUT is the default output pipe, which returns typed values (the command declares its output type beforehand)
- CMDRAW allows to send a `stream`, which is useful when dealing with a lot of data or with external data
- CMDMSG allows to send `string` messages that are displayed in the terminal's windows
- CMDERR allows to send `string` messages that are also displayed, but as error messages

There is a specific syntax to get the output from each pipe. To get the (typed) output from CMDOUT:

```hydre
_ = $(echo "Hello!") # Contains: "Hello!"
```

This is called the _typed reception operator_. It can be used like this for instance:

```hydre
echo ${$(echo "Hello!")} # Prints: "Hello!"
```

But, as this syntax is not very readable, evaluating a single command can be made without the `${...}` expression wrapper:

```hydre
echo $(echo "Hello!") # Prints: "Hello!"
```

Note that this only work if the command supports piping through CMDOUT.

To get the result from CMDRAW instead (as a `stream`), if the command supports it:

```hydre
# '-b' makes 'echo' read from a stream
echo -b $@(streamify "Hello!") # Prints: "Hello!"
```

To get the output of CMDMSG instead (as a `list[string]`):

```hydre
echo $?(echo "Hello!") # Prints: "["Hello!"]"
```

To get the output of CMDERR (as a `list[string]`):

```hydre
echo $!(echo "Hello!") # Prints "[]"
```

To get the combined output of CMDMSG and CMDERR (as a `list[string]`):

```hydre
echo $*(echo "Hello!") # Prints "["Hello!"]"
```

Note that using the `$(...)` operator will make the program panic if the command exits with a non-zero status code.

### Redirecting the output to a file

It's also possible to redirect the output of a command to a file, using the `>` operator. The values are converted to strings before being written, except `stream` values which are written as they are.

```hydre
echo "Hello!" > ./test.txt
```

This works because `echo` outputs by default to CMDOUT, not to CMDMSG. If it did, we could still perform the redirection this way:

```hydre
echo "Hello!" ?> ./test.txt
```

The prefixes are the same as for the `$(...)` operator:

- `>` for CMDOUT
- `@>` for CMDRAW
- `?>` for CMDMSG
- `!>` for CMDERR
- `*>` for CMDMSG and CMDERR combined

### Output data

If a script is [declared as a command](#commands-typing), it gets its own CMDIN, CMDOUT and CMDRAW pipes (the CMDUSR, CMDMSG and CMDERR pipes remain as usual).

They can be accessed using three built-in commands: `cmdin`, `cmdout` and `cmdraw`.

#### Reading from CMDIN

The `cmdin` command simply writes in its CMDOUT the value provided in the shell's CMDIN. For instance:

```hydre
# Considering this shell script accepts `string` values as input.

# If this shell script is called with 'Hello world!' as an input:
echo $(cmdin | length) # Prints: 12
```

The original type is preserved, which means we can perform typed operations on the input value.

#### Returning with CMDOUT

The `cmdout` command takes a typed value and writes it to the shell script's CMDOUT pipe. This also makes the program exit.

#### Writing to CMDRAW

The `cmdraw` command takes a `stream` value and writes it to the shell script's CMDRAW pipe. Only one stream can be piped at a time, so if `cmdraw` is called while another is pending, the command will simply fail (this can be caught with `catch`).

### Input of a command

Some commands accept _inputs_ through the command pipe `|` operator. They can be used this way:

```hydre
echo "Hello world!" > ./somefile.txt

read ./somefile.txt # Prints: "Hello world!"

read ./somefile.txt | length # Prints: 12
```

How does this work exactly? First, `read` reads the file and outputs it to CMDOUT as a `string`, which is then passed to `length` which happens to accept strings as an input. It then computes the length of the provided input and writes it to CMDOUT, as a `number`. Which means we can do that:

```hydre
echo ${ $(read ./somefile.txt | length) * 2 } # Prints: 24
```

The input may be typed and only accept specific types of values. For instance `length` only accepts strings, so if we try to give it something else:

```hydre
echo $(pass 2 | length) # ERROR
```

What happens here is that we use the builtin `pass` command which writes to CMDOUT the exact same value we gave it as an input. Then we give it to `length`, which fails because it doesn't accept `number`s.

There's also a shorthand syntax for providing a file's content as CMDIN to a command:

```hydre
echo $(length < ./somefile.txt) # Prints: 24
```

For commands that only accept `string` inputs, the file is automatically decoded and converted to a string. Else, it's kept as a `stream`.

## Commands typing

For script files to be called as commands, they must define a `main` function and declare a _command description_.

Here is an example of command description:

```hydre
cmd
  author "Me <my@email>" # Optional
  license "MIT" # Optional
  help "A program that repeats the name of a list of person"
  return void
  args
    # Declare a positional argument named 'names' with a help text
    pos "names"
      type list[string]
      help "List of names to display"
      optional

      # If this argument is omitted, the command will expect the list of names to be provided through CMDIN
      if absent
        cmdin list[string]
      end

    # Declare a dash argument named 'repeat'
    dash "repeat"
      type int
      short "r"
      long "repeat"
      optional

    # Get the time this command took to complete
    presential "duration"
      short "d"
      long "duration"

      # Conditional return type
      # 'present()' also accepts an optional argument name to check if another argument is present
      if present
        return int
      end
end
```

### Arguments type

Arguments type can be any existing type, or:

- `anystr`: accepts any type of argument except `stream`, which will be converted to a `string` when the command is called (which means the argument will be a `string` from the command's point of view)

### Enumerations

The `enum` type for arguments indicate the argument only accepts a subset of values (whose type is inferred), which must be specified as a constant. This means the caller cannot use a variable as this argument's value, because the return type may depend on it.

### Return type

The command's return type can be any existing type.

The options for each argument are:

- `type`: Required, the type of the argument (optional types are forbidden)
- `help`: A help message indicating what the argument does
- `short`: Short name for a dash argument
- `long`: Long name for a dash argument
- `optional`: Indicate the optional can be omitted (the type will be converted to an optional one)
- `default`: Make the value optional, but with a default value (so the type will not be optional)
- `requires`: Indicate one or several other arguments are required to use this dash one
- `conflicts`: Indicate this dash argument cannot be used when one or several other specific arguments are already in use
- `enum`: Allow only a subset of values

For dash arguments, at least `short` or `long` must be provided. Also, `optional` and `default` cannot be provided at the same time.
For presential arguments, at least `short` or `long` must be provided. Also, `type`, `optional`, `default` and `enum` are not accepted.

### Conditionals

Conditions can also use the `elif` and `else` keywords, and use the `present()` and `absent()` operators as well as usual relational operators like `==` or `<` for constant values like enums.

### Example

Here is an example that uses all these options:

```hydre
cmd
  args
    # ...
    dash "repeat"
      type int
      help "How many times to repeat the names"
      short "r"
      long "repeat"
      default 1
      requires "arg1"
      conflicts "arg2" "arg3"
      enum 1, 2, 3, 4
    end
  end
  # ...
end
```

The `main` function takes arguments with the same name as described in the `cmd` block, and in the same order:

```hydre
fn main(names: list[string], repeat: int?)
  for i in 0..=repeat.default(1)
    echo ${names.join(", ")}
  end
end
```

The script can then be called like any command, with the default `$(...)` operator returning the script's return value:

```hydre
./myscript.ns ["Jack", "John"] -r 1
# or
var result = $(./myscript.ns ["Jack", "John"] -r 1)
```

Also, know that scripts can `fail` too. This allows errors to be handled when the script is run as a function:

```hydre
# main(names: list[string], repeat: int?) -> fallible

catch $(myscript ["Jack", "John"])
  ok  _ -> echo "Everything went fine :)"
  err _ -> echo "Something went wrong :("
end
```

## Native library

The native library is a list of functions that are provided by the shell.

All types have _extensions_, which are functions that can be called using the `.` symbol, like `my_list.extension()`.

### Utilities

#### `prompt(message: string) -> string`

Ask the user a string.

#### `prompt_int(message: string) -> fallible int`

Ask the user an integer number.
Fails if the provided input is not a number.
Fails if the shell is not interactive.

#### `prompt_float(message: string) -> fallible float`

Ask the user a floating-point number.
Fails if the provided input is not a floating-point number.
Fails if the shell is not interactive.

#### `confirm(message: string) -> fallible bool`

Ask the user to confirm a message using an `[Y/n]` prompt.
Fails if the shell is not interactive.

#### `choose(options: list[string]) -> fallible int`

Ask the user to pick a value from a list and get the index of the chosen value.
Fails if the shell is not interactive.

#### `retry_cmd(cmd: command, retries: int) -> fallible`

Run a command and retry it a given number of times if it fails.
Fails if the command still fails after all allowed tries.

#### `exit()`

Make the program exit.

#### `last_failed() -> bool`

Check if the previous command failed.  
Returns `0` if no command was ran since the beginning of the script.

#### `rand() -> float`

Generate a random floating-point number between 0 and 1.

#### `rand_int(low: int, up: int) -> fallible int`

Generate a random integer between `low` and `up`.
Fails if `low` is not strictly less than `up`.

#### `rand_float(low: float, up: float) -> fallible float`

Generate a floating-point number between `low` and `up`.
Fails if `low` is not strictly less than `up`.

### All types

#### `any.str() -> string`

Turns the provided value into a string, depending on the value's type:

```hydre
_ = (true).str()    # true
_ = (3).str(3)      # 3
_ = (3.14).str()    # 3.14
_ = ('B').str()     # B
_ = ("Yoh").str()   # Yoh
_ = @{ command --arg1 -c 2 -d=4 }.str() # command --arg1 -c 2 -d 4

_ = ["a","b"].str() # [ "a", "b" ]
_ = @{ streamify "Hello world!" }.str() # "<stream>"
```

### Optional types

#### `T?.isNull() -> T`

Check if the value is `null`.

```hydre
var a: int? = 1
var b: int? = null

echo ${a.isNull()} # false
echo ${b.isNull()} # true
```

#### `T?.default(fallback: T) -> T`

Use a fallback value in case of `null`:

```hydre
var a: int? = 1
var b: int? = null

echo ${a.default(3)} # 1
echo ${b.default(3)}
```

#### `T?.unwrap() -> T`

Make the program exit with an error message if the value is null.

```hydre
var a = ?(0) # int?
var b = a.unwrap() # int
```

#### `T?.expect(message: string) -> T`

Make the program exit with a custom error message if 'a' is null

```hydre
var a = ?(0) # INt?
var b = a.expect("'a' should not be null :(") # int
```

### Numbers

#### `num.to_radix_str(base: num, leading = false) -> fallible string`

Represent the provided number in a given base.
Fails if the base is not between 2 and 36.

```hydre
_ = (11).to_radix_str(16, false) # "A"
_ = (11).to_radix_str(16, true)  # "0xA"
```

### Characters

#### `char.single() -> bool`

Indicate if a character is made of a single codepoint.

#### `char.codepoints() -> list[int]`

Get the codepoints composing a character.

#### `char.len() -> int`

Get the number of codepoints composing a character.

#### `char.bytes() -> int`

Get the size of a character, in bytes.

### Strings

#### `string.chars() -> list[char]`

Get the characters composing a string.

#### `string.codepoints() -> list[int]`

Get the codepoints composing a string.

#### `string.len() -> int`

Get the number of codepoints composing a string.

#### `string.bytes() -> int`

Get the size of a string, in bytes.

#### `string.parse_int(base = 10) -> fallible int`

Tries to parse the provided string as a number in the provided base.
Leading zeroes are accepted.
`0` symbol followed by `b`, `o`, `d` or `x` is accepted for bases 2, 8, 10 and 16 respectively.
Fails if the string does not represent a number in this base.

```hydre
_ = ("2").parse_int()   # 2
_ = ("A").parse_int()   # <FAIL>
_ = ("A").parse_int(16) # 11
```

#### `string.parse_float(base = 10) -> fallible float`

Identical to `string.parse_int(base)` but with floats.

#### `string.upper_case() -> string`

Convert a string to uppercase.

```hydre
_ = ("aBc").upper_case() # "ABC"
```

#### `string.lower_case() -> string`

Convert a string to lowercase.

```hydre
_ = ("aBc").lower_case() # "abc"
```

#### `string.reverse() -> string`

Reverse a string.

```hydre
_ = ("abc").reverse() # "cba"
```

#### `string.concat(right: string) -> string`

Concatenate two strings (equivalent to `"${left}${right}"`).

```hydre
_ = ("a").concat("b") # "ab"
```

#### `string.split(str: string, sep: string) -> string`

Split a string into a list.

```hydre
split("ab", "")  # [ "a", "b" ]
split("a b", " ") # [ "a", "b" ]
```

### Lists

#### `list[char].stringify() -> str`

Turns a list of characters to a string.

```hydre
_ = ([ 'a', 'b', 'c' ].str() == "abc") # true
```

#### `list[T].get(index: int) -> T?`

Try to get an item from the list, without panicking if the index is out-of-bounds.

```hydre
var names = [ "Jack", "John" ]

names.get(0) # "Jack"
names.get(1) # "John"
names.get(2) # null
```

#### `list[T].expect(index: number, message: string) -> T`

Get an item from the list, and panic with a custom error message if the index is out-of-bounds.

```hydre
var names = [ "Jack", "John" ]

names.get(2, "Third item was not found")
```

#### `list[T].sort(asc = true) -> list[T]`

Sorts a list.

```hydre
_ = [ 2, 8, 4 ].sort()      # [ 2, 4, 8 ]
_ = [ 2, 8, 4 ].sort(false) # [ 8, 4, 2 ]
```

#### `list[T].reverse() -> list[T]`

Reverse a list.

```hydre
_ = [ 2, 8, 4 ].reverse() # [ 4, 8, 2 ]
```

#### `list[T].len() -> int`

Count the number of entries in a list.

```hydre
_ = [ 2, 8, 4 ].len() # 3
```

#### `list[string].join(sep = ",") -> string`

Join a list of strings with a separator.

```hydre
join([ "a", "b" ])       # "a,b"
join([ "a", "b" ], "; ") # "a; b"
```

#### `list[T].concat(another: list[T]) -> list[T]`

Concatenate two lists.

```hydre
_ = [ 1, 2 ].concat([ 3, 4 ]) # [ 1, 2, 3, 4 ]
```

#### `list[T].concat(lists: list[list[T]]) -> list[T]`

Concatenate multiple lists.

```hydre
_ = [ 1, 2 ].concat([ [ 3, 4 ], [ 5, 6 ] ]) # [ 1, 2, 3, 4, 5, 6 ]
```

### Commands

#### `command.run() -> int`

Run the command and gets its status code after exit.

#### `command.fallible()`

Run the command and fail if the status code after exit is not 0.

#### `command.ret_str() -> string`

Run the command and get its stringified return value.

#### `command.cmdraw() -> stream`

Run the command and get its CMDRAW output.

#### `command.cmdmsg() -> list[string]`

Run the command and get its CMDMSG output.

#### `command.cmderr() -> list[string]`

Run the command and get its CMDERR output.

#### `command.output() -> list[string]`

Run the command and get its CMDOUT and CMDERR outputs combined.

## Examples

### Guess The Number

```hydre
while true
  var won = false
  var secret = rand_int(0, 100)

  echo "Secret number between 0 and 100 has been chosen."

  while !won
    var user_input = retry prompt_int("Please input your guess: ")

    if user_input < secret
      echo "It's higher!"
    elif user_input > secret
      echo "It's lower!"
    else
      echo "You guessed the number \\o/!"
      won = true
    end
  end

  tries = retry(5) confirm("Do you want to play again?")

  if !(retry(5) confirm("Do you want to play again?"))
    echo "Goodbye!"
    break
  end
end
```

### Streams

#### `stream.pending() -> bool`

Check if the stream is still pending. If the pipe is complete (which means if its pipe is closed), `false` will be returned.

#### `stream.size_hint() -> int?`

Get the stream's size hint. If no size hint was provided for this stream, `null` will be returned.
