# Translations

Translations are a complex topic and can be handled in several ways.

Applications' and libraries' content can either be translated using a custom way (e.g. a translation framework), or by using the system's [builtin translation service, `sys::i18n`](services/system/i18n.md).

## Translation sets

Translation sets are a way to specify how to translate a set of content.

They use an extremely compact and efficient format to minimize disk usage and maximize performances. Some trade-offs are made to accelerate performance at the expansve of file size.

They are not made to be modified directly, and should instead be derived from other text formats if the translation sets need to be manually edited by a person.

### Header

The header is made of the following informations:

- Number of translatable languages (2 bytes)
- For each language:
  - Language's code in ASCII (3 bytes, using the [ISO 639-2](https://en.wikipedia.org/wiki/ISO_639-2) format)
  - Location of the language's [translation table](#translation-tables) in the file (8 bytes)
- Code of the reference language(3 bytes)
- Number of translation models (8 bytes)
- For each translation model:
  - The [translation model](#translation-models) itself

The reference language is the one the translations are made from. For instance, a translation set may be procuced by translating english models to french. But when the set is bundled, both english and french will actually be written in their own [translation tables](#translation-tables), meaning we can't easily reverse the process. The reference language is here to ensure that we can automatically determine which language was used to create the translations. It can be also be used in debug messages in case something goes wrong.

### Translation models

A _translation model_ is a translatable string. They can use variables which are provided at runtime.

It only consists in a [variable set declaration](#variable-set-declaration).

Translation models contain no text as that is the role of the [translation strings](#translation-strings), which means that decoding a translation set will not allow to directly see what the source text is, as there is in fact no text in the models.

Most translation tools provide a way to start from a source language (like english) and then translate to other languages, but when the file is actually bundled, the source language is just written as any other inside its own translation table.

#### Variable set declaration

A variable set declaration of made of the following:

- Number of variables in the set (2 bytes)
- For each variable:
  - Unique identifier of the variable (4 bytes)
  - Variable type (1 byte):
    - `0x00`: [delimited string](kernel/data-structures.md#delimited-strings) (`string`)
    - `0x01`: boolean (`bool`)
    - `0x02`: 64-bit signed integer (`int`)
    - `0x03`: 64-bit unsigned integer (`uint`)
    - `0x04`: 64-bit floating-pointer number (`float`)

### Translation tables

A _translation table_ represents the translation of each defined [model](#translation-models) for a provided language.

It consists in the following:

- For each model defined in the [header](#header):
  - Relative address of the [translation string](#translation-strings) in this table
- For each model defined in the [header](#header):
  - The [translation string](#translation-strings)

Translation strings must be in the same order as defined in the header.

### Translation strings

A _translation string_ is the dynamic translation, for a given language, of a [translation model](#translation-models).

They use a complex format as they permit to achieve both compacity in term of file size, high performance when decoding and actually performing the translations, as well as allowing complex translations. It is for instance possible to link together multiple conditionals to only show a text if a set of provided numbers meet a requirement.

Translation strings use the following structure:

- Length of the translation string, in bytes (4 bytes)
- [Assignable variables set](#variable-set-declaration)
- Number of direct translation segments (4 bytes)
- Relative address of the dynamic library (4 bytes)
- For each translation segment:
  - [Translation segment](#translation-segments)
- Number of optional translation segments in the dynamic library (4 bytes)
- For each optional translation segments:
  - Unique identifier for this segment (4 bytes)
  - [Translation segment](#translation-segments)

#### Translation segments
- Length of the segment in bytes (4 bytes)
- Segment type (1 byte):
  - `0x00`: fixed text
    - Followed by a [delimited string](kernel/data-structures.md#delimited-strings)
  - `0x01`: toggle
    - Followed by the identifier of a boolean variable (4 bytes)
    - Followed by the ID of the optional translation segment to use if the variable is truthy
    - Followed by the ID of the optional translation segment to use if the variable is falsy
  - `0x02`: comparison
    - Followed by the ID of the variable to compare (must be of a number type)
    - Comparator (1 byte):
      - `0x01`: equal
      - `0x02`: not equal
      - `0x03`: greater than
      - `0x04`: less than
      - `0x05`: greater than or equal to
      - `0x06`: less than or equal to
    - Comparison object (1 byte):
      - `0x01`: direct value
        - Followed by the raw number (must be of the **same** number type)
      - `0x02`: variable
        - Followed by the ID of the variable to compare it to (must be of the **same** number type)
    - Followed by the ID of the optional translation segment to use if the comparison is truthy
    - Followed by the ID of the optional translation segment to use if the comparison is falsy
  - `0x03`: property checking
    - Followed by the ID of the variable to check
    - Negation (1 byte)
      - `0x00`: perform the check normally
      - `0x01`: revert the check's result
    - Check (1 byte):
      - `0x01`: (`string`-only): string is empty
      - `0x02`: (`string`-only): string only contains ASCII characters
      - `0x20`: (`int`-only): number if positive
      - `0x21`: (`int`-only): number could be converted to a `uint` without loss
      - `0x30`: (`uint`-only): number could be converted to an `int` without loss
      - `0x31`: (`uint`-only): if the number was signed as an `int`, it would be negative
      - `0x40`: (`float`-only): number has a non-zero decimal part
      - `0x41`: (`float`-only): number could be converted to an `int` without loss
      - `0x42`: (`float-only`): number could be converted to a `uint` without loss
    - Followed by the ID of the optional translation segment to use if the variable is truthy
    - Followed by the ID of the optional translation segment to use if the variable is falsy
  - `0x04`: assignments
    - Identifier of the assignable variable (4 bytes)
    - Action type (1 byte):
      - `0x00`: Raw assign
        - Followed by the value to assign (must be of the exact same type)
        - Followed by the identifier of a variable (4 bytes)
      - `0x01`: (`bool`-only) Result of a comparison
        - Followed by a comparison's data (type, comparator, ...)
      - `0x02`: (`bool`-only) Result of a property checking
        - Followed by the check's data (negation, check, ...)
      - `0x10`: (`uint`-only): length of a string, in bytes
        - Followed by the identifier of a `string` variable
  - `0xFF`: empty (used for conditionals)