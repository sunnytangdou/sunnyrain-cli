
import path from 'path';
import fs from 'fs-extra';
import axios, { AxiosResponse } from 'axios';
import { gt } from 'lodash';
import { select, input } from '@inquirer/prompts';
import chalk from "chalk";
import { clone } from '../utils/clone';
import { name, version } from '../../package.json';

export interface TemplateInfo {
    name: string; // 项目名称
    downloadUrl: string; // 下载地址
    description: string; // 项目描述
    branch: string; // 项目分支
}
// 这里保存了我写好的预设模板 
export const templates: Map<string, TemplateInfo> = new Map(
    [
        ["Vite-React18-Typescript-template", {
            name: "admin-template",
            downloadUrl: 'https://gitee.com/sohucw/react-admin-all.git',
            description: 'React technology stack development template',
            branch: 'main'
        }],
        ["Vite-Vue3-Typescript-template", {
            name: "admin-template",
            downloadUrl: 'https://gitee.com/sohucw/vue-admin-all.git',
            description: 'Vue3 technology stack development template',
            branch: 'master'
        }]
    ]
)

export function isOverwrite(fileName: string) {
    console.warn(`${fileName}This directory is not empty `)
    return select({
        message: 'Do you want to overwrite it?',
        choices: [
            { name: 'Yes', value: true },
            { name: 'No', value: false }
        ]
    })
}

export const getNpmInfo = async (npmName: string) => {
    // 这里可以调用接口获取最新版本号
    const npmUrl = `https://registry.npmjs.org/${npmName}`;
    let res = {}
    try {
        res = await axios.get(npmUrl);
    } catch (error) {
        console.log(error)
    }
    return res;
}

export const getLatestVersion = async (name: string) => {
    const data = (await getNpmInfo(name)) as AxiosResponse;
    // console.info('npm info', data.data);
    return data.data['dist-tags'].latest;
}

export const checkVersion = async (name: string, version: string) => {
    const latestVersion = await getLatestVersion(name);
    const need = gt(latestVersion, version);
    if (need) {
        console.warn(`please update ${chalk.blackBright(name)} to ${chalk.blackBright(latestVersion)} version`)
        console.log(`run ${chalk.yellow('npm update')} ${chalk.blackBright(name)} to update`)
    } else {
        console.log(`you are using the latest version of ${name}`)
    }
}

// 检查版本更新
checkVersion(name, version);

export async function create(projectName?: string) {
    // 我们需要将我们的 map 处理成 @inquirer/prompts select 需要的形式
    // 也可以封装成一个方法去处理
    const templateList = [...templates.entries()].map((item: [string, TemplateInfo]) => {
        const [name, info] = item;
        return {
            name,
            value: name,
            description: info.description
        }
    });
    if (!projectName) {
        projectName = await input({ message: 'please input project name' })
    }

    // 检查目录是否存在
    const cwd = process.cwd(); // 当前工作目录
    const targetDir = path.resolve(cwd, projectName); // 目标目录
    if (fs.existsSync(targetDir)) { // 目录存在
        const isOverwriteFile = await isOverwrite(projectName) // 是否覆盖
        if (!isOverwriteFile) { // 不覆盖直接返回
            return;
        } else { // 覆盖删除目录
            await fs.remove(targetDir)
        }
    }

    // 选择模板
    const templateName = await select({
        message: 'please select template:',
        choices: templateList,
    });

    // 下载模板
    const gitRepoInfo = templates.get(templateName)
    if (gitRepoInfo) {
        await clone(gitRepoInfo.downloadUrl, projectName, ['-b', `${gitRepoInfo.branch}`])
    } else {
        console.log(`${templateName} 模板不存在`)
    }
}