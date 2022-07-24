module.exports={
    apps:[{
        name:'mediaProcess',
        script:'./mediaProcesslocalCl.js',
        instances:6,
        exec_mode:'cluster',
        max_memory_restart:'3200M',

        //무중단관련 서비스로직추가 20220302(프로세스간 종료&재시작delay과정중 관련 요청 delay관련)
        wait_ready:true,
        //listen_timeout:10000,
        kill_timeout:70000
    }]
}