import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';
import createLogger from "progress-estimator";
import chalk from "chalk";
import { log } from './log'

const logger = createLogger({ // 初始化进度条
    spinner: {
        interval: 300, // 变换时间 ms
        frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map(item => chalk.blue(item)) // 设置加载动画
    }
})

const gitOptions: Partial<SimpleGitOptions> = {
    baseDir: process.cwd(), // 根目录
    binary: 'git',
    maxConcurrentProcesses: 6, // 最大并发进程数
};

export const clone = async (url: string, prjName: string, options: string[]): Promise<any> => {
    const git: SimpleGit = simpleGit(gitOptions)
    try {
        // 开始下载代码并展示预估时间进度条
        await logger(git.clone(url, prjName, options), '代码下载中: ', {
            estimate: 8000 // 展示预估时间
        })

        // 下面就是一些相关的提示
        log.success(chalk.green('code download success!'))
        log.success(chalk.blueBright(`==================================`))
        log.success(chalk.blueBright(`=== Welcome use sunnyrain-cli ===`))
        log.success(chalk.blueBright(`==================================`))
        console.log()

        console.log(`create project success ${chalk.blueBright(prjName)}`)
        console.log(chalk.blueBright(`run the following command：`))
        console.log(`cd ${chalk.blueBright(prjName)}`)
        console.log(`${chalk.yellow('pnpm')} install`)
        console.log(`${chalk.yellow('pnpm')} run dev`)
    } catch (err: any) {
        console.log(chalk.red('code download failed'))
        console.log(chalk.red(String(err)))
    }
}
export default clone;