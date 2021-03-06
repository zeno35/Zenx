console.log('Starting...')
let { spawn } = require('child_process')
let path = require('path')
let fs = require('fs')
let package = require('./package.json')
const CFonts = require('cfonts')
CFonts.say(`${package.name}`, {
    font: 'slick',
    align: 'center',
    colors: ['candy'],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: '0',
    gradient: true,
    independentGradient: true,
    transitionGradient: true,
});

CFonts.say(`Project Whatsapp Bot `, {
    font: 'chrome',
    align: 'center',
    colors: ['candy'],
});

var isRunning = false;
/**
 * Start a js file
 * @param {String} file `path/to/file`
 */
function start(file) {
    if (isRunning) return;
    isRunning = true;
    let args = [path.join(__dirname, file), ...process.argv.slice(2)];
    let p = spawn(process.argv[0], args, {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc']
    });
    p.on('message', data => {
        console.log('[RECEIVED]', data);
        switch (data) {
            case 'reset':
                p.kill();
                isRunning = false;
                start.apply(this, arguments);
                break
            case 'uptime':
                p.send(process.uptime());
                break
        }
    });
    p.on('exit', code => {
        isRunning = false;
        console.error('Exited with code:', code);
        //if (code === 0) return;
        //fs.watchFile(args[0], () => {
        //  fs.unwatchFile(args[0]);
        start(file);
        // });
    });

}

start('main.js');