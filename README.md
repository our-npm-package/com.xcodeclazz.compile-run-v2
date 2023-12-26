# Compile-run-v2

- This library works as a wrapper over the compilers installed in your system.
- It provides APIs to execute programs by spawning child processes.
- It has built in supports for types.
- It can work with async/await and promises.
- It removes the code files generted while executing

## Supported Languages

- Cpp
- Java
- Python
- Node (Javascript)

## Prerequisites

The following should be installed on your machine and be added to the path.

| Language | Software |
| -------- | -------- |
| Cpp      | g++      |
| Java     | jdk      |
| Python   | python   |
| Node     | nodejs   |

The library stores the source files for programs in the home directory in a folder named .compile-run-v2. Make sure you have permissions for this folder. **It also removes them after it done with execution. So no cron job from you side 😁**

## Installation

You can install it by using npm like below.

```cmd
npm install @com.xcodeclazz/compile-run-v2 --save  
```

## Usage

It have 5 modules each for a language containing namely.

```js
const {c, cpp, node, python, java} = require('compile-run-v2');
```

Each module have 3 functions :-

# 1. runSource

This enables you to directly execute a source code in a stored in a string. It takes source code as an argument with options and callback as optional arguments.

> NOTE: Please provide `package com.xcodeclazz;` at the top of `.java` file in case you want to run java programm.

```js

// Class name must be `Main` only. else it won'r work.
let src = `
package com.xcodeclazz;
import java.util.*;
public class Main {
    public static void main(String[] args) {
      System.out.println("Working");
    }
}`;

let code = java.runSource(src, {
  compilationPath: 'javac', // important
  executionPath: 'java', // important
  compileTimeout: 1000,
  stderrLimit: 1000,
  stdoutLimit: 1000,
  timeout: 1000,
  stdin: '10', // important
});

code.then(result => {
    console.log(result); // result
}).catch(err => {
    console.log(err);
});
```

# 2. runFile

This enables you to run a file and takes `{name: str, content: str, main: bool}` as an argument with options and callback as optional arguments. it basically creates the file for you. Don't have to provide file path here.

```js
let src = `
package com.xcodeclazz;
public class Working {
    public static void main(String[] args) {
      System.out.println("Working");
    }
}`;

let code = java.runFile({ name: 'Working.java', content: src, main: true }, {
  compilationPath: 'javac', // important
  executionPath: 'java', // important
  compileTimeout: 1000,
  stderrLimit: 1000,
  stdoutLimit: 1000,
  timeout: 1000,
  stdin: '', // important
});

code.then(result => {
    console.log(result); // result
}).catch(err => {
    console.log(err);
});
```

# 3. runFiles

This enables you to run a file and takes `[{name: str, content: str, main: bool}]` as an argument with options and callback as optional arguments. it basically creates the files for you. Don't have to provide files path here.

```js
let math = `def calc(x):\n\tprint(x + 2)`
let main = `import mymath\n\nmymath.calc(10)`;

let code = python.runFiles([
  { name: 'mymath.py', content: math, main: false }, 
  { name: 'main.py', content: main, main: true }
], {
  compilationPath: '',
  executionPath: 'python', // important
  compileTimeout: 1000,
  stderrLimit: 1000,
  stdoutLimit: 1000,
  timeout: 1000,
  stdin: '', // important
});

code.then(result => {
    console.log(result); // result
}).catch(err => {
    console.log(err);
});
```

```js
let math = `def calc(x):\n\tprint(x + 2)`
let main = `import mymath\n\nmymath.calc(10)`;

let code = python.runFiles([
  { name: 'mymath.py', content: math, main: false }, 
  { name: 'main.py', content: main, main: true }
], {
  compilationPath: '',
  executionPath: 'python', // important
  compileTimeout: 1000,
  stderrLimit: 1000,
  stdoutLimit: 1000,
  timeout: 1000,
  stdin: '', // important
}, (result) => {
  console.log(result); // result
});
```

## Result

Result is an object with the following keys:-

1. `stdout` \<string\> - stdout of the program execution. For empty stdout an empty string is returned.
2. `stderr` \<string\> - stderr of the program execution, compilation or if public class name is not found in provided source string(In java). For empty stderr empty string is returned.
3. `exitCode` \<number\> - exit code of the program.
4. `cpuUsage` \<number\> - CPU Time as calculated in microseconds.
5. `memoryUsage` \<number\> - Memory Consumed in Bytes.
6. `signal` \<string|null\> - Signal resulting, if any, resulting from the code execution.

*Disclaimer* :- We don't gaurantee accuracy of cpuUsage and memoryUsage.

## Options

API's offer an compulsory options object which has following keys:-

1. `stdin` \<string\> - Input/stdin you want to pass to the program.
2. `timeout` \<number\> - timeout for program execution in milliseconds. Default is 3000 milliseconds.
3. `compileTimeout` - timeout during compilation for c, cpp, java in milliseconds. Default is 3000 milliseconds. Would be ignored if passed for node or python
4. `compilationPath` - path for the compiler for c, cpp and java i.e for gcc and javac respectively. These paths defined by you if provided else defaults would be used.
5. `executionPath` - path for the command to execute the program used in java, python, nodejs i.e for java, python and node respectively. These paths defined by you if provided else defaults would be used.

## Prebuild Docker Image

Just run this and start sending you code for compilation. **That it! that's the purpose.**

Comming Some
