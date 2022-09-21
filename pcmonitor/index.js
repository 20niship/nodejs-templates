const v8 = require('v8');
const si = require('systeminformation');

const compute = async () => {
  // 温度情報
  // CPU : 使用率（全体）, 使用率（Node.jsのアプリケーション , 周波数
  // メモリ：使用率（全体）、使用率（Node.jsのアプリ）
  // Disk容量（全体、このディレクトリ内）
  // Heap：トータル、使用率、割り当てられた量
  // Requests per second

  const stat = {
    cpu : {
      speed : (await si.cpuCurrentspeed()).cores,
      temp  : (await si.cpuTemperature()).cores,
      load  : await si.currentLoad(),
    },
    memory : await si.mem(),
    ctime  : Date.now(),
    disk   : await si.fsSize(),
    heap   : v8.getHeapStatistics(),
  }

  console.log(JSON.stringify(stat,null,'  '))
  process.exit(0)
}



