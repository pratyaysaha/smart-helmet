var socket= io(`${window.location.origin}`)
var userid=document.querySelector('.input.userid').value
socket.on('connect',()=>{
    socket.emit('join-room',userid)
    socket.on('new-alert',(data)=>{
        var logo;
        if(data.alertType==='accident')
            logo='car-crash'
        else if(data.alertType==='alcohol')
            logo='wine-bottle'
        document.querySelector('.my-alerts').insertAdjacentHTML("afterbegin",
                    `<div class="each-alert">
                        <div class="alert-logo"><div><i class="fas fa-${logo}"></i></div></div>
                        <div class="details">
                        <div class="alert-content device-detected">
                            <div class="content">${data.macId}</div>
                        </div>
                        <div class="alert-content location">
                            <div class="label"><i class="fas fa-location-arrow"></i></div>
                            <div class="content">${data.location}</div>
                        </div>
                        <div class="alert-content time">
                            <div class="label"><i class="far fa-clock"></i></div>
                            <div class="content">${dateConvert(new Date(data.time))}</div>
                        </div>
                        <div class="alert-content alert-type">
                            <div class="label"><i class="fas fa-code-branch"></i></div>
                            <div class="content">${data.alertType}</div>
                        </div>
                        </div>
                </div>`)
    })
})
const dateConvert=(date)=>{
    var dateinFormat=`${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.toLocaleTimeString('en-US')}`
    return dateinFormat
}
const getAlerts=async()=>{
    const url=`${window.location.origin}/api/alert/getalerts/${userid}`
    await fetch(url).then(resp=>resp.json())
    .then((back)=>{
        if(back.status)
        {
            if(back.data.length===0)
            {
                console.log('no alerts')
            }
            else
            {
                back.data.map((item)=>{
                    var logo;
                    if(item.alertType==='accident')
                        logo='car-crash'
                    else if(item.alertType==='alcohol')
                        logo='wine-bottle'
                    document.querySelector('.my-alerts').insertAdjacentHTML("afterbegin",
                    `<div class="each-alert">
                        <div class="alert-logo"><div><i class="fas fa-${logo}"></i></div></div>
                        <div class="details">
                        <div class="alert-content device-detected">
                            <div class="content">${item.macId}</div>
                        </div>
                        <div class="alert-content location">
                            <div class="label"><i class="fas fa-location-arrow"></i></div>
                            <div class="content">${item.location}</div>
                        </div>
                        <div class="alert-content time">
                            <div class="label"><i class="far fa-clock"></i></div>
                            <div class="content">${dateConvert(new Date(item.time))}</div>
                        </div>
                        <div class="alert-content alert-type">
                            <div class="label"><i class="fas fa-code-branch"></i></div>
                            <div class="content">${item.alertType}</div>
                        </div>
                        </div>
                </div>`)
                })
            }
        }
    })
}
window.onload=getAlerts
dateConvert(new Date())