---
title: Notes from Typescript type-challenges
description: Notes from going through type-challenges
tags: ['typescript']
timestamp: 1625412185823
---

# Notes from Typescript type-challenges

Based on type-challenges [here](https://github.com/type-challenges/type-challenges)

## Implement Pick

```ts
// Create your own Pick implementation

// Goal
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>;

const todo: TodoPreview = {
  title: 'Clean room',
  completed: false,
};

// Answer

type MyPick<T, K extends keyof T> = { [Prop in K]: T[Prop] };
```

Notes:

- `K extends keyof T` ensures that `K` passed in coincides with object keys in `T`
- `Prop in K`:
  - `in` keyword iterates through the _union types_ in `K`. Important to note that the `in` keyword is only able to iterate though _union types_
  - `Prop` is simply a placeholder variable representing each element in the _union types_ `K`. `Prop` can be replaced with any names.
- `T[Prop]` simply returns the type of the corresponding value in Object `T`, e.g. the type of `Todo.title`.

## Tuple to Object

```ts
// Convert a tuple type to an object type

// Goal
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const;

const result: TupleToObject<typeof tuple> = {
  tesla: 'tesla',
  'model 3': 'model 3',
  'model X': 'model X',
  'model Y': 'model Y',
};

// Answer
type TupleToObject<T extends readonly string[]> = { [Prop in T[number]]: Prop };
```

Notes:

```ts
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const;

typeof tuple;
// Equals the exact array ['tesla', 'model 3', 'model X', 'model Y']

type TeslaModel = typeof tuple[number];
// Equals the possible values, i.e. the union types 'tesla' | 'model 3' | 'model X' | 'model Y'
```

- `T extends readonly string[]` because `typeof tuple` equals an array with exacting elements.
- `Prop in T[number]` works because `T[number]` produces union types, allowing `in` to iterate through it.

## Implement Exclude

```ts
// Create your own Exclude implementation

// Goal
type A = 'a' | 'b' | 'c';
type B = 'a';

type MyExclude<A, B> = 'b' | 'c';

// Answer
type MyExclude<T, U> = T extends U ? never : T;
```

<PostDate />
<PageTags />
