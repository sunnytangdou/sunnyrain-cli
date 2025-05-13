import process from 'child_process';
import chalk from 'chalk';
import ora from 'ora';

const spinner = ora({
    text: 'sunnyrain-cli is updating...',
    spinner: {
        interval: 300, // 变换时间 ms
        frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map(item => chalk.blue(item)) // 设置加载动画
    }
});

export function update() {
    spinner.start(); // 开始加载动画
    process.exec('npm i sunnyrain-cli@latest -g', (err) => { // 执行命令
        spinner.stop();
        if (!err) {
            console.log(chalk.green('sunnyrain-cli update success')); // 成功
        } else {
            console.log(chalk.red(err)); // 失败
        }
    })
}