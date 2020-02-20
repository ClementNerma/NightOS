# Shell scripting

The scripting language of [Hydre](../technical/shell.md) offers a lot of powerful easy-to-use features. This allows to create complex script that are still very readable and maintanable.

## Running a command

Hydre uses an intuitive syntax. Commands are written like they would be in \*-sh shells: the command name is followed by arguments, each separated by a space.

Arugments can either be positional (they are written directly), shorts (prefixed by a `-` symbol and one-character long), or longs (prefixed by two `-` symbols). Here is an example:

```coffee
cmdname pos1 pos2 -a --arg1
```

This line runs the command called `cmdname`, provides two positional arguments `pos1` and `pos2`, a short one `a` and a long one `arg1`.
Short and long arguments are called _dash arguments_.

### Combining short arguments

It's possible to combine multiple short arguments in once by writing them one after the other:

```coffee
cmdname -abc
```

This line is strictly equivalent to:

```coffee
cmdname -a -b -c
```

### Argument values

Short and long arguments can also require a value. This value must be provided using an `=` symbol or by simply using a space:

```coffee
cmdname -s=1 --long=2
# or:
cmdname -s 1 --long 2
```

This is why positional arguments must all be written before dash arguments.

## Comments

Comments can be written on a single line with the `#` symbol:

```coffee
cmdname # single-line comment
```

Everything after the `#` symbol is ignored. For multiple-line comments, it's required to use three `#` symbols:

```coffee
###
this
is a
multi-line
comment
###
```

## Value types

All arguments must match their expected _type_: if the command is expecting a number, we can't give it a list for instance.

Here is the list of all types and how they are written:

```coffee
# Booleans (bool) (`true` or `false`)
true

# Integers (int)
3

# Floating-point numbers (float)
3.14

# Strings (string)
"abc"

# Lists of a given type (list[type])
[ 3, 3.14 ]

# Paths (path) - must contain at least one `/` to indicate clearly that it's a path and not a string or something else
dir/file.ext
./file.ext

# Commands (used to run custom commands later in functions)
command pos1 -s --long
```

There are also _presential arguments_, which are dash arguments that take no value. The command will simply check if the argument was provided or not.

There also the `num` type which accepts integers and floating-point numbers, and `any` which allows values of all types.

## Variables

Variables are declared with the `let` keyword:

```coffee
let age = 19
```

Here, we declare a variable `age` with value `19`. As variables are typed, this variable will only be allowed to contain numbers from now on - no strings, no booleans, nothing else.

By default, variables are constant, meaning we can't assign any new value to them. To declare a _mutable_ variable, we must write:

```coffee
let mut age = 19
```

And to assign a new value to it:

```coffee
age = 20
```

## Expressions

To use a variable, we can directly use it like this::

```coffee
tellage age
```

So this code:

```coffee
age = 20
tellage age
```

Is equivalent to this one:

```coffee
tellage 20
```

It's also possible to perform computations using expressions:

```coffee
age = 20
add = 12
tellage ${age + add}
```

String and characters can also be inserted inside a string:

```coffee
let name = "Jack"
echo "Hello, ${name}!" # Hello, Jack!
```

Values in lists through their index (starting at 0):

```coffee
let names = [ "Jack" ]
echo "Hello, ${name[0]}!" # Hello, Jack!
```

## Output of a command

Commands can either output data to STDOUT (standard) or STDERR (errors). It's possible to get the result of a command as a value:

```coffee
$(echo "Hello!")
```

This gets the STDOUT content and can be used like this for instance:

```coffee
echo ${$(echo "Hello!")} # Prints: "Hello!"
```

As this syntax is not very readable, evaluating a single command can be made without the `${...}` expression wrapper:

```coffee
echo $(echo "Hello!") # Prints: "Hello!"
```

Note that the provided result will always be a string.

To get the result from STDERR:

```coffee
echo $!(echo "Hello!") # Prints nothing
```

To get the combined result from STDOUT and STDERR:

```coffee
echo $?(echo "Hello!") # Prints "Hello!"
```

## Computing values

It's also possible to compute values using operators. Each operator takes one or multiple operands, which can be either a variable or a literal value.

### Mathematical operators

Mathematical operators all take two operands. If any of the operands is not a number, it will fail.
If both operands are integers, the result will be an integer, but if at least one is a floating-point number, so will be the result.

The operators are:

* `+`: addition
* `-`: substraction
* `*`: multiplication
* `**`: pow
* `/`: division
* `//`: floating-point division (gives a floating-point number even if the two operands are integers)
* `%`: remainder (works only with two integers)

### Bit-wise operators

Bit-wise operators only take integer operands and produce an integer result:

* `&` bit-by-bit and
* `|` bit-by-bit or
* `^` bit-by-bit exclusive or
* `<<` binary left shift operator
* `>>` binary right shift operator
* `~` one's complement - takes a single number

### Logical operators

Logical operators take two operands and return a boolean:

|  Symbol  |           Name           |            Returns `true` if...          |
|----------|--------------------------|------------------------------------------|
|  `&&`    | and                      | `a` and `b` are `true` booleans          |
|  `\|\|`  | or                       | `a`, `b` or both are `true` booleans     |
|  `==`    | equal to                 | `a` is equal to `b`                      |
|  `!=`    | different than           | `a` is different than `b`                |
|  `>`     | greater than             |  `a` is greater than `b`                 |
|  `<`     | lower than               | `a` is lower than `b`                    |
|  `>=`    | greater than or equal to | `a` is greater than or equal to `b`      |
|  `<=`    | lower than or equal to   | `a` is lower than or equal to `b`        |

Finally, there is the `!` operator, which takes a single operand on its right, and simply reverts a boolean.

## Blocks

Blocks allow to run a piece of code multiple times or if a specific condition is met. They are useful combined to comparison operators.

### Conditionals

Conditionals uses the following syntax:

```coffee
if condition
  command1
end
```

When this block is ran, if `condition` (which is an expression that must result in a boolean) is equal to `true`, `command1` is ran. Here is an example:

```coffee
if 2 + 2 == 4
  command1
end
```

It's possible to specify multiple commands at once:

```coffee
if 2 + 2 == 4
  command1
  command2
  command3
end
```

Note that all commands must be indented by one tabulation.

It's also possible to run a set of commands in case the condition isn't met too using `else`:

```coffee
if 2 + 2 == 4
  command1
else
  command2
end
```

Finally, conditions can be chained using `elif`:

```python
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

```coffee
switch rand_int(0, 10)
  when 0
    echo "It's zero!"

  when 1
    echo "It's one!"

  else
    echo "It's something else"
end
```

## Loops

Loops allow to run a piece of code for a while. The most common loop is the range loop:

```coffee
for i in 0..10
  command ${i}
end
```

This will run `command 0` to `command 9`. To include the upper bound, we must add an `=` symbol:

```coffee
for i in 0..=10
  command ${i}
end
```

This will run `command 0` to `command 10`.

There is another type of loop, which runs a piece of code while a condition is met:

```coffee
while condition
  command
end
```

If the `condition` is `false` when the loop is reached, the `command` will not be ran once. Else, it will be ran as long as the `condition` is `true`.

Note that loops can be broke anytime using the `break` keyword:

```coffee
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

```coffee
for file in (*.txt)
  echo "Found a text file: ${file}"
end
```

The pattern between parenthesis must be a glob pattern. Recursivity is supported to:

```coffee
for file in (**/*.txt)
  echo "Found a text file: ${file}"
end
```

## Functions

Functions allow to split the code in several parts to make it more readable, as well as to re-use similar pieces of code across the script.

```coffee
fn hello
  echo "Hello!"
end
```

Now we can call `hello` this way:

```coffee
hello() # Will print "Hello !"
```

### Arguments

Function can also take arguments, which must have a type.

```coffee
fn hello (name: string)
  echo "Hello, ${name}!"
end

hello("Jack") # Will print "Hello, Jack!"
```

Arguments can be made optional by providing default values. This also allows to get rid of their explicit type as it's now implicit:

```coffee
fn hello (name = "Unknown") {
  echo "Hello, ${name}!"
}

hello()       # Will print "Hello, Unknown!"
hello("Jack") # Will print "Hello, Jack!"
```

Note that a function's arguments do not require to wrap the value between `${...}` as it's implicit. Which means we can write:

```coffee
let name = "Jack"
hello(name) # Prints: "Hello, Jack!"
```

We can also combine functions and blocks, for instance:

```coffee
fn greet (names: list[string])
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

```coffee
fn add (a: num, b: num) -> num
  return a + b
end
```

### Failing

Functions can also _fail_ to indicate something went wrong:

```coffee
fn divide (a: num, b: num) -> failable num
  if b == 0
    fail "Cannot divide by 0!"
  else
    return a / b
  end
end
```

The `failable` keyword must be present before the return type to indicate the function may fail (even if the function doesn't return anything).

When a function fails, the program stops and print the provided error message. But fails can be handled too using the `catch` keyword:

```coffee
fn handle_bad_div (a: num, b: num) -> num
  catch divide(a, b) as errmsg:
    echo "Division failed :("
    echo "Here is the error message: ${errmsg}"
  end
end
```

Note that accessing an out-of-bound index in a list results in a failing.

#### Retries

It's possible to retry a function until it succeeds using the `retry` keyword:

```coffee
fn may_fail ()
  if rand() > 0.5
    fail "I don't like high numbers"
  end
end

retry may_fail
```

This will run `may_fail`, and run it again if it fails, until it succeeds.

It's also possible to specify a maximum number of retries:

```coffee
retry(5) may_fail
```

For information, here is the declaration of the native `retry_cmd` command, which allows to try to run a command until it succeeds:

```coffee
fn retry_cmd(cmd: command, retries: int) -> failable
  retry(retries) cmd.failable()
  if status() != 0
    fail "Command did not suceed after ${retries} retries."
  end
end
```

## Aliases

As you may already know, command names can be [quite long and complicated](../concepts/applications.md#commands). In order to prevent from having to repeat very long names that are not really readable, it's recommanded to use _aliases_ which are declared at the beginning of script:

```coffee
:system.fs.read_file as read_file
```

The `read_file` command is then made available.

## Native library

The native library is a list of functions that are provided by the shell.

All types have _extensions_, which are functions that can be called using the `.` symbol, like `my_list.extension()`.

### Utilities

#### `prompt(message: string) -> string`

Ask the user a string.

#### `prompt_int(message: string) -> failable int`

Ask the user an integer number.
Fails if the provided input is not a number.
Fails if the shell is not interactive.

#### `prompt_float(message: string) -> failable float`

Ask the user a floating-point number.
Fails if the provided input is not a floating-point number.
Fails if the shell is not interactive.

#### `confirm(message: string) -> failable bool`

Ask the user to confirm a message using an `[Y/n]` prompt.
Fails if the shell is not interactive.

#### `choose(options: list[string]) -> failable int`

Ask the user to pick a value from a list and get the index of the chosen value.
Fails if the shell is not interactive.

#### `retry_cmd(cmd: command, retries: int) -> failable`

Run a command and retry it a given number of times if it fails.
Fails if the command still fails after all allowed tries.

#### `exit(code = 0)`

Make the program exit. Any code other than `0` means the program failed.

#### `status() -> num`

Get the exit code of the previous command.
Returns `0` if no command was ran since the beginning of the script.

#### `rand() -> float`

Generate a random floating-point number between 0 and 1.

#### `rand_int(low: int, up: int) -> failable int`

Generate a random integer between `low` and `up`.
Fails if `low` is not strictly less than `up`.

#### `rand_float(low: float, up: float) -> failable float`

Generate a floating-point number between `low` and `up`.
Fails if `low` is not strictly less than `up`.

### All types

#### `any.str() -> string`

Turns the provided value into a string, depending on the value's type:

```coffee
(true).str() # true
(3).str(3)   # 3
(3.14).str() # 3.14
"Yoh".str()  # Yoh

["a","b"].str()   # [ "a", "b" ]
```

### Numbers

#### `num.to_radix_str(base: num, leading = false) -> failable string`

Represent the provided number in a given base.
Fails if the base is not between 2 and 36.

```coffee
(11).to_radix_str(16, false) # "A"
(11).to_radix_str(16, true)  # "0xA"
```

### Strings

#### `string.parse_int(base = 10) -> failable int`

Tries to parse the provided string as a number in the provided base.
Leading zeroes are accepted.
`0` symbol followed by `b`, `o`, `d` or `x` is accepted for bases 2, 8, 10 and 16 respectively.
Fails if the string does not represent a number in this base.

```coffee
"2".parse_int()   # 2
"A".parse_int()   # <FAIL>
"A".parse_int(16) # 11
```

#### `string.parse_float(base = 10) -> failable float`

Identical to `string.parse_int(base)` but with floats.

#### `string.upper_case() -> string`

Convert a string to uppercase.

```coffee
"aBc".upper_case() # "ABC"
```

#### `string.lower_case() -> string`

Convert a string to lowercase.

```coffee
"aBc".lower_case() # "abc"
```

#### `string.reverse() -> string`

Reverse a string.

```coffee
"abc".reverse() # "cba"
```

#### `string.count() -> string`

Count the number of characters in a string.

```coffee
"abc".count() # 3
```

#### `string.concat(right: string) -> string`

Concatenate two strings (equivalent to `"${left}${right}"`).

```coffee
"a".concat("b") # "ab"
```

#### `string.split(str: string, sep: string) -> string`

muSplit a string into a list.

```coffee
split("ab", "")  # [ "a", "b" ]
split("a b", " ") # [ "a", "b" ]
```

### Lists

#### `list[T].sort(asc = true) -> list[T]`

Sorts a list.

```coffee
[ 2, 8, 4 ].sort()      # [ 2, 4, 8 ]
[ 2, 8, 4 ].sort(false) # [ 8, 4, 2 ]
```

#### `list[T].reverse() -> list[T]`

Reverse a list.

```coffee
[ 2, 8, 4 ].reverse() # [ 4, 8, 2 ]
```

#### `list[T].len() -> int`

Count the number of entries in a list.

```coffee
[ 2, 8, 4 ].len() # 3
```


#### `list[string].join(sep = ",") -> string`

Join a list of strings with a separator.

```coffee
join([ "a", "b" ])       # "a,b"
join([ "a", "b" ], "; ") # "a; b"
```

#### `list[T].concat(another: list[T]) -> list[T]`

Concatenate two lists.

```coffee
[ 1, 2 ].concat([ 3, 4 ]) # [ 1, 2, 3, 4 ]
```

#### `list[T].concat(lists: list[list[T]]) -> list[T]`

Concatenate multiple lists.

```coffee
[ 1, 2 ].concat([ [ 3, 4 ], [ 5, 6 ] ]) # [ 1, 2, 3, 4, 5, 6 ]
```

### Commands

#### `command.run() -> int`

Run the command and gets its status code after exit.

#### `command.failable()`

Run the command and fail if the status code after exit is not 0.

#### `command.stdout() -> string`

Run the command and get its STDOUT output.

#### `command.stderr() -> string`

Run the command and get its STDERR output.

#### `command.output() -> string`

Run the command and get its STDOUT and STDERR outputs combined.

## Examples

### Guess The Number

```coffee
while true
  let mut won = false
  let secret = rand_int(0, 100)

  echo "Secret number between 0 and 100 has been chosen."

  while !won
    let user_input = retry prompt_int("Please input your guess: ")

    if user_input < secret
      echo "It's higher!"
    elif user_input > secret
      echo "It's lower!"
    else
      echo "You guessed the number \\o/!"
      won = true
    end
  end

  if !(retry confirm("Do you want to play again?"))
    echo "Goodbye!"
    break
  end
end
```