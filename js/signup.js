var eyestatus = true
var userValid = true
var contactNumber=2
var contactNumberContainer=document.getElementsByClassName('contact-number')
window.onload=()=>{
    document.querySelector('.input.name').focus()
}
const eyechange = (me) => {
    if (eyestatus) {
        me.innerHTML = '<i class="fas fa-eye-slash"></i>'
        eyestatus = false
        document.querySelector('.input.password').type = 'text'
    }
    else {
        me.innerHTML = '<i class="fas fa-eye"></i>'
        eyestatus = true
        document.querySelector('.input.password').type = 'password'
    }
}
const checkme = async (val) => {
    const url = `${window.location.origin}/api/user/search/username/${val}`
    await fetch(url)
        .then((Response) => Response.json())
        .then((back) => {
            if (back.status && back.isValid) {
                userValid = true
                document.querySelector('.error-message').innerHTML = ''
            }
            else if (back.status && !back.isValid) {
                userValid = false
                document.querySelector('.input.username').focus()
                document.querySelector('.error-message').innerHTML = "Username already taken"
            }
            else {
                userValid = false
                console.error('Try again...Server Error')
            }
        })
}
const validEmail=(email)=>{
    var mailformat = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/
    if(email.value.match(mailformat))
    {
        email.style.color='#444'
        return true;
    }
    else
    {
        email.focus()
        email.style.color='red'
        return false;
    }
}
const validPhone=(phone)=>{
    var phoneFormat=/[0-9]{10}/
    if(phone.value.match(phoneFormat))
    {
        phone.style.color='#444'
        return true;
    }
    else
    {
        phone.focus()
        phone.style.color='red'
        return false;
    }
}
const nextPage=()=>{
    var userDetails= document.querySelector('.wrapper.w1')
    var emergencyContacts= document.querySelector('.wrapper.w2')
    userDetails.style.display='none'
    emergencyContacts.style.display='flex'
    
}
const prevPage=()=>{
    var userDetails= document.querySelector('.wrapper.w1')
    var emergencyContacts= document.querySelector('.wrapper.w2')
    userDetails.style.display='flex'
    emergencyContacts.style.display='none'
    
}
const addContact=()=>{
    document.querySelector('.econtacts-container').insertAdjacentHTML("beforeend",
                        `<div class="contact-each c${contactNumber}">
                        <div class="small-title">
                            Emergency Contact <span class='contact-number'>${contactNumber}</span>
                        </div>
                        <div class="input-field dashed">
                            <i class="fas fa-user"></i>
                            <input class='input name c${contactNumber}' placeholder="Name"/>
                        </div>
                        <div class="input-field dashed">
                            <i class="fas fa-phone"></i>
                            <input class='input phone c${contactNumber}' placeholder="Phone" onblur="validPhone(this)"/>
                        </div>
                        <div class="input-field dashed">
                            <i class="fas fa-at"></i>
                            <input class='input email c${contactNumber}' placeholder="Email"/>
                        </div>
                    </div>
                </div>`)
    document.querySelector(`.input.name.c${contactNumber}`).focus()
    contactNumber+=1;
}
const removeContact=()=>{
    document.querySelector(`.contact-each.c${contactNumber-1}`).remove()
    contactNumber-=1
}
const errorMessage=(message, code)=>{
    var error=document.querySelector('.error-message')
    error.innerHTML=message
}
const clearForm=()=>{
    var input=document.getElementsByTagName('input');
}
const submit = async (btn) => {
    btn.style.display = 'none'
    document.querySelector('.loading').style.display = 'block'
    var data={}
    data.name=document.querySelector('.input.name').value
    data.gender=document.querySelector('.input.gender').value
    data.blood=document.querySelector('.input.blood').value
    data.contactNumber=document.querySelector('.input.phone').value
    data.email=document.querySelector('.input.email').value
    data.password=document.querySelector('.input.password').value
    data.emergencyContacts=[]
    for(var i=1;i<contactNumber;i++)
    {
        var temp={};
        temp.name=document.querySelector(`.input.name.c${i}`).value
        temp.phone=document.querySelector(`.input.phone.c${i}`).value
        temp.email=document.querySelector(`.input.email.c${i}`).value
        data.emergencyContacts.push(temp)
    }
    for(x in data)
    {
        if(data[x]===''||data.gender==='Gender')
        {
            alert('Fill up the empty fields')
            btn.style.display = 'block'
            document.querySelector('.loading').style.display = 'none'
            return
        }
        if(data.emergencyContacts.length===0)
        {
            alert('Add atleast one emergency contact details')
            btn.style.display = 'block'
            document.querySelector('.loading').style.display = 'none'
            return
        }
    }
    data.emergencyContacts.map((item=>{
        for(x in item)
        {
            if(item[x]==='')
            alert('Fill up the empty fields or remove the extra')
            return
        }
    }))
    console.log(data)
    const url=`${window.location.origin}/api/user/signup`
    await fetch(url,{
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json;charset=utf-8'
        }
    }).then((Response)=>Response.json())
    .then((back)=>{
        console.log(back)
        if(back.status)
        {
            location.assign(`${window.location.origin}/login`)
        }
        else
        {
            errorMessage(back.error, back.code)
            btn.style.display = 'block'
            document.querySelector('.loading').style.display = 'none'
        }
    })
}