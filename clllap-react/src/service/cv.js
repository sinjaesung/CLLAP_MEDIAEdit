class CV{
    _dispatch(event) {
        console.log('dispatch홏풀');
        const { msg } = event;
        console.log('msg:',msg);
        this._status[msg] = ['loading']
        this.worker.postMessage(event);
        return new Promise((res, rej) => {
          let interval = setInterval(() => {
            const status = this._status[msg]
            if (status[0] === 'done') res(status[1])
            if (status[0] === 'error') rej(status[1])
            if (status[0] !== 'loading') {
              delete this._status[msg]
              clearInterval(interval)
            }
          }, 50)
        })
      }

    load() {
        console.log('===>load함수호출!!');
        this._status = {}
        this.worker = new Worker('../../public/cv.worker.js') // load worker
        
        console.log('worekresss:',this.worker);
        // Capture events and save [status, event] inside the _status object
        this.worker.onmessage = (e) => {
            console.log('onmesagesss hwhhatss:',e.data);
            //this._status[e.data.msg] = ['done', e]
        } 
        this.worker.onerror = (e) => {
            console.log('onerrorrss hwhhatss:',e.data);
            //this._status[e.data.msg] = ['error', e];    
        }
        //return this._dispatch({ msg: 'load' })
    }
}

export default new CV();