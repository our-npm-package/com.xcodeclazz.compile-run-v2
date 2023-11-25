const { python, java, node, cpp } = require('./build');

cpp.runSource('#include <stdio.h> \n #include <iostream> \n using namespace std;\nint main() { cout<< "Hello"; return 0;}', {
    compilationPath: '',
    executionPath: 'g++',
    compileTimeout: 1000,
    stderrLimit: 1000,
    stdin: 10,
    timeout: 1000,
    stdoutLimit: 1000,
}, result => {
    console.log(result);
})

cpp.runFiles([ { name: 'app.cpp', content: '#include <stdio.h> \n #include <iostream> \n using namespace std;\nint main() { cout<< "Hello"; return 0;}', main: true} ], {
    compilationPath: '',
    executionPath: 'g++',
    compileTimeout: 1000,
    stderrLimit: 1000,
    stdin: 10,
    timeout: 1000,
    stdoutLimit: 1000,
}, result => {
    console.log(result);
})

cpp.runFile({ name: 'app.cpp', content: '#include <stdio.h> \n #include <iostream> \n using namespace std;\nint main() { cout<< "Working"; return 0;}', main: true}, {
    compilationPath: '',
    executionPath: 'g++',
    compileTimeout: 1000,
    stderrLimit: 1000,
    stdin: 10,
    timeout: 1000,
    stdoutLimit: 1000,
}, result => {
    console.log(result);
})

node.runSource('console.log(10*10);', {
    compilationPath: '',
    executionPath: 'node',
    compileTimeout: 1000,
    stderrLimit: 1000,
    stdin: 10,
    timeout: 1000,
    stdoutLimit: 1000,
}, result => {
    console.log(result);
})

java.runSource("package com.xcodeclazz;\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(\"Hello Gaurav\");\n\t}\n}", {
    compilationPath: 'javac',
    executionPath: 'java',
    compileTimeout: 1000,
    stderrLimit: 1000,
    stdin: 10,
    stdoutLimit: 1000,
    timeout: 1000
}, result => {
    console.log(result.executionResult)
})

java.runFile({ name: 'Main.java', content: "package com.xcodeclazz;\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(\"Hello Saurav\");\n\t}\n}", main: true }, {
    compilationPath: 'javac',
    executionPath: 'java',
    compileTimeout: 1000,
    stderrLimit: 1000,
    stdin: 10,
    stdoutLimit: 1000,
    timeout: 1000
}, result => {
    console.log(result)
})

java.runFiles([{ 
    name: 'Main.java', 
    content: "package com.xcodeclazz;\nimport java.util.*;\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\t new Working().main(); \n\t}\n}", 
    main: true 
}, {
    name: 'Working.java',
    content: "package com.xcodeclazz;\nimport java.util.*;\npublic class Working {\n\tpublic static void main() {\n\t\tSystem.out.println(\"Anjali Gupta\");\n\t}\n}", 
    main: false 
}], {
    compilationPath: 'javac',
    executionPath: 'java',
    compileTimeout: 1000,
    stderrLimit: 1000,
    stdin: 10,
    stdoutLimit: 1000,
    timeout: 1000
}, result => {
    console.log(result)
})

python.runFiles([
    {
        content: 'def hello():\n\tprint("Hi There, Gaurav")\n',
        name: "main.py",
        main: false
    },
    {
        content: 'import main\n\nmain.hello()',
        name: 'app.py',
        main: true,
    }
], {
    compilationPath: '',
    executionPath: 'python',
    compileTimeout: 1000,
    stderrLimit: 1000,
    stdin: 10,
    stdoutLimit: 1000,
    timeout: 1000
}, (result) => {
    console.log(result);
})

python.runFile({
    content: 'print("Hello World")',
    name: 'main.py',
    main: true,
}, {
    compilationPath: '',
    executionPath: 'python',
    compileTimeout: 1000,
    stderrLimit: 1000,
    stdin: 10,
    stdoutLimit: 1000,
    timeout: 1000
}, (result) => {
    console.log(result);
})

python.runSource('print("*" * 3)', {
    compilationPath: '',
    executionPath: 'python',
    compileTimeout: 1000,
    stderrLimit: 1000,
    stdin: 10,
    stdoutLimit: 1000,
    timeout: 1000
}, (result) => {
    console.log(result)
});