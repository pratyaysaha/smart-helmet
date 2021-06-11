var deviceValid=false;
const messageDisplay=(msg,code,color)=>{
    var message=document.querySelector('.message.device')
    message.innerHTML=msg
    message.style.color=color
}
const deviceFormatCheck =async(id) => {
    var mac=id.value
    mac=mac.toUpperCase()
    if(mac.length<=17)
    {
        mac=mac.replace(/\W|[G-Z]/ig,'')
        mac=mac.replace(/([0-9A-F]{2})/g, "$1:")
    }
    if(mac.length===0)
    {
        messageDisplay('',10,'white')
    } 
    if(mac.length===17)
    {
        await validDevice(mac)
    }
    if(mac.length>17)
    {
        mac=mac.slice(0,-1)
        await validDevice(mac)
    }
    id.value=mac
}
const validDevice= async (id)=>{
    const url=`${window.location.origin}/api/device/check/${id}`
    await fetch(url).then((resp)=>resp.json())
    .then((back)=>{
        if(!back.status)
        {
            messageDisplay(back.error,back.code,'red')
            deviceValid=false
        }
        else
        {
            deviceValid=true
            messageDisplay('Available',null,'green')
        }
    })
}
const getDevices=async ()=>{
    const userid=document.querySelector('.input.userid').value
    const url=`${window.location.origin}/api/device/getdevices/${userid}`
    await fetch(url).then(resp=>resp.json())
    .then(back=>{
        console.log(back)
        if(back.status)
        {
            document.querySelector('.device-wrapper').remove();
            document.querySelector('.devices').insertAdjacentHTML("beforeend",`<div class='device-wrapper'></div>`)
            if(back.data.length===0)
            {
                console.log('No devices registered')
                console.log( document.querySelector('.device-wrapper'))
                document.querySelector('.device-wrapper').insertAdjacentHTML("beforeend",`<div class="no-device">No devices registered</div>`)
            }
            else
            {
                back.data.map((item,index)=>{
                    document.querySelector('.device-wrapper').insertAdjacentHTML("beforeend",
                    `<div class="each-device d${index+1}">
                        <div class="device-id">
                            <div class="device-content d${index+1}">${item.macId}</div>
                            <div class="deregister-button" onclick="deregister(${index+1})"><i class="fas fa-trash-alt"></i></div>
                        </div>
                    </div>`)
                })
            }
        }
    })
}
const addDevice=async()=>{
    if(!deviceValid){return}
    const devid=document.querySelector('.input.deviceid').value
    const userid=document.querySelector('.input.userid').value
    const url=`${window.location.origin}/api/device/register/${devid}`
    const data={registeredTo: userid}
    await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    }).then((Response) => Response.json())
    .then(back=>{
        console.log(back)
        if(back.status)
        {
            getDevices()
            document.querySelector('.input.deviceid').value=''
            messageDisplay('',null,white)
            deviceValid=false
        }
        else
        {
            alert(back.error)
        }
    })
}
window.onload=getDevices()
const deregister=async (index)=>{
    const devid=document.querySelector(`.device-content.d${index}`).innerHTML
    if(confirm(`Do you want to deregister your device (${devid})`))
    {
        const url=`${window.location.origin}/api/device/deregister/${devid}`
        await fetch(url).then(res=>res.json())
        .then(back=>{
            if(back.status)
            {
                getDevices();
            }
            else
            {
                alert(back.error)
            }
        })
    }
    else
    {
        console.log('unsexy')
        return
    }
}