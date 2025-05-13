import logSymbols from 'log-symbols';

export const log = { // 打印日志
    success: (msg: string) => console.log(`${logSymbols.success} ${msg}`), // 成功
    error: (msg: string) => console.log(`${logSymbols.error} ${msg}`), // 失败
    info: (msg: string) => console.log(`${logSymbols.info} ${msg}`), // 信息
    warn: (msg: string) => console.log(`${logSymbols.warning} ${msg}`), // 警告
}